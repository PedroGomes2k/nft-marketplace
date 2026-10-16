import { http, HttpResponse } from "msw"
import { CATEGORIES, NETWORKS, PAGE_SIZE, parseCatalogSearch } from "@/lib/catalog"
import type { CatalogSearch } from "@/types/catalog"
import { NETWORK_LABELS } from "@/lib/catalog"
import type {
  Nft,
  NftCategory,
  NftDetail,
  NftEdition,
  NftListResponse,
  NftNetwork,
} from "@/types/nft"
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

function seed(text: string) {
  let hash = 0
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return hash
}

const REVIEW_AUTHORS = ["Lia M.", "Caio R.", "Tomás V.", "Bia S."]
const REVIEW_COMMENTS = [
  "Arte impecável, os detalhes em alta resolução impressionam.",
  "Compra tranquila e a procedência ficou registrada na hora.",
  "Um dos meus favoritos da coleção. Vale cada ETH.",
  "Acabamento lindo, ótimo para começar a colecionar.",
]

const COLLECTION_CREATOR = "Nova Sato"
const COLLECTION_CONTRACT = "0x7A42f6C1d9E83b5A0c47D2e9B1f8a6C3e05D19E8"
const EDITION_PREFERENCE: NftEdition[] = ["1/50", "1/10", "aberta", "1/1"]

/** Informações da página de detalhe, geradas de forma determinística a partir do NFT */
function toDetail(nft: Nft): NftDetail {
  const base = seed(nft.id)
  const network = NETWORK_LABELS[nft.network]
  const royaltyPercent = 5
  const edition =
    EDITION_PREFERENCE.find((candidate) =>
      nft.editions.some((stock) => stock.edition === candidate && stock.available > 0),
    ) ?? "1/1"
  const editionText = edition === "aberta" ? "de edição aberta" : edition

  return {
    ...nft,
    summary:
      `Um colecionável digital finalizado à mão da coleção ${nft.collection}, ` +
      `verificado na ${network}, com arte desbloqueável e acesso para colecionadores.`,
    description: [
      `${nft.name} é uma obra digital ${editionText} finalizada à mão da coleção ${nft.collection}. ` +
        `Cada atributo fica armazenado nos metadados do token e verificado na ${network}. ` +
        `A obra explora identidade, movimento e luz em um mundo digital sem fronteiras.`,
      `A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores ` +
        `e um registro permanente de procedência registrada na rede. ${COLLECTION_CREATOR} recebe ` +
        `${royaltyPercent}% de direitos autorais nas vendas secundárias, apoiando novos trabalhos ` +
        `e lançamentos da comunidade.`,
    ],
    creator: COLLECTION_CREATOR,
    contractAddress: COLLECTION_CONTRACT,
    royaltyPercent,
    rating: { average: 4.8, count: 19 },
    reviews: [0, 1, 2].map((index) => ({
      id: `${nft.id}-review-${index}`,
      author: REVIEW_AUTHORS[(base + index) % REVIEW_AUTHORS.length],
      rating: 5 - ((base + index) % 2),
      comment: REVIEW_COMMENTS[(base + index) % REVIEW_COMMENTS.length],
      createdAt: `2026-10-${String(10 - index).padStart(2, "0")}`,
    })),
  }
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

    return HttpResponse.json(toDetail(nft))
  }),
]
