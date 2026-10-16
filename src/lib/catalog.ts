import type { CatalogSearch, CatalogSort, CatalogTab } from "@/types/catalog"
import type { NftCategory, NftNetwork } from "@/types/nft"

export const PAGE_SIZE = 9

export const CATEGORY_LABELS: Record<NftCategory, string> = {
  "arte-digital": "Arte digital",
  fotografia: "Fotografia",
  musica: "Música",
  "arte-3d": "Arte 3D",
  colecionaveis: "Colecionáveis",
  generativa: "Generativa",
  jogos: "Jogos",
  assinaturas: "Assinaturas",
  utilidade: "Utilidade",
}

export const NETWORK_LABELS: Record<NftNetwork, string> = {
  ethereum: "Ethereum",
  polygon: "Polygon",
  solana: "Solana",
}

export const SORT_LABELS: Record<CatalogSort, string> = {
  recent: "Listados recentemente",
  "price-asc": "Menor preço",
  "price-desc": "Maior preço",
  name: "Nome (A–Z)",
}

export const TAB_LABELS: Record<CatalogTab, string> = {
  new: "Novos lançamentos",
  trending: "Em alta",
}

export const CATEGORIES = Object.keys(CATEGORY_LABELS) as NftCategory[]
export const NETWORKS = Object.keys(NETWORK_LABELS) as NftNetwork[]
export const SORTS = Object.keys(SORT_LABELS) as CatalogSort[]
export const TABS = Object.keys(TAB_LABELS) as CatalogTab[]

function pickEnum<T extends string>(value: unknown, allowed: readonly T[]): T | undefined {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : undefined
}

function toNumber(value: unknown): number | undefined {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== ""
        ? Number(value)
        : Number.NaN
  return Number.isFinite(parsed) ? parsed : undefined
}

function toText(value: unknown): string | undefined {
  const text = typeof value === "number" ? String(value) : value
  if (typeof text !== "string") return undefined
  const trimmed = text.trim().slice(0, 60)
  return trimmed === "" ? undefined : trimmed
}

/**
 * Valida qualquer objeto de busca (URL do navegador ou query string da API).
 * Valores inválidos são descartados em vez de quebrar a página.
 * É o mesmo contrato usado pelo Router e pelos handlers do MSW.
 */
export function parseCatalogSearch(raw: Record<string, unknown>): CatalogSearch {
  const page = toNumber(raw.page)
  const minPrice = toNumber(raw.minPrice)
  const maxPrice = toNumber(raw.maxPrice)

  return {
    q: toText(raw.q),
    category: pickEnum(raw.category, CATEGORIES),
    network: pickEnum(raw.network, NETWORKS),
    minPrice: minPrice !== undefined && minPrice >= 0 ? minPrice : undefined,
    maxPrice: maxPrice !== undefined && maxPrice >= 0 ? maxPrice : undefined,
    tab: pickEnum(raw.tab, TABS),
    sort: pickEnum(raw.sort, SORTS),
    page: page !== undefined && Number.isInteger(page) && page > 1 ? page : undefined,
  }
}

/** Quantos filtros (além da aba e da ordenação) estão ativos */
export function countActiveFilters(search: CatalogSearch): number {
  return [
    search.q,
    search.category,
    search.network,
    search.minPrice ?? search.maxPrice,
  ].filter((value) => value !== undefined).length
}

/** "0.02" → "0,02", para os rótulos da faixa de preço como no Figma */
export function formatPriceLabel(value: number): string {
  return value.toFixed(2).replace(".", ",")
}
