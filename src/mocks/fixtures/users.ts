import type { User } from "@/types/session"

export interface MockUser extends User {
  /** SHA-256 de `kurio:<email>:<senha>`: a senha nunca fica em texto puro */
  passwordHash: string
}

/**
 * Credenciais fictícias (também no README):
 * - ana@kurio.dev / kurio123
 * - bruno@kurio.dev / kurio123
 */
export const usersFixture: MockUser[] = [
  {
    id: "user-ana",
    name: "Ana Colecionadora",
    username: "ana",
    email: "ana@kurio.dev",
    passwordHash: "be0b6fbedd0774974c457e0974c4cb9790ef9d45dbdd0acf24f862859659a509",
  },
  {
    id: "user-bruno",
    name: "Bruno Artista",
    username: "bruno",
    email: "bruno@kurio.dev",
    passwordHash: "94825dab94f9f2afbd8b12e284c464713d5b93d06d8d132c348729408d12b774",
  },
]
