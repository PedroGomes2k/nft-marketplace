import type { Nft } from "@/types/nft"
import { nftsFixture } from "./fixtures/nfts"

/**
 * "Banco de dados" da API simulada.
 * Os handlers leem e alteram este estado; ele é salvo no localStorage
 * para sobreviver ao refresh. `?reset` na URL restaura o cenário inicial.
 */
const STORAGE_KEY = "kurio:mock-db:v1"

export interface MockDb {
  nfts: Nft[]
}

function createInitialDb(): MockDb {
  return { nfts: structuredClone(nftsFixture) }
}

function loadDb(): MockDb {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved) as MockDb
  } catch {
    // localStorage indisponível ou dado corrompido: começa do zero
  }
  return createInitialDb()
}

let db = loadDb()

export function getDb(): MockDb {
  return db
}

export function saveDb(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  } catch {
    // sem persistência, o estado continua valendo em memória
  }
}

export function resetDb(): void {
  db = createInitialDb()
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // nada para limpar
  }
}
