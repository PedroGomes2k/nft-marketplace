import { expect, test } from "@playwright/test"
import { catalogTitles, chooseFilter, openFresh, waitForCatalog } from "./support.ts"

test.describe("Catálogo", () => {
  test("filtros combinados e ordenação ficam na URL e voltam pelo histórico", async ({ page }) => {
    await openFresh(page, "/")
    await waitForCatalog(page)
    await expect(page.getByText("24 NFTs encontrados")).toBeVisible()

    await chooseFilter(page, /^Arte digital \(\d+\)$/)
    await expect(page).toHaveURL(/category=arte-digital/)
    await chooseFilter(page, /^Ethereum \(\d+\)$/)
    await expect(page).toHaveURL(/network=ethereum/)
    await expect(page.getByText("4 NFTs encontrados")).toBeVisible()

    await page.getByLabel("Ordenar por:").click()
    await page.getByRole("option", { name: "Maior preço" }).click()
    await expect(page).toHaveURL(/sort=price-desc/)
    await expect(catalogTitles(page).first()).toHaveText("Jade Monarch #021")

    await page.reload()
    await expect(catalogTitles(page).first()).toHaveText("Jade Monarch #021")

    await page.goBack()
    await expect(page).not.toHaveURL(/sort=price-desc/)
    await expect(page).toHaveURL(/network=ethereum/)
  })

  test("paginação sobrevive ao refresh e volta pelo histórico", async ({ page }) => {
    await openFresh(page, "/")
    await waitForCatalog(page)
    await expect(catalogTitles(page).first()).toHaveText("Emerald Ape #042")

    await page.getByRole("link", { name: "Página 2" }).click()
    await expect(page).toHaveURL(/page=2/)
    await expect(catalogTitles(page).first()).toHaveText("Crimson Ape #133")

    await page.reload()
    await expect(catalogTitles(page).first()).toHaveText("Crimson Ape #133")
    await expect(page.getByRole("link", { name: "Página 2" })).toHaveAttribute("aria-current", "page")

    await page.goBack()
    await expect(catalogTitles(page).first()).toHaveText("Emerald Ape #042")
  })

  test("mudar um filtro volta para a página 1", async ({ page }) => {
    await openFresh(page, "/?page=2")
    await waitForCatalog(page)
    await chooseFilter(page, /^Música \(\d+\)$/)
    await expect(page).not.toHaveURL(/page=2/)
    await expect(page.getByText("4 NFTs encontrados")).toBeVisible()
  })

  test("busca pelo cabeçalho usando só o teclado", async ({ page }) => {
    await openFresh(page, "/")
    await waitForCatalog(page)

    const searchButton = page.getByRole("button", { name: "Buscar NFTs" })
    await searchButton.focus()
    await page.keyboard.press("Enter")

    const dialog = page.getByRole("dialog", { name: "Buscar NFTs" })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByLabel("Termo de busca")).toBeFocused()

    await page.keyboard.type("golden")
    await page.keyboard.press("Enter")
    await expect(dialog).toBeHidden()
    await expect(page).toHaveURL(/q=golden/)
    await expect(page.getByText("3 NFTs encontrados")).toBeVisible()

    await searchButton.focus()
    await page.keyboard.press("Enter")
    await expect(dialog).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(dialog).toBeHidden()
    await expect(searchButton).toBeFocused()
  })

  test("resultado vazio oferece limpar os filtros", async ({ page }) => {
    await openFresh(page, "/?q=nada-encontrado")
    await expect(page.getByText("Nenhum NFT encontrado.")).toBeVisible()

    await page.getByRole("link", { name: "Limpar filtros" }).last().click()
    await waitForCatalog(page)
    await expect(page.getByText("24 NFTs encontrados")).toBeVisible()
  })

  test("mostra skeletons enquanto a API está lenta", async ({ page }) => {
    await openFresh(page, "/?scenario=slow")
    await expect(page.getByText("Carregando NFTs…")).toBeAttached()
    const gridSkeletons = page.locator("#catalogo [role=status] [data-slot=skeleton]")
    await expect(gridSkeletons.first()).toBeVisible()
    await waitForCatalog(page)
    await expect(gridSkeletons).toHaveCount(0)
  })

  test("falha da API mostra erro e recupera ao tentar de novo", async ({ page }) => {
    await openFresh(page, "/?scenario=error")
    await expect(page.getByText("Não foi possível carregar os NFTs.")).toBeVisible({
      timeout: 20_000,
    })
    await expect(page.getByText("O servidor teve um problema temporário.")).toBeVisible()

    await page.evaluate(() => localStorage.setItem("kurio:mock-scenario", "default"))
    await page.getByRole("button", { name: "Tentar novamente" }).click()
    await waitForCatalog(page)
  })

  test("falha de conexão é explicada ao usuário", async ({ page }) => {
    await openFresh(page, "/?scenario=offline")
    await expect(page.getByText("Sem conexão com o servidor. Verifique sua internet.")).toBeVisible({
      timeout: 20_000,
    })
  })
})
