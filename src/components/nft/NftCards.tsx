import { Link } from "@tanstack/react-router"
import { Skeleton } from "@/components/ui/skeleton"
import type { Nft } from "@/types/nft"

interface NftCardProps {
  nft: Nft
}

export function NftCard({ nft }: NftCardProps) {
  return (
    <article className="group relative h-full rounded-lg bg-card p-3 transition-colors hover:bg-[color-mix(in_srgb,var(--card),var(--primary)_6%)] focus-within:ring-2 focus-within:ring-ring">
      <div className="overflow-hidden rounded-md">
        <img
          src={nft.thumbnail}
          srcSet={`${nft.thumbnail} 480w, ${nft.image} 960w`}
          sizes="(min-width: 1024px) 300px, (min-width: 768px) 33vw, 50vw"
          alt={nft.name}
          width={480}
          height={480}
          loading="lazy"
          decoding="async"
          className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>

      {nft.rarity === "raro" && (
        <span className="absolute left-3 top-3 rounded-sm bg-primary px-2 py-0.5 text-xs font-bold uppercase text-primary-foreground">
          Raro
        </span>
      )}

      <h3 className="mt-3 truncate text-sm font-bold text-foreground">
        <Link
          to="/nft/$nftId"
          params={{ nftId: nft.id }}
          className="after:absolute after:inset-0 focus-visible:outline-none"
        >
          {nft.name}
        </Link>
      </h3>

      <p className="mt-1 text-sm">
        <span className="font-bold text-primary">{nft.priceEth} ETH</span>
        {nft.previousPriceEth && (
          <s className="ml-2 text-muted-foreground">
            <span className="sr-only">Preço anterior: </span>
            {nft.previousPriceEth} ETH
          </s>
        )}
      </p>
    </article>
  )
}

/** Mesmas medidas do card real, para a página não "pular" quando os dados chegam */
export function NftCardSkeleton() {
  return (
    <div className="rounded-lg bg-card p-3">
      <Skeleton className="aspect-square w-full" />
      <Skeleton className="mt-3 h-5 w-3/4" />
      <Skeleton className="mt-1 h-5 w-1/3" />
    </div>
  )
}
