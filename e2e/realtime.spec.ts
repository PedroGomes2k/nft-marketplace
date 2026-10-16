import { expect, test } from "@playwright/test"
import {
  addEmeraldApeToCart,
  changeNftPrice,
  openFresh,
  resendLastEvent,
  waitForRealtime,
} from "./support.ts"

test.describe("Tempo real (Socket.IO)", () => {
  test("preço muda com o NFT no carrinho e a finalização exige revisão", async ({ page }) => {
    await addEmeraldApeToCart(page)
    await waitForRealtime(page)

    const checkout = page.getByRole("link", { name: "Conectar e finalizar" })
    await expect(checkout).toBeVisible()

    await changeNftPrice(page, "emerald-ape-042", "1.49")

    await expect(page.getByText("Alguns itens mudaram de preço ou disponibilidade.")).toBeVisible()
    await expect(page.getByText("era 1.19 ETH")).toBeVisible()
    await expect(page.getByText("Emerald Ape #042 mudou de 1.19 para 1.49 ETH.")).toBeVisible()
    await expect(checkout).toHaveCount(0)

    await page.getByRole("button", { name: "Aceitar novos valores" }).click()
    await expect(checkout).toBeVisible()
    const summary = page.getByRole("region", { name: "Resumo da carteira" })
    await expect(summary.getByText("1.506 ETH", { exact: true })).toBeVisible()
  })

  test("evento repetido é ignorado", async ({ page }) => {
    await addEmeraldApeToCart(page)
    await waitForRealtime(page)
    await changeNftPrice(page, "emerald-ape-042", "1.49")
    await expect(page.getByText("era 1.19 ETH")).toBeVisible()

    const ignored = page.waitForEvent("console", {
      predicate: (message) => message.text().includes("evento repetido ignorado"),
    })
    await resendLastEvent(page)
    await ignored
    await expect(page.getByText(/mudou de 1\.19 para 1\.49 ETH/)).toHaveCount(1)
  })

  test("preço atualiza ao vivo na página de detalhe", async ({ page }) => {
    await openFresh(page, "/nft/sage-nomad-009")
    await expect(page.getByRole("heading", { level: 1, name: "Sage Nomad #009" })).toBeVisible()
    await waitForRealtime(page)

    await changeNftPrice(page, "sage-nomad-009", "2.05")
    await expect(page.getByText("2.05 ETH").first()).toBeVisible()
    await expect(page.getByText("Preço anterior:").first()).toBeAttached()
  })
})
