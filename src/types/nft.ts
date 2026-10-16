export type NftCategory =
  | "arte-digital"
  | "fotografia"
  | "musica"
  | "arte-3d"
  | "colecionaveis"
  | "generativa"
  | "jogos"
  | "assinaturas"
  | "utilidade"

export type NftNetwork = "ethereum" | "polygon" | "solana"

export type NftEdition = "1/1" | "1/10" | "1/50" | "aberta"

export interface NftEditionStock {
  edition: NftEdition
  available: number
}

export interface Nft {
  id: string
  tokenId: string
  name: string
  collection: string
  /** Imagem grande (960px), usada no destaque e no detalhe */
  image: string
  /** Imagem pequena (480px), usada nos cards */
  thumbnail: string
  /** Valor em ETH como string decimal, ex.: "1.19" */
  priceEth: string
  previousPriceEth: string | null
  category: NftCategory
  network: NftNetwork
  rarity: "comum" | "raro"
  attributes: string[]
  editions: NftEditionStock[]
  trending: boolean
  listedAt: string
  version: number
}

export interface NftListFacets {
  categories: Record<NftCategory, number>
  networks: Record<NftNetwork, number>
  priceRange: { min: string; max: string }
}

export interface NftListResponse {
  items: Nft[]
  page: number
  pageSize: number
  total: number
  totalPages: number
  facets: NftListFacets
}
