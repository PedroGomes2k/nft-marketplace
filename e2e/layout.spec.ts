import { expect, test, type Page } from "@playwright/test"
import { addEmeraldApeToCart, openFresh, waitForCatalog } from "./support.ts"

async function expectNoHorizontalScroll(page: Page) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
}

test.describe("Layout responsivo", () => {
  test("início não tem rolagem horizontal", async ({ page }) => {
    await openFresh(page, "/")
    await waitForCatalog(page)
    await expectNoHorizontalScroll(page)
  })

  test("detalhe não tem rolagem horizontal", async ({ page }) => {
    await openFresh(page, "/nft/emerald-ape-042")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expectNoHorizontalScroll(page)
  })

  test("carrinho não tem rolagem horizontal", async ({ page }) => {
    await addEmeraldApeToCart(page)
    await expectNoHorizontalScroll(page)
  })
})
