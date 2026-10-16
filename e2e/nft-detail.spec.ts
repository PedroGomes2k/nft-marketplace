import { expect, test } from "@playwright/test"
import { openFresh } from "./support.ts"

test.describe("Detalhe do NFT", () => {
  test("acesso direto pela URL", async ({ page }) => {
    await openFresh(page, "/nft/emerald-ape-042")
    await expect(page.getByRole("heading", { level: 1, name: "Emerald Ape #042" })).toBeVisible()
    await expect(page.getByText("1.19 ETH").first()).toBeVisible()
    await expect(page.getByRole("radio", { name: "1/50", exact: true })).toBeChecked()
  })

  test("NFT inexistente mostra uma tela própria", async ({ page }) => {
    await openFresh(page, "/nft/nao-existe")
    await expect(page.getByRole("heading", { name: "NFT não encontrado" })).toBeVisible()
    await page.getByRole("link", { name: "Voltar ao catálogo" }).click()
    await expect(page.locator("#catalogo")).toBeVisible()
  })

  test("edição esgotada fica indisponível", async ({ page }) => {
    await openFresh(page, "/nft/obsidian-duke-005")
    await expect(page.getByRole("heading", { level: 1, name: "Obsidian Duke #005" })).toBeVisible()
    await expect(page.getByRole("radio", { name: "1/1 (esgotada)", exact: true })).toBeDisabled()
    await expect(page.getByRole("radio", { name: "1/10", exact: true })).toBeEnabled()
  })

  test("quantidade respeita o estoque da edição", async ({ page }) => {
    await openFresh(page, "/nft/obsidian-duke-005")
    await page.getByRole("radio", { name: "1/10", exact: true }).check({ force: true })
    await expect(page.getByText("3 unidades disponíveis")).toBeVisible()

    const increase = page.getByRole("button", { name: "Aumentar quantidade de Obsidian Duke #005" })
    await increase.click()
    await increase.click()
    await expect(increase).toBeDisabled()
  })

  test("rota inexistente mostra a página 404", async ({ page }) => {
    await openFresh(page, "/rota-que-nao-existe")
    await expect(page.getByRole("heading", { name: "Página não encontrada" })).toBeVisible()
  })
})
