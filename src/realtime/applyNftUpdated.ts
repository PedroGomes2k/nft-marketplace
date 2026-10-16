import type { QueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { cartKeys } from "@/queries/cart"
import { nftKeys } from "@/queries/nfts"
import type { Cart } from "@/types/cart"
import type { Nft, NftDetail, NftListResponse } from "@/types/nft"
import type { NftUpdatedEvent } from "@/types/realtime"

/** Ids dos eventos já aplicados: o mesmo evento nunca é aplicado duas vezes */
const appliedEvents = new Set<string>()

/** Só aplica se o evento for mais novo que o dado da tela: nunca volta no tempo */
function patchNft<T extends Nft>(nft: T, event: NftUpdatedEvent): T {
  if (event.version <= nft.version) return nft
  return { ...nft, ...event.data, version: event.version }
}

export function applyNftUpdated(queryClient: QueryClient, event: NftUpdatedEvent) {
  if (appliedEvents.has(event.eventId)) {
    console.info("[socket] evento repetido ignorado:", event.eventId)
    return
  }
  appliedEvents.add(event.eventId)

  queryClient.setQueryData<NftDetail>(
    nftKeys.detail(event.resourceId),
    (old) => old && patchNft(old, event),
  )
  queryClient.setQueriesData<NftListResponse>({ queryKey: nftKeys.lists() }, (old) =>
    old && {
      ...old,
      items: old.items.map((nft) => (nft.id === event.resourceId ? patchNft(nft, event) : nft)),
    },
  )
  void queryClient.invalidateQueries({ queryKey: nftKeys.lists(), refetchType: "none" })

  const cartItem = queryClient
    .getQueryData<Cart>(cartKeys.all)
    ?.items.find((item) => item.nftId === event.resourceId)

  if (cartItem) {
    void queryClient.invalidateQueries({ queryKey: cartKeys.all })
    toast.warning(
      cartItem.unitPriceEth !== event.data.priceEth
        ? `${cartItem.name} mudou de ${cartItem.unitPriceEth} para ${event.data.priceEth} ETH.`
        : `A disponibilidade de ${cartItem.name} mudou.`,
      { description: "Revise o carrinho antes de finalizar a compra." },
    )
  }
}
