import { http, HttpResponse } from "msw"
import { CATEGORIES, NETWORKS, PAGE_SIZE, parseCatalogSearch } from "@/lib/catalog"
import type { CatalogSearch } from "@/types/catalog"
import type { Nft, NftCategory, NftListResponse, NftNetwork } from "@/types/nft"
import { getDb } from "@/mocks/db"
import { apiError, simulateNetwork } from "@/mocks/network"
import { getScenario } from "@/mocks/scenario"

const NEW_RELEASE_DAYS = 7
const DAY_MS = 24 * 60 * 60 * 1000

/** NFTs listados até 7 dias antes do mais recente contam como "novos" */
function newReleaseCutoff(nfts: Nft[]): string {
  const newest = nfts.reduce((max, nft) => (nft.listedAt > max ? nft.listedAt : max), "")
  const cutoff = new Date(new Date(newest).getTime() - NEW_RELEASE_DAYS * DAY_MS)
  return cutoff.toISOString().slice(0, 10)
}

type IgnoredFacet = "category" | "network"

function matches(nft: Nft, search: CatalogSearch, cutoff: string, ignore?: IgnoredFacet) {
  if (search.q) {
    const term = search.q.toLowerCase()
    const haystack = `${nft.name} ${nft.collection} ${nft.tokenId}`.toLowerCase()
    if (!haystack.includes(term)) return false
  }
  if (ignore !== "category" && search.category && nft.category !== search.category) return false
  if (ignore !== "network" && search.network && nft.network !== search.network) return false

  const price = Number(nft.priceEth)
  if (search.minPrice !== undefined && price < search.minPrice) return false
  if (search.maxPrice !== undefined && price > search.maxPrice) return false

  if (search.tab === "trending" && !nft.trending) return false
  if (search.tab === "new" && nft.listedAt < cutoff) return false

  return true
}

function sortNfts(nfts: Nft[], sort: CatalogSearch["sort"]): Nft[] {
  const sorted = [...nfts]
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => Number(a.priceEth) - Number(b.priceEth))
    case "price-desc":
      return sorted.sort((a, b) => Number(b.priceEth) - Number(a.priceEth))
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
    default:
      return sorted.sort((a, b) => b.listedAt.localeCompare(a.listedAt) || a.id.localeCompare(b.id))
  }
}

function countBy<K extends string>(keys: readonly K[], nfts: Nft[], pick: (nft: Nft) => K) {
  const counts = Object.fromEntries(keys.map((key) => [key, 0])) as Record<K, number>
  for (const nft of nfts) counts[pick(nft)] += 1
  return counts
}

function priceRange(nfts: Nft[]) {
  const prices = nfts.map((nft) => nft.priceEth).sort((a, b) => Number(a) - Number(b))
  return { min: prices[0] ?? "0", max: prices[prices.length - 1] ?? "0" }
}

export const nftHandlers = [
  http.get("/api/nfts", async ({ request }) => {
    const failure = await simulateNetwork(request)
    if (failure) return failure

    const url = new URL(request.url)
    const search = parseCatalogSearch(Object.fromEntries(url.searchParams))
    const all = getScenario() === "empty" ? [] : getDb().nfts
    const cutoff = newReleaseCutoff(all)

    const filtered = sortNfts(
      all.filter((nft) => matches(nft, search, cutoff)),
      search.sort,
    )

    const total = filtered.length
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    const page = Math.min(search.page ?? 1, totalPages)
    const start = (page - 1) * PAGE_SIZE

    const body: NftListResponse = {
      items: filtered.slice(start, start + PAGE_SIZE),
      page,
      pageSize: PAGE_SIZE,
      total,
      totalPages,
      facets: {
        // Cada contagem considera os outros filtros ativos, menos o próprio
        categories: countBy<NftCategory>(
          CATEGORIES,
          all.filter((nft) => matches(nft, search, cutoff, "category")),
          (nft) => nft.category,
        ),
        networks: countBy<NftNetwork>(
          NETWORKS,
          all.filter((nft) => matches(nft, search, cutoff, "network")),
          (nft) => nft.network,
        ),
        priceRange: priceRange(all),
      },
    }

    return HttpResponse.json(body)
  }),

  http.get("/api/nfts/:id", async ({ request, params }) => {
    const failure = await simulateNetwork(request)
    if (failure) return failure

    const nft = getDb().nfts.find((item) => item.id === params.id)
    if (!nft) {
      return apiError(404, "NFT_NOT_FOUND", "Este NFT não existe ou foi removido.")
    }

    return HttpResponse.json(nft)
  }),
]
