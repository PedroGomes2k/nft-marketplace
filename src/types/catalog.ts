import type { NftCategory, NftNetwork } from "./nft"

export type CatalogSort = "recent" | "price-asc" | "price-desc" | "name"

export type CatalogTab = "new" | "trending"

/**
 * Estado do catálogo. Mora na URL (TanStack Router) e é enviado
 * do jeito que está para a API como query string.
 */
export interface CatalogSearch {
  q?: string
  category?: NftCategory
  network?: NftNetwork
  minPrice?: number
  maxPrice?: number
  tab?: CatalogTab
  sort?: CatalogSort
  page?: number
}
