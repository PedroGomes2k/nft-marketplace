import type { NftEdition } from "./nft"

export interface CartItem {
  /** `${nftId}:${edition}` — um item por NFT e edição */
  id: string
  nftId: string
  name: string
  tokenId: string
  thumbnail: string
  edition: NftEdition
  quantity: number
  /** Preço atual do catálogo, em ETH (string decimal) */
  unitPriceEth: string
  lineTotalEth: string
  /** Estoque atual da edição */
  available: number
  /** Preço quando o item entrou no carrinho, se mudou desde então */
  previousUnitPriceEth: string | null
}

export interface AppliedCoupon {
  code: string
  percentOff: number
}

export interface CartQuote {
  subtotalEth: string
  discountEth: string
  networkFeeEth: string
  totalEth: string
  coupon: AppliedCoupon | null
  /** Muda sempre que preço, estoque, quantidades ou cupom mudam */
  version: string
}

export interface Cart {
  id: string
  items: CartItem[]
  itemCount: number
  quote: CartQuote
  /** Itens que tiveram preço ou estoque alterados e ainda não foram revistos */
  hasChanges: boolean
}

export interface AddCartItemInput {
  nftId: string
  edition: NftEdition
  quantity: number
}
