import type { NftEditionStock } from "./nft"

/** Formato comum de todo evento em tempo real */
export interface RealtimeEvent<TType extends string, TData> {
  /** Identidade estável: o mesmo evento, reenviado, chega com o mesmo id */
  eventId: string
  type: TType
  /** Recurso afetado (aqui, o id do NFT) */
  resourceId: string
  /** Versão do recurso depois da mudança */
  version: number
  occurredAt: string
  data: TData
}

export type NftUpdatedEvent = RealtimeEvent<
  "nft.updated",
  {
    priceEth: string
    previousPriceEth: string | null
    editions: NftEditionStock[]
  }
>
