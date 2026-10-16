import { getRouteApi, Link } from "@tanstack/react-router"
import { SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SORTS, SORT_LABELS, TABS, TAB_LABELS, countActiveFilters } from "@/lib/catalog"
import { cn } from "@/lib/utils"
import type { CatalogSort, CatalogTab } from "@/types/catalog"
import type { NftListFacets } from "@/types/nft"
import { CatalogFilters } from "./CatalogFilters"

const route = getRouteApi("/")

const TAB_ITEMS: { value: CatalogTab | undefined; label: string }[] = [
  { value: undefined, label: "Todos os NFTs" },
  ...TABS.map((tab) => ({ value: tab, label: TAB_LABELS[tab] })),
]

interface CatalogToolbarProps {
  facets: NftListFacets | undefined
  total: number | undefined
}

export function CatalogToolbar({ facets, total }: CatalogToolbarProps) {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const activeFilters = countActiveFilters(search)

  function changeSort(value: string) {
    const sort = value as CatalogSort
    navigate({
      search: (prev) => ({ ...prev, sort: sort === "recent" ? undefined : sort, page: undefined }),
      resetScroll: false,
    })
  }

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border">
        <nav aria-label="Seções do catálogo" className="-mb-px flex gap-6 overflow-x-auto">
          {TAB_ITEMS.map(({ value, label }) => {
            const active = search.tab === value
            return (
              <Link
                key={label}
                from="/"
                to="/"
                search={(prev) => ({ ...prev, tab: value, page: undefined })}
                resetScroll={false}
                activeOptions={{ exact: true }}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "whitespace-nowrap border-b-2 pb-3 text-sm font-bold transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-ring",
                  active ? "border-primary text-primary" : "border-transparent text-foreground",
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 pb-2">
          <Label htmlFor="catalog-sort" className="whitespace-nowrap text-sm font-bold">
            Ordenar por:
          </Label>
          <Select value={search.sort ?? "recent"} onValueChange={changeSort}>
            <SelectTrigger id="catalog-sort" className="border-none px-1 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              {SORTS.map((sort) => (
                <SelectItem key={sort} value={sort}>
                  {SORT_LABELS[sort]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden">
              <SlidersHorizontal />
              Filtros{activeFilters > 0 && ` (${activeFilters})`}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto bg-background">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
              <SheetDescription>
                Os resultados atualizam a cada filtro escolhido.
              </SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-8">
              <CatalogFilters facets={facets} />
            </div>
          </SheetContent>
        </Sheet>

        {search.q && (
          <Link
            from="/"
            to="/"
            search={(prev) => ({ ...prev, q: undefined, page: undefined })}
            resetScroll={false}
            className="inline-flex items-center gap-1 rounded-full border border-primary px-3 py-1 text-xs text-primary hover:bg-primary/10"
          >
            Busca: “{search.q}”
            <X className="size-3.5" aria-hidden="true" />
            <span className="sr-only">(remover busca)</span>
          </Link>
        )}

        {activeFilters > 0 && (
          <Link
            from="/"
            to="/"
            search={(prev) => ({ sort: prev.sort, tab: prev.tab })}
            resetScroll={false}
            className="text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            Limpar filtros
          </Link>
        )}

        <p role="status" className="ml-auto text-xs text-muted-foreground">
          {total !== undefined && `${total} ${total === 1 ? "NFT encontrado" : "NFTs encontrados"}`}
        </p>
      </div>
    </div>
  )
}
