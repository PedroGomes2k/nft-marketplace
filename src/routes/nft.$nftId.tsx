import { createFileRoute, Link } from "@tanstack/react-router"
import { getErrorMessage, getErrorStatus } from "@/api/client"
import { Breadcrumbs } from "@/components/layout/Breadcrumbs"
import { NftDetailTabs } from "@/components/nft/NftDetailTabs"
import { NftGallery } from "@/components/nft/NftGallery"
import { NftPurchasePanel } from "@/components/nft/NftPurchasePanel"
import { RelatedNfts } from "@/components/nft/RelatedNfts"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useNft } from "@/queries/nfts"

export const Route = createFileRoute("/nft/$nftId")({
  component: NftDetailPage,
})

function NftDetailPage() {
  const { nftId } = Route.useParams()
  const { data: nft, error, isPending, isError, isFetching, refetch } = useNft(nftId)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <Breadcrumbs
        items={[
          { label: "Início", to: "/" },
          { label: "Mercado", to: "/", hash: "catalogo" },
          { label: nft?.name ?? "NFT" },
        ]}
      />

      {isPending ? (
        <DetailSkeleton />
      ) : isError ? (
        getErrorStatus(error) === 404 ? (
          <NotFoundState />
        ) : (
          <div role="alert" className="rounded-lg bg-card px-6 py-12 text-center">
            <p className="font-bold">Não foi possível carregar este NFT.</p>
            <p className="mt-2 text-sm text-muted-foreground">{getErrorMessage(error)}</p>
            <Button className="mt-6" onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? "Tentando…" : "Tentar novamente"}
            </Button>
          </div>
        )
      ) : (
        <>
          <div className="grid gap-10 lg:grid-cols-2">
            <NftGallery nft={nft} />
            <NftPurchasePanel key={nft.id} nft={nft} />
          </div>
          <NftDetailTabs nft={nft} />
        </>
      )}

      <RelatedNfts title="Mais desta coleção" excludeIds={[nftId]} />
    </div>
  )
}

function NotFoundState() {
  return (
    <div className="rounded-lg bg-card px-6 py-16 text-center">
      <h1 className="text-2xl font-bold">NFT não encontrado</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Este NFT não existe ou foi removido do catálogo.
      </p>
      <Button asChild className="mt-6">
        <Link to="/" hash="catalogo">
          Voltar ao catálogo
        </Link>
      </Button>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div role="status" className="grid gap-10 lg:grid-cols-2">
      <span className="sr-only">Carregando NFT…</span>
      <div className="flex flex-col-reverse gap-3 md:flex-row">
        <div className="flex gap-3 md:flex-col">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="aspect-square w-1/4 md:w-24" />
          ))}
        </div>
        <Skeleton className="aspect-square flex-1 rounded-lg" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}
