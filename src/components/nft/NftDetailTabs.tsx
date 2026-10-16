import { Star } from "lucide-react"
import { Tabs as TabsPrimitive } from "radix-ui"
import { NETWORK_LABELS } from "@/lib/catalog"
import type { NftDetail } from "@/types/nft"

const trigger =
  "border-b-2 border-transparent pb-3 text-sm font-bold transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-ring data-[state=active]:border-primary data-[state=active]:text-primary"

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function NftDetailTabs({ nft }: { nft: NftDetail }) {
  return (
    <TabsPrimitive.Root defaultValue="details" className="mt-14">
      <TabsPrimitive.List
        aria-label="Informações do NFT"
        className="flex gap-8 overflow-x-auto border-b border-border"
      >
        <TabsPrimitive.Trigger value="details" className={trigger}>
          Detalhes do NFT
        </TabsPrimitive.Trigger>
        <TabsPrimitive.Trigger value="reviews" className={trigger}>
          Avaliações de colecionadores ({nft.rating.count})
        </TabsPrimitive.Trigger>
      </TabsPrimitive.List>

      <TabsPrimitive.Content
        value="details"
        className="space-y-5 pt-6 text-sm leading-relaxed focus-visible:outline-2 focus-visible:outline-ring"
      >
        {nft.description.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
        <dl className="space-y-4">
          <div>
            <dt className="font-bold">Rede:</dt>
            <dd className="text-muted-foreground">
              Cunhado na {NETWORK_LABELS[nft.network]} com procedência imutável e metadados
              armazenados no IPFS.
            </dd>
          </div>
          <div>
            <dt className="font-bold">Contrato:</dt>
            <dd className="text-muted-foreground">
              <span title={nft.contractAddress}>{shortAddress(nft.contractAddress)}</span> ·
              Contrato inteligente ERC-721 verificado.
            </dd>
          </div>
          <div>
            <dt className="font-bold">Direitos autorais:</dt>
            <dd className="text-muted-foreground">
              Direitos autorais do criador: {nft.royaltyPercent}% nas vendas secundárias, pagos
              automaticamente pelos mercados compatíveis.
            </dd>
          </div>
        </dl>
      </TabsPrimitive.Content>

      <TabsPrimitive.Content
        value="reviews"
        className="pt-6 text-sm focus-visible:outline-2 focus-visible:outline-ring"
      >
        <p className="text-muted-foreground">
          Nota média {nft.rating.average.toFixed(1)} de 5 · mostrando as {nft.reviews.length}{" "}
          avaliações mais recentes de {nft.rating.count}.
        </p>
        <ul className="mt-5 space-y-4">
          {nft.reviews.map((review) => (
            <li key={review.id} className="rounded-lg bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold">{review.author}</p>
                <p className="flex text-primary">
                  <span className="sr-only">Nota {review.rating} de 5</span>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      aria-hidden="true"
                      className={index < review.rating ? "size-3.5 fill-current" : "size-3.5"}
                    />
                  ))}
                </p>
              </div>
              <p className="mt-2 text-muted-foreground">{review.comment}</p>
            </li>
          ))}
        </ul>
      </TabsPrimitive.Content>
    </TabsPrimitive.Root>
  )
}
