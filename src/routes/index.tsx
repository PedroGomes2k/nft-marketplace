import { createFileRoute } from "@tanstack/react-router"
import { Catalog } from "@/components/catalog/Catalog"
import { Hero } from "@/components/home/Hero"
import { MintJournal } from "@/components/home/MintJournal"
import { PromoBanners } from "@/components/home/PromoBanners"
import { parseCatalogSearch } from "@/lib/catalog"
import type { CatalogSearch } from "@/types/catalog"

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => parseCatalogSearch(search),
  component: HomePage,
})

function HomePage() {
  return (
    <>
      <Hero />
      <Catalog />
      <PromoBanners />
      <MintJournal />
    </>
  )
}
