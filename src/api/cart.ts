import { api } from "./client"
import type { AddCartItemInput, Cart } from "@/types/cart"

export async function fetchCart(signal?: AbortSignal) {
  const { data } = await api.get<Cart>("/cart", { signal })
  return data
}

export async function addCartItem(input: AddCartItemInput) {
  const { data } = await api.post<Cart>("/cart/items", input)
  return data
}

export async function updateCartItem(itemId: string, quantity: number) {
  const { data } = await api.patch<Cart>(`/cart/items/${encodeURIComponent(itemId)}`, {
    quantity,
  })
  return data
}

export async function removeCartItem(itemId: string) {
  const { data } = await api.delete<Cart>(`/cart/items/${encodeURIComponent(itemId)}`)
  return data
}

export async function applyCoupon(code: string) {
  const { data } = await api.post<Cart>("/cart/coupon", { code })
  return data
}

export async function removeCoupon() {
  const { data } = await api.delete<Cart>("/cart/coupon")
  return data
}

export async function acknowledgeCartChanges() {
  const { data } = await api.post<Cart>("/cart/acknowledge")
  return data
}
