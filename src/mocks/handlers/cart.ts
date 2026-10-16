import { http, HttpResponse } from "msw"
import type { AddCartItemInput } from "@/types/cart"
import type { NftEdition } from "@/types/nft"
import {
  availableFor,
  cartItemId,
  findNft,
  resolveCart,
  toCartResponse,
} from "@/mocks/cart"
import { saveDb } from "@/mocks/db"
import { couponsFixture } from "@/mocks/fixtures/coupons"
import { apiError, simulateNetwork } from "@/mocks/network"

function isValidQuantity(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1
}

function limitError(available: number) {
  return apiError(
    409,
    "QUANTITY_LIMIT",
    available === 0
      ? "Esta edição esgotou."
      : `Só ${available === 1 ? "resta 1 unidade" : `restam ${available} unidades`} desta edição.`,
  )
}

export const cartHandlers = [
  http.get("/api/cart", async ({ request }) => {
    const failure = await simulateNetwork(request)
    if (failure) return failure

    const cart = resolveCart(request)
    if (cart instanceof Response) return cart
    saveDb()
    return HttpResponse.json(toCartResponse(cart))
  }),

  http.post("/api/cart/items", async ({ request }) => {
    const failure = await simulateNetwork(request)
    if (failure) return failure

    const cart = resolveCart(request)
    if (cart instanceof Response) return cart

    const body = (await request.json()) as Partial<AddCartItemInput>
    if (!body.nftId || !body.edition || !isValidQuantity(body.quantity)) {
      return apiError(400, "VALIDATION_ERROR", "Escolha a edição e uma quantidade válida.")
    }

    const nft = findNft(body.nftId)
    if (!nft) return apiError(404, "NFT_NOT_FOUND", "Este NFT não existe ou foi removido.")

    const available = availableFor(nft, body.edition)
    const existing = cart.items.find(
      (item) => item.nftId === body.nftId && item.edition === body.edition,
    )
    const nextQuantity = (existing?.quantity ?? 0) + body.quantity
    if (nextQuantity > available) return limitError(available - (existing?.quantity ?? 0))

    if (existing) {
      existing.quantity = nextQuantity
    } else {
      cart.items.push({
        nftId: nft.id,
        edition: body.edition,
        quantity: body.quantity,
        priceAtAddEth: nft.priceEth,
      })
    }
    saveDb()
    return HttpResponse.json(toCartResponse(cart), { status: 201 })
  }),

  http.patch("/api/cart/items/:itemId", async ({ request, params }) => {
    const failure = await simulateNetwork(request)
    if (failure) return failure

    const cart = resolveCart(request)
    if (cart instanceof Response) return cart

    const item = cart.items.find(
      (current) => cartItemId(current.nftId, current.edition) === params.itemId,
    )
    if (!item) return apiError(404, "CART_ITEM_NOT_FOUND", "Este item não está mais no carrinho.")

    const body = (await request.json()) as { quantity?: unknown }
    if (!isValidQuantity(body.quantity)) {
      return apiError(400, "VALIDATION_ERROR", "Quantidade inválida.")
    }

    const nft = findNft(item.nftId)
    const available = nft ? availableFor(nft, item.edition as NftEdition) : 0
    if (body.quantity > available) return limitError(available)

    item.quantity = body.quantity
    saveDb()
    return HttpResponse.json(toCartResponse(cart))
  }),

  http.delete("/api/cart/items/:itemId", async ({ request, params }) => {
    const failure = await simulateNetwork(request)
    if (failure) return failure

    const cart = resolveCart(request)
    if (cart instanceof Response) return cart

    cart.items = cart.items.filter(
      (item) => cartItemId(item.nftId, item.edition) !== params.itemId,
    )
    saveDb()
    return HttpResponse.json(toCartResponse(cart))
  }),

  http.post("/api/cart/coupon", async ({ request }) => {
    const failure = await simulateNetwork(request)
    if (failure) return failure

    const cart = resolveCart(request)
    if (cart instanceof Response) return cart

    const body = (await request.json()) as { code?: unknown }
    const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : ""
    const coupon = couponsFixture.find((item) => item.code === code)

    if (!coupon) return apiError(422, "COUPON_INVALID", "Código promocional inválido.")
    if (new Date(coupon.expiresAt).getTime() < Date.now()) {
      return apiError(422, "COUPON_EXPIRED", "Este código promocional expirou.")
    }

    cart.couponCode = coupon.code
    saveDb()
    return HttpResponse.json(toCartResponse(cart))
  }),

  http.delete("/api/cart/coupon", async ({ request }) => {
    const failure = await simulateNetwork(request)
    if (failure) return failure

    const cart = resolveCart(request)
    if (cart instanceof Response) return cart

    cart.couponCode = null
    saveDb()
    return HttpResponse.json(toCartResponse(cart))
  }),

  /** O usuário viu as mudanças de preço/estoque: os valores atuais passam a valer */
  http.post("/api/cart/acknowledge", async ({ request }) => {
    const failure = await simulateNetwork(request)
    if (failure) return failure

    const cart = resolveCart(request)
    if (cart instanceof Response) return cart

    for (const item of cart.items) {
      const nft = findNft(item.nftId)
      if (!nft) continue
      item.priceAtAddEth = nft.priceEth
      item.quantity = Math.min(item.quantity, availableFor(nft, item.edition))
    }
    cart.items = cart.items.filter((item) => item.quantity > 0)
    saveDb()
    return HttpResponse.json(toCartResponse(cart))
  }),
]
