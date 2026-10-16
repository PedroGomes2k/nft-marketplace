import { createFileRoute } from "@tanstack/react-router"
import { Catalog } from "@/components/catalog/Catalog"
import { Hero } from "@/components/home/Hero"
import { parseCatalogSearch } from "@/lib/catalog"
import type { CatalogSearch } from "@/types/catalog"

export const Route = createFileRoute("/")({
  // Busca, filtros, ordenação e página moram na URL:
  // sobrevivem ao refresh e ao botão "voltar" do navegador.
  validateSearch: (search: Record<string, unknown>): CatalogSearch => parseCatalogSearch(search),
  component: HomePage,
})

function HomePage() {
  return (
    <>
      <Hero />
      <Catalog />
    </>
  )
}
