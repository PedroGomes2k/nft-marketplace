import { expect, type Page } from "@playwright/test"

interface KurioMockControls {
  changeNftPrice: (nftId: string, priceEth: string) => void
  changeStock: (nftId: string, edition: string, available: number) => void
  raiseCartItemPrice: () => void
  resendLastEvent: () => void
}

type KurioWindow = Window & { kurioMock: KurioMockControls }

/** Abre uma página com a API simulada no estado inicial */
export async function openFresh(page: Page, path: string) {
  const separator = path.includes("?") ? "&" : "?"
  await page.goto(`${path}${separator}reset`)
}

export async function waitForCatalog(page: Page) {
  await expect(page.locator("#catalogo article h3").first()).toBeVisible()
}

export function catalogTitles(page: Page) {
  return page.locator("#catalogo article h3")
}

/** Clica num filtro da lateral (desktop) ou da gaveta "Filtros" (mobile) */
export async function chooseFilter(page: Page, name: RegExp) {
  const drawerButton = page.getByRole("button", { name: /^Filtros/ })
  if (await drawerButton.isVisible()) {
    await drawerButton.click()
    await page.getByRole("dialog").getByRole("link", { name }).click()
    await page.keyboard.press("Escape")
    await expect(page.getByRole("dialog")).toBeHidden()
  } else {
    await page
      .getByRole("complementary", { name: "Filtros do catálogo" })
      .getByRole("link", { name })
      .click()
  }
}

export async function waitForRealtime(page: Page) {
  await expect(page.locator("html")).toHaveAttribute("data-realtime", "connected")
}

export async function changeNftPrice(page: Page, nftId: string, priceEth: string) {
  await page.evaluate(
    ([id, price]) => (window as unknown as KurioWindow).kurioMock.changeNftPrice(id, price),
    [nftId, priceEth] as const,
  )
}

export async function resendLastEvent(page: Page) {
  await page.evaluate(() => (window as unknown as KurioWindow).kurioMock.resendLastEvent())
}

/** Coloca 1 unidade do Emerald Ape #042 (edição 1/50) no carrinho e abre o carrinho */
export async function addEmeraldApeToCart(page: Page, quantity = 1) {
  await openFresh(page, "/nft/emerald-ape-042")
  await expect(page.getByRole("heading", { level: 1, name: "Emerald Ape #042" })).toBeVisible()
  for (let index = 1; index < quantity; index += 1) {
    await page.getByRole("button", { name: "Aumentar quantidade de Emerald Ape #042" }).click()
  }
  await page.getByRole("button", { name: "Comprar" }).click()
  await expect(page).toHaveURL(/\/carrinho$/)
  await expect(page.getByRole("heading", { name: "Resumo da carteira" })).toBeVisible()
}

/** Carrega todas as imagens e fontes antes de uma captura de tela */
export async function settleVisuals(page: Page) {
  await page.evaluate(async () => {
    for (const image of Array.from(document.images)) image.loading = "eager"
    await Promise.all(
      Array.from(document.images).map((image) =>
        image.complete
          ? null
          : new Promise((resolve) => {
              image.addEventListener("load", resolve, { once: true })
              image.addEventListener("error", resolve, { once: true })
            }),
      ),
    )
    await document.fonts.ready
  })
}
