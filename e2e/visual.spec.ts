import { expect, test } from "@playwright/test"
import { addEmeraldApeToCart, openFresh, settleVisuals, waitForCatalog } from "./support.ts"

test.describe("Regressão visual", () => {
  test("início", async ({ page }) => {
    await openFresh(page, "/")
    await waitForCatalog(page)
    await settleVisuals(page)
    await expect(page).toHaveScreenshot("inicio.png", { fullPage: true })
  })

  test("detalhe do NFT", async ({ page }) => {
    await openFresh(page, "/nft/emerald-ape-042")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(page.locator("#related-title ~ ul article").first()).toBeVisible()
    await settleVisuals(page)
    await expect(page).toHaveScreenshot("detalhe.png", { fullPage: true })
  })

  test("carrinho", async ({ page }) => {
    await addEmeraldApeToCart(page, 2)
    await expect(page.locator("#related-title ~ ul article").first()).toBeVisible()
    await settleVisuals(page)
    await expect(page).toHaveScreenshot("carrinho.png", { fullPage: true })
  })
})
