import Decimal from "decimal.js"
import { formatEth } from "@/lib/eth"
import type { Nft, NftEdition } from "@/types/nft"
import { getDb, saveDb } from "./db"
import { publish, resendLastEvent } from "./events"

function findNftOrThrow(nftId: string): Nft {
  const nft = getDb().nfts.find((item) => item.id === nftId)
  if (!nft) throw new Error(`NFT "${nftId}" não existe`)
  return nft
}

/** Salva a mudança, sobe a versão do NFT e avisa os clientes conectados */
function commitNftChange(nft: Nft) {
  nft.version += 1
  saveDb()
  publish({
    eventId: `nft.updated:${nft.id}:v${nft.version}`,
    type: "nft.updated",
    resourceId: nft.id,
    version: nft.version,
    occurredAt: new Date().toISOString(),
    data: {
      priceEth: nft.priceEth,
      previousPriceEth: nft.previousPriceEth,
      editions: structuredClone(nft.editions),
    },
  })
}

export function changeNftPrice(nftId: string, priceEth: string) {
  const nft = findNftOrThrow(nftId)
  nft.previousPriceEth = nft.priceEth
  nft.priceEth = formatEth(priceEth)
  commitNftChange(nft)
}

export function changeStock(nftId: string, edition: NftEdition, available: number) {
  const nft = findNftOrThrow(nftId)
  const stock = nft.editions.find((item) => item.edition === edition)
  if (!stock) throw new Error(`Edição "${edition}" não existe`)
  stock.available = available
  commitNftChange(nft)
}

/** Atalho para a demonstração: aumenta 10% o preço do primeiro NFT que estiver num carrinho */
export function raiseCartItemPrice() {
  const item = getDb().carts.flatMap((cart) => cart.items)[0]
  if (!item) throw new Error("Nenhum carrinho tem itens. Adicione um NFT primeiro.")
  const nft = findNftOrThrow(item.nftId)
  changeNftPrice(nft.id, new Decimal(nft.priceEth).times(1.1).toDecimalPlaces(2).toString())
}

/**
 * Controles da simulação, chamados pelo console do navegador ou pelos testes:
 *   kurioMock.raiseCartItemPrice()
 *   kurioMock.changeNftPrice("emerald-ape-042", "1.49")
 *   kurioMock.changeStock("emerald-ape-042", "1/50", 0)
 *   kurioMock.resendLastEvent()
 */
export function installMockControls() {
  Object.assign(window, {
    kurioMock: { changeNftPrice, changeStock, raiseCartItemPrice, resendLastEvent },
  })
}
