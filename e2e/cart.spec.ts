import { expect, test } from "@playwright/test"
import { addEmeraldApeToCart } from "./support.ts"

test.describe("Carrinho", () => {
  test("adiciona do detalhe, aplica cupom e mantém tudo após o refresh", async ({ page }) => {
    await addEmeraldApeToCart(page, 2)

    const row = page.getByRole("listitem").filter({ hasText: "Emerald Ape #042" })
    await expect(row.getByText("2.38 ETH")).toBeVisible()
    await expect(page.getByRole("link", { name: "Carrinho, 2 itens" })).toBeVisible()

    const coupon = page.getByLabel("Código promocional")
    const apply = page.getByRole("button", { name: "Aplicar" })

    await coupon.fill("XYZ")
    await apply.click()
    await expect(page.getByRole("alert").filter({ hasText: "Código promocional inválido." })).toBeVisible()
    await expect(coupon).toHaveAttribute("aria-invalid", "true")

    await coupon.fill("GENESIS5")
    await apply.click()
    await expect(page.getByRole("alert").filter({ hasText: "Este código promocional expirou." })).toBeVisible()

    await coupon.fill("kurio10")
    await apply.click()
    const summary = page.getByRole("region", { name: "Resumo da carteira" })
    await expect(summary.getByText("(-) 0.238 ETH", { exact: true })).toBeVisible()
    await expect(summary.getByText("2.158 ETH", { exact: true })).toBeVisible()

    await page.reload()
    await expect(row.getByText("2.38 ETH")).toBeVisible()
    await expect(summary.getByText("2.158 ETH", { exact: true })).toBeVisible()
  })

  test("remove um item", async ({ page }) => {
    await addEmeraldApeToCart(page)
    await page.getByRole("button", { name: "Remover Emerald Ape #042 do carrinho" }).click()
    await expect(page.getByText("Seu carrinho está vazio.")).toBeVisible()
    await expect(page.getByRole("link", { name: "Carrinho, 0 itens" })).toBeVisible()
  })

  test("atualização otimista volta ao valor anterior quando a API falha", async ({ page }) => {
    await addEmeraldApeToCart(page)
    await page.goto("/carrinho?scenario=write-error")

    const quantity = page.getByRole("group", { name: "Quantidade de Emerald Ape #042" }).locator("output")
    await expect(quantity).toHaveText("1")

    await page.getByRole("button", { name: "Aumentar quantidade de Emerald Ape #042" }).click()
    await expect(quantity).toHaveText("2")
    await expect(page.getByText("Não foi possível salvar a alteração. Tente novamente.")).toBeVisible()
    await expect(quantity).toHaveText("1")
  })
})
