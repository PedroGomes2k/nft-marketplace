import { Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CatalogSearch } from "@/types/catalog"

interface Promo {
  title: string
  text: string
  image: string
  search: CatalogSearch
  linkLabel: string
}

const PROMOS: Promo[] = [
  {
    title: "Lançamentos gênesis de edição limitada",
    text: "Colecione edições escassas diretamente dos criadores antes da revelação pública.",
    image: "/images/ape-emerald-480.webp",
    search: { tab: "new" },
    linkLabel: "os lançamentos gênesis",
  },
  {
    title: "Arte digital selecionada e muito mais",
    text: "Explore novos artistas, coleções verificadas e obras digitais que definem a cultura da internet.",
    image: "/images/ape-ivory-480.webp",
    search: { category: "arte-digital" },
    linkLabel: "a arte digital selecionada",
  },
]

export function PromoBanners() {
  return (
    <section aria-label="Destaques da Kurio" className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
      <ul className="grid gap-8 lg:grid-cols-2">
        {PROMOS.map((promo) => (
          <li key={promo.title}>
            <article className="grid h-full overflow-hidden rounded-xl bg-card sm:grid-cols-2">
              <img
                src={promo.image}
                alt=""
                width={480}
                height={480}
                loading="lazy"
                decoding="async"
                className="aspect-square h-full w-full rounded-xl object-cover"
              />
              <div className="flex flex-col items-end justify-center gap-3 p-6 text-right">
                <h2 className="text-lg leading-snug font-bold">{promo.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{promo.text}</p>
                <Button asChild size="lg" className="mt-2 px-5">
                  <Link to="/" search={promo.search} hash="catalogo">
                    Explorar<span className="sr-only"> {promo.linkLabel}</span>
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
