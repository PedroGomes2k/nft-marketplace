import type { User } from "@/types/session"
import { getDb } from "./db"
import { apiError } from "./network"

export const SESSION_TTL_MS = 60 * 60 * 1000

export async function hashPassword(email: string, password: string): Promise<string> {
  const data = new TextEncoder().encode(`kurio:${email.toLowerCase()}:${password}`)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")
}

export function toPublicUser(user: User): User {
  return { id: user.id, name: user.name, username: user.username, email: user.email }
}

type AuthResult =
  | { status: "anonymous" }
  | { status: "invalid" }
  | { status: "authenticated"; user: User; token: string }

/** Lê o header Authorization e diz se a sessão existe e ainda vale */
export function readAuth(request: Request): AuthResult {
  const header = request.headers.get("Authorization")
  if (!header?.startsWith("Bearer ")) return { status: "anonymous" }

  const token = header.slice("Bearer ".length)
  const db = getDb()
  const session = db.sessions.find((item) => item.token === token)
  if (!session || new Date(session.expiresAt).getTime() <= Date.now()) {
    return { status: "invalid" }
  }

  const user = db.users.find((item) => item.id === session.userId)
  if (!user) return { status: "invalid" }

  return { status: "authenticated", user: toPublicUser(user), token }
}

export function unauthorized() {
  return apiError(401, "SESSION_INVALID", "Sua sessão expirou. Entre novamente para continuar.")
}

/** Para rotas privadas: devolve o usuário ou uma resposta 401 */
export function requireUser(request: Request): User | Response {
  const auth = readAuth(request)
  return auth.status === "authenticated" ? auth.user : unauthorized()
}
