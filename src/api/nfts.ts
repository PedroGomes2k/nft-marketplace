import { api } from "./client"
import type { CatalogSearch } from "@/types/catalog"
import type { NftDetail, NftListResponse } from "@/types/nft"

/**
 * O `signal` vem do TanStack Query: quando os filtros mudam antes da resposta
 * chegar, a requisição antiga é cancelada e nunca sobrescreve a nova.
 */
export async function fetchNfts(search: CatalogSearch, signal?: AbortSignal) {
  const { data } = await api.get<NftListResponse>("/nfts", { params: search, signal })
  return data
}

export async function fetchNft(id: string, signal?: AbortSignal) {
  const { data } = await api.get<NftDetail>(`/nfts/${encodeURIComponent(id)}`, { signal })
  return data
}
