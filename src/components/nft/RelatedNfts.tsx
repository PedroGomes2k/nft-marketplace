import { NftCard, NftCardSkeleton } from "./NftCards"
import { useNfts } from "@/queries/nfts"

interface RelatedNftsProps {
  title: string
  excludeIds: string[]
}

/** Faixa de recomendações ("Mais desta coleção", "Colecionadores também viram") */
export function RelatedNfts({ title, excludeIds }: RelatedNftsProps) {
  const { data, isPending, isError } = useNfts({})
  if (isError) return null

  const items = data?.items.filter((nft) => !excludeIds.includes(nft.id)).slice(0, 5) ?? []

  return (
    <section aria-labelledby="related-title" className="mt-16">
      <h2 id="related-title" className="border-b border-border pb-3 font-bold text-primary">
        {title}
      </h2>
      <ul className="mt-6 grid snap-x auto-cols-[45%] grid-flow-col gap-4 overflow-x-auto pb-2 md:auto-cols-auto md:grid-flow-row md:grid-cols-5 md:overflow-visible">
        {isPending
          ? Array.from({ length: 5 }, (_, index) => (
              <li key={index} aria-hidden="true">
                <NftCardSkeleton />
              </li>
            ))
          : items.map((nft) => (
              <li key={nft.id} className="snap-start">
                <NftCard nft={nft} />
              </li>
            ))}
      </ul>
    </section>
  )
}
