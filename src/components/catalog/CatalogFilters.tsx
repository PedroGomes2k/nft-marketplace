import { useState, type ReactNode } from "react"
import { getRouteApi, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import {
  CATEGORIES,
  CATEGORY_LABELS,
  NETWORKS,
  NETWORK_LABELS,
  formatPriceLabel,
} from "@/lib/catalog"
import { cn } from "@/lib/utils"
import type { CatalogSearch } from "@/types/catalog"
import type { NftListFacets } from "@/types/nft"

const route = getRouteApi("/")

interface CatalogFiltersProps {
  facets: NftListFacets | undefined
}

/** Painel de filtros: usado na lateral (desktop) e na gaveta (mobile) */
export function CatalogFilters({ facets }: CatalogFiltersProps) {
  const search = route.useSearch()

  return (
    <div className="space-y-8">
      <FilterGroup title="Coleções">
        {CATEGORIES.map((category) => {
          const active = search.category === category
          return (
            <FilterLink
              key={category}
              label={CATEGORY_LABELS[category]}
              count={facets?.categories[category]}
              active={active}
              patch={{ category: active ? undefined : category }}
            />
          )
        })}
      </FilterGroup>

      <section aria-labelledby="filter-price">
        <h3 id="filter-price" className="mb-4 text-sm font-bold text-foreground">
          Faixa de preço
        </h3>
        {facets ? (
          <PriceFilter
            key={`${search.minPrice}-${search.maxPrice}`}
            bounds={{
              min: Number(facets.priceRange.min),
              max: Number(facets.priceRange.max),
            }}
          />
        ) : (
          <Skeleton className="h-16 w-full" />
        )}
      </section>

      <FilterGroup title="Rede">
        {NETWORKS.map((network) => {
          const active = search.network === network
          return (
            <FilterLink
              key={network}
              label={NETWORK_LABELS[network]}
              count={facets?.networks[network]}
              active={active}
              patch={{ network: active ? undefined : network }}
            />
          )
        })}
      </FilterGroup>
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  const id = `filter-${title.toLowerCase()}`
  return (
    <section aria-labelledby={id}>
      <h3 id={id} className="mb-3 text-sm font-bold text-foreground">
        {title}
      </h3>
      <ul className="space-y-1">{children}</ul>
    </section>
  )
}

interface FilterLinkProps {
  label: string
  count: number | undefined
  active: boolean
  patch: Partial<CatalogSearch>
}

/**
 * Cada filtro é um link de verdade: muda a URL, funciona com o botão
 * "voltar" e pode ser aberto em outra aba. Clicar de novo remove o filtro.
 */
function FilterLink({ label, count, active, patch }: FilterLinkProps) {
  return (
    <li>
      <Link
        from="/"
        to="/"
        search={(prev) => ({ ...prev, ...patch, page: undefined })}
        resetScroll={false}
        activeOptions={{ exact: true }}
        aria-current={active ? "true" : undefined}
        className={cn(
          "flex items-center justify-between rounded-sm px-2 py-1.5 text-sm transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-ring",
          active ? "font-bold text-primary" : "text-muted-foreground",
          !active && count === 0 && "opacity-50",
        )}
      >
        <span>
          {active && <span className="sr-only">Filtro ativo: </span>}
          {label}
        </span>
        {count !== undefined && <span className="tabular-nums">({count})</span>}
      </Link>
    </li>
  )
}

function roundPrice(value: number) {
  return Math.round(value * 100) / 100
}

function PriceFilter({ bounds }: { bounds: { min: number; max: number } }) {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const [range, setRange] = useState<number[]>([
    search.minPrice ?? bounds.min,
    search.maxPrice ?? bounds.max,
  ])
  const [min, max] = range

  function applyRange() {
    navigate({
      search: (prev) => ({
        ...prev,
        minPrice: min > bounds.min ? roundPrice(min) : undefined,
        maxPrice: max < bounds.max ? roundPrice(max) : undefined,
        page: undefined,
      }),
      resetScroll: false,
    })
  }

  return (
    <div className="space-y-4">
      <Slider
        min={bounds.min}
        max={bounds.max}
        step={0.01}
        minStepsBetweenThumbs={1}
        value={range}
        onValueChange={setRange}
        thumbLabels={["Preço mínimo", "Preço máximo"]}
      />
      <p className="text-xs text-muted-foreground">
        Preço: {formatPriceLabel(min)} - {formatPriceLabel(max)} ETH
      </p>
      <Button size="sm" onClick={applyRange}>
        Aplicar
      </Button>
    </div>
  )
}
