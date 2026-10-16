import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  acknowledgeCartChanges,
  addCartItem,
  applyCoupon,
  fetchCart,
  removeCartItem,
  removeCoupon,
  updateCartItem,
} from "@/api/cart"
import { getErrorMessage } from "@/api/client"
import { multiplyEth } from "@/lib/eth"
import type { Cart } from "@/types/cart"

export const cartKeys = {
  all: ["cart"] as const,
}

export function useCart() {
  return useQuery({
    queryKey: cartKeys.all,
    queryFn: ({ signal }) => fetchCart(signal),
  })
}

/** Toda mutation do carrinho devolve o carrinho atualizado: ele vira o novo cache */
function useCartMutation<TVariables>(
  name: string,
  mutationFn: (variables: TVariables) => Promise<Cart>,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [...cartKeys.all, name],
    mutationFn,
    onSuccess: (cart) => queryClient.setQueryData(cartKeys.all, cart),
  })
}

export function useAddToCart() {
  return useCartMutation("add", addCartItem)
}

export function useRemoveCartItem() {
  return useCartMutation("remove", removeCartItem)
}

export function useApplyCoupon() {
  return useCartMutation("coupon", applyCoupon)
}

export function useRemoveCoupon() {
  return useCartMutation("remove-coupon", () => removeCoupon())
}

export function useAcknowledgeCart() {
  return useCartMutation("acknowledge", () => acknowledgeCartChanges())
}

const QUANTITY_KEY = [...cartKeys.all, "quantity"] as const

/**
 * Alterar quantidade é a atualização otimista do projeto:
 * a tela muda na hora e, se a API recusar, volta ao valor anterior.
 * Cliques rápidos viram uma fila (`scope`), enviada na ordem em que aconteceram.
 */
export function useUpdateCartQuantity() {
  const queryClient = useQueryClient()
  const isLastInQueue = () => queryClient.isMutating({ mutationKey: QUANTITY_KEY }) === 1

  return useMutation({
    mutationKey: QUANTITY_KEY,
    scope: { id: "cart-quantity" },
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItem(itemId, quantity),

    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.all })
      const previous = queryClient.getQueryData<Cart>(cartKeys.all)

      if (previous) {
        const items = previous.items.map((item) =>
          item.id === itemId
            ? { ...item, quantity, lineTotalEth: multiplyEth(item.unitPriceEth, quantity) }
            : item,
        )
        queryClient.setQueryData<Cart>(cartKeys.all, {
          ...previous,
          items,
          itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        })
      }
      return { previous }
    },

    onError: (error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(cartKeys.all, context.previous)
      toast.error(getErrorMessage(error, "Não foi possível alterar a quantidade."))
    },

    onSuccess: (cart) => {
      if (isLastInQueue()) queryClient.setQueryData(cartKeys.all, cart)
    },

    onSettled: (_cart, error) => {
      if (error && isLastInQueue()) void queryClient.invalidateQueries({ queryKey: cartKeys.all })
    },
  })
}
