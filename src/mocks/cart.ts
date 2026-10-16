import Decimal from "decimal.js"
import { formatEth, multiplyEth } from "@/lib/eth"
import type { Cart, CartItem, CartQuote } from "@/types/cart"
import type { Nft, NftEdition } from "@/types/nft"
import { readAuth, unauthorized } from "./auth"
import { getDb, type MockCart, type MockCartItem } from "./db"
import { couponsFixture } from "./fixtures/coupons"
import { apiError } from "./network"

export const NETWORK_FEE_ETH = "0.016"

export function cartItemId(nftId: string, edition: NftEdition) {
  return `${nftId}:${edition}`
}

export function findNft(nftId: string): Nft | undefined {
  return getDb().nfts.find((nft) => nft.id === nftId)
}

export function availableFor(nft: Nft, edition: NftEdition): number {
  return nft.editions.find((stock) => stock.edition === edition)?.available ?? 0
}

/**
 * Descobre de quem é o carrinho da requisição:
 * - com sessão válida, o carrinho do usuário
 * - sem sessão, o carrinho de visitante do header X-Cart-Id
 * - com sessão expirada, 401 (o cliente trata a expiração)
 */
export function resolveCart(request: Request): MockCart | Response {
  const db = getDb()
  const auth = readAuth(request)

  if (auth.status === "invalid") return unauthorized()

  if (auth.status === "authenticated") {
    let cart = db.carts.find((item) => item.ownerId === auth.user.id)
    if (!cart) {
      cart = { id: `cart-${auth.user.id}`, ownerId: auth.user.id, items: [], couponCode: null }
      db.carts.push(cart)
    }
    return cart
  }

  const guestId = request.headers.get("X-Cart-Id")
  if (!guestId) return apiError(400, "CART_ID_REQUIRED", "Carrinho não identificado.")

  let cart = db.carts.find((item) => item.id === guestId && item.ownerId === null)
  if (!cart) {
    cart = { id: guestId, ownerId: null, items: [], couponCode: null }
    db.carts.push(cart)
  }
  return cart
}

/** Junta os itens do visitante no carrinho do usuário, respeitando o estoque */
export function mergeGuestCart(guestId: string, userId: string) {
  const db = getDb()
  const guest = db.carts.find((cart) => cart.id === guestId && cart.ownerId === null)
  if (!guest || guest.items.length === 0) return

  let target = db.carts.find((cart) => cart.ownerId === userId)
  if (!target) {
    target = { id: `cart-${userId}`, ownerId: userId, items: [], couponCode: null }
    db.carts.push(target)
  }

  for (const item of guest.items) {
    const nft = findNft(item.nftId)
    if (!nft) continue
    const existing = target.items.find(
      (current) => current.nftId === item.nftId && current.edition === item.edition,
    )
    const limit = availableFor(nft, item.edition)
    if (existing) {
      existing.quantity = Math.min(existing.quantity + item.quantity, limit)
    } else if (limit > 0) {
      target.items.push({ ...item, quantity: Math.min(item.quantity, limit) })
    }
  }
  target.couponCode ??= guest.couponCode
  db.carts = db.carts.filter((cart) => cart !== guest)
}

function stableHash(text: string): string {
  let hash = 0
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return hash.toString(36)
}

function toCartItem(item: MockCartItem): CartItem | null {
  const nft = findNft(item.nftId)
  if (!nft) return null
  const priceChanged = item.priceAtAddEth !== nft.priceEth
  return {
    id: cartItemId(item.nftId, item.edition),
    nftId: nft.id,
    name: nft.name,
    tokenId: nft.tokenId,
    thumbnail: nft.thumbnail,
    edition: item.edition,
    quantity: item.quantity,
    unitPriceEth: nft.priceEth,
    lineTotalEth: multiplyEth(nft.priceEth, item.quantity),
    available: availableFor(nft, item.edition),
    previousUnitPriceEth: priceChanged ? item.priceAtAddEth : null,
  }
}

export function buildQuote(items: CartItem[], couponCode: string | null): CartQuote {
  const subtotal = items.reduce((sum, item) => sum.plus(item.lineTotalEth), new Decimal(0))
  const coupon = couponsFixture.find((item) => item.code === couponCode) ?? null
  const discount = coupon
    ? subtotal.times(coupon.percentOff).dividedBy(100).toDecimalPlaces(6, Decimal.ROUND_DOWN)
    : new Decimal(0)
  const fee = items.length > 0 ? new Decimal(NETWORK_FEE_ETH) : new Decimal(0)
  const total = subtotal.minus(discount).plus(fee)

  const fingerprint = JSON.stringify([
    items.map((item) => [item.id, item.quantity, item.unitPriceEth, item.available]),
    coupon?.code ?? null,
  ])

  return {
    subtotalEth: formatEth(subtotal),
    discountEth: formatEth(discount),
    networkFeeEth: formatEth(fee),
    totalEth: formatEth(total),
    coupon: coupon ? { code: coupon.code, percentOff: coupon.percentOff } : null,
    version: stableHash(fingerprint),
  }
}

export function toCartResponse(cart: MockCart): Cart {
  const items = cart.items.map(toCartItem).filter((item): item is CartItem => item !== null)
  return {
    id: cart.id,
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    quote: buildQuote(items, cart.couponCode),
    hasChanges: items.some(
      (item) => item.previousUnitPriceEth !== null || item.quantity > item.available,
    ),
  }
}
