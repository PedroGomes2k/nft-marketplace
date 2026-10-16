/**
 * Pequenos dados do navegador: o token da sessão e o id do carrinho de visitante.
 * Se o localStorage estiver bloqueado, os valores valem só enquanto a aba estiver aberta.
 */
const TOKEN_KEY = "kurio:session-token"
const CART_KEY = "kurio:cart-id"

const memory = new Map<string, string>()

function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return memory.get(key) ?? null
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    if (value === null) memory.delete(key)
    else memory.set(key, value)
  }
}

export function getStoredToken(): string | null {
  return read(TOKEN_KEY)
}

export function setStoredToken(token: string | null) {
  write(TOKEN_KEY, token)
}

export function getGuestCartId(): string {
  let id = read(CART_KEY)
  if (!id) {
    id = `guest-${crypto.randomUUID()}`
    write(CART_KEY, id)
  }
  return id
}

/** Depois do login o carrinho do visitante é incorporado; o próximo visitante começa outro */
export function renewGuestCartId() {
  write(CART_KEY, null)
}
