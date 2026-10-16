import { getRouteApi, Link } from "@tanstack/react-router"
import { isAxiosError } from "axios"
import { Button } from "@/components/ui/button"
import { NftCard, NftCardSkeleton } from "@/components/nft/NftCards"
import { PAGE_SIZE } from "@/lib/catalog"
import { cn } from "@/lib/utils"
import { useNfts } from "@/queries/nfts"
import { CatalogFilters } from "./CatalogFilters"
import { CatalogPagination } from "./CatalogPagination"
import { CatalogToolbar } from "./CatalogToolbar"
import { FeaturedNft } from "./FeaturedNft"

const route = getRouteApi("/")

const GRID = "grid grid-cols-2 gap-4 md:grid-cols-3"

export function Catalog() {
  const search = route.useSearch()
  const { data, error, isPending, isError, isFetching, isPlaceholderData, refetch } =
    useNfts(search)

  const isUpdating = isFetching && isPlaceholderData

  return (
    <section
      id="catalogo"
      aria-labelledby="catalog-title"
      className="mx-auto max-w-7xl scroll-mt-4 px-4 pb-20 md:px-8"
    >
      <h2 id="catalog-title" className="sr-only">
        Catálogo de NFTs
      </h2>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside aria-label="Filtros do catálogo" className="hidden space-y-8 lg:block">
          <div className="rounded-lg bg-card p-5">
            <CatalogFilters facets={data?.facets} />
          </div>
          <FeaturedNft />
        </aside>

        <div className="min-w-0">
          <CatalogToolbar facets={data?.facets} total={data?.total} />

          {isPending ? (
            <div role="status">
              <span className="sr-only">Carregando NFTs…</span>
              <ul aria-hidden="true" className={GRID}>
                {Array.from({ length: PAGE_SIZE }, (_, index) => (
                  <li key={index}>
                    <NftCardSkeleton />
                  </li>
                ))}
              </ul>
            </div>
          ) : isError && !data ? (
            <ErrorState
              offline={isAxiosError(error) && !error.response}
              retrying={isFetching}
              onRetry={() => refetch()}
            />
          ) : data.items.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {isError && (
                <p role="alert" className="mb-4 text-sm text-destructive">
                  Não foi possível atualizar a lista. Mostrando os últimos dados carregados.
                </p>
              )}
              <ul
                aria-busy={isUpdating}
                className={cn(GRID, "transition-opacity", isUpdating && "opacity-50")}
              >
                {data.items.map((nft) => (
                  <li key={nft.id}>
                    <NftCard nft={nft} />
                  </li>
                ))}
              </ul>
              {data.totalPages > 1 && (
                <CatalogPagination page={data.page} totalPages={data.totalPages} />
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

interface ErrorStateProps {
  offline: boolean
  retrying: boolean
  onRetry: () => void
}

function ErrorState({ offline, retrying, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="rounded-lg bg-card px-6 py-12 text-center">
      <p className="font-bold">Não foi possível carregar os NFTs.</p>
      <p className="mt-2 text-sm text-muted-foreground">
        {offline
          ? "Sem conexão com o servidor. Verifique sua internet."
          : "O servidor teve um problema temporário."}
      </p>
      <Button className="mt-6" onClick={onRetry} disabled={retrying}>
        {retrying ? "Tentando…" : "Tentar novamente"}
      </Button>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-lg bg-card px-6 py-12 text-center">
      <p className="font-bold">Nenhum NFT encontrado.</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Tente remover alguns filtros ou buscar por outro nome.
      </p>
      <Button asChild variant="outline" className="mt-6">
        <Link from="/" to="/" search={(prev) => ({ sort: prev.sort })} resetScroll={false}>
          Limpar filtros
        </Link>
      </Button>
    </div>
  )
}
