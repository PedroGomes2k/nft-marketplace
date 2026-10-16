import type { Nft, NftEdition } from "@/types/nft"
import { nftsFixture } from "./fixtures/nfts"
import { usersFixture, type MockUser } from "./fixtures/users"

/**
 * "Banco de dados" da API simulada.
 * Os handlers leem e alteram este estado; ele é salvo no localStorage
 * para sobreviver ao refresh. `?reset` na URL restaura o cenário inicial.
 */
const STORAGE_KEY = "kurio:mock-db:v1"

export interface MockSession {
  token: string
  userId: string
  expiresAt: string
}

export interface MockCartItem {
  nftId: string
  edition: NftEdition
  quantity: number
  /** Preço no momento em que o item entrou (ou foi revisto) no carrinho */
  priceAtAddEth: string
}

export interface MockCart {
  id: string
  /** `null` = carrinho de visitante, identificado pelo header X-Cart-Id */
  ownerId: string | null
  items: MockCartItem[]
  couponCode: string | null
}

export interface MockFavorite {
  userId: string
  nftId: string
}

export interface MockDb {
  nfts: Nft[]
  users: MockUser[]
  sessions: MockSession[]
  carts: MockCart[]
  favorites: MockFavorite[]
}

function createInitialDb(): MockDb {
  return {
    nfts: structuredClone(nftsFixture),
    users: structuredClone(usersFixture),
    sessions: [],
    carts: [],
    favorites: [],
  }
}

function loadDb(): MockDb {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return { ...createInitialDb(), ...(JSON.parse(saved) as Partial<MockDb>) }
  } catch (error) {
    console.warn("[mock-db] dados salvos ignorados", error)
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
  } catch (error) {
    console.warn("[mock-db] não foi possível salvar no navegador", error)
  }
}

export function resetDb(): void {
  db = createInitialDb()
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn("[mock-db] não foi possível limpar o navegador", error)
  }
}
