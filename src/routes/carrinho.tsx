import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/carrinho")({
  component: CartPage,
})

// Provisório: a página do carrinho é o próximo passo
function CartPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <h1 className="text-2xl font-bold">Carrinho</h1>
      <p className="mt-2 text-sm text-muted-foreground">Em construção.</p>
    </section>
  )
}
