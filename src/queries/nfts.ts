import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { fetchNft, fetchNfts } from "@/api/nfts"
import type { CatalogSearch } from "@/types/catalog"

/**
 * Todas as chaves de cache de NFTs num lugar só.
 * Cada combinação de filtros tem a sua própria "gaveta" no cache.
 */
export const nftKeys = {
  all: ["nfts"] as const,
  lists: () => [...nftKeys.all, "list"] as const,
  list: (search: CatalogSearch) => [...nftKeys.lists(), search] as const,
  details: () => [...nftKeys.all, "detail"] as const,
  detail: (id: string) => [...nftKeys.details(), id] as const,
}

export function useNfts(search: CatalogSearch) {
  return useQuery({
    queryKey: nftKeys.list(search),
    queryFn: ({ signal }) => fetchNfts(search, signal),
    placeholderData: keepPreviousData,
  })
}

export function useNft(id: string) {
  return useQuery({
    queryKey: nftKeys.detail(id),
    queryFn: ({ signal }) => fetchNft(id, signal),
  })
}
