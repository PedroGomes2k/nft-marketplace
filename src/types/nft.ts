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
    image: string
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