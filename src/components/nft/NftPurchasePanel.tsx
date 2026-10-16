import { useId, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Heart, Mail, Star } from "lucide-react"
import { FaLinkedinIn, FaTwitter } from "react-icons/fa"
import { getErrorMessage } from "@/api/client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAddToCart, useCart } from "@/queries/cart"
import type { NftDetail, NftEdition } from "@/types/nft"
import { QuantityStepper } from "./QuantityStepper"

const EDITION_LABELS: Record<NftEdition, string> = {
  "1/1": "1/1",
  "1/10": "1/10",
  "1/50": "1/50",
  aberta: "Aberta",
}

const DEFAULT_EDITION_ORDER: NftEdition[] = ["1/50", "1/10", "aberta", "1/1"]

export function NftPurchasePanel({ nft }: { nft: NftDetail }) {
  const navigate = useNavigate()
  const errorId = useId()
  const { data: cart } = useCart()
  const addToCart = useAddToCart()

  // Como no Figma, a edição 1/50 vem selecionada quando tem estoque
  const firstAvailable = DEFAULT_EDITION_ORDER.find((candidate) =>
    nft.editions.some((stock) => stock.edition === candidate && stock.available > 0),
  )
  const [edition, setEdition] = useState<NftEdition | undefined>(firstAvailable)
  const [quantity, setQuantity] = useState(1)

  const stock = nft.editions.find((item) => item.edition === edition)?.available ?? 0
  const inCart =
    cart?.items.find((item) => item.nftId === nft.id && item.edition === edition)?.quantity ?? 0
  const maxQuantity = Math.max(0, stock - inCart)
  const soldOut = firstAvailable === undefined
  const canBuy = edition !== undefined && maxQuantity > 0 && quantity <= maxQuantity

  function selectEdition(next: NftEdition) {
    setEdition(next)
    setQuantity(1)
    addToCart.reset()
  }

  function buy() {
    if (!edition) return
    addToCart.mutate(
      { nftId: nft.id, edition, quantity },
      { onSuccess: () => navigate({ to: "/carrinho" }) },
    )
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""
  const shareText = `${nft.name} na Kurio`

  return (
    <div>
      <h1 className="text-2xl font-bold md:text-3xl">{nft.name}</h1>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-2xl font-bold text-primary">
          {nft.priceEth} ETH
          {nft.previousPriceEth && (
            <s className="ml-3 text-base font-normal text-muted-foreground">
              <span className="sr-only">Preço anterior: </span>
              {nft.previousPriceEth} ETH
            </s>
          )}
        </p>
        <p className="flex items-center gap-2 text-sm">
          <span className="flex text-primary" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                className={cn("size-4", index < Math.round(nft.rating.average) && "fill-current")}
              />
            ))}
          </span>
          <span>
            <span className="sr-only">Nota {nft.rating.average.toFixed(1)} de 5, </span>
            {nft.rating.count} avaliações de colecionadores
          </span>
        </p>
      </div>

      <hr className="my-5 border-border" />

      <h2 className="text-sm font-bold">Sobre este NFT:</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{nft.description}</p>

      <fieldset className="mt-6">
        <legend className="text-sm font-bold">Edição:</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {nft.editions.map((item) => {
            const unavailable = item.available === 0
            return (
              <label key={item.edition} className={cn(unavailable && "cursor-not-allowed")}>
                <input
                  type="radio"
                  name="edition"
                  value={item.edition}
                  checked={edition === item.edition}
                  disabled={unavailable}
                  onChange={() => selectEdition(item.edition)}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    "inline-flex cursor-pointer items-center rounded-full border border-border px-3 py-1 text-xs font-bold uppercase transition-colors",
                    "hover:border-primary peer-checked:border-primary peer-checked:bg-primary/15 peer-checked:text-primary",
                    "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
                    "peer-disabled:cursor-not-allowed peer-disabled:line-through peer-disabled:opacity-40",
                  )}
                >
                  {EDITION_LABELS[item.edition]}
                  {unavailable && <span className="sr-only"> (esgotada)</span>}
                </span>
              </label>
            )
          })}
        </div>
        {edition && (
          <p className="mt-2 text-xs text-muted-foreground">
            {stock} {stock === 1 ? "unidade disponível" : "unidades disponíveis"}
            {inCart > 0 && ` · ${inCart} no seu carrinho`}
          </p>
        )}
      </fieldset>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <QuantityStepper
          value={quantity}
          max={Math.max(1, maxQuantity)}
          itemName={nft.name}
          disabled={!canBuy || addToCart.isPending}
          onChange={setQuantity}
        />
        <div className="ml-auto flex flex-wrap gap-3">
          <Button
            size="lg"
            className="min-w-36 uppercase"
            disabled={!canBuy || addToCart.isPending}
            aria-describedby={addToCart.isError ? errorId : undefined}
            onClick={buy}
          >
            {addToCart.isPending ? "Adicionando…" : "Comprar"}
          </Button>
          <Button
            size="lg"
            variant="outline"
            aria-disabled="true"
            title="Em breve: entre na sua conta para favoritar"
            className="cursor-not-allowed border-primary text-primary"
          >
            <Heart aria-hidden="true" />
            Favoritar
          </Button>
        </div>
      </div>

      <div aria-live="polite" className="mt-3 text-sm">
        {soldOut && <p className="text-destructive">Todas as edições deste NFT esgotaram.</p>}
        {!soldOut && edition && maxQuantity === 0 && (
          <p className="text-muted-foreground">
            Você já tem todas as unidades disponíveis desta edição no carrinho.
          </p>
        )}
        {addToCart.isError && (
          <p id={errorId} role="alert" className="text-destructive">
            {getErrorMessage(addToCart.error, "Não foi possível adicionar ao carrinho.")}
          </p>
        )}
      </div>

      <dl className="mt-6 space-y-2 text-sm">
        <div className="flex gap-2">
          <dt className="font-bold">ID do token:</dt>
          <dd>{nft.tokenId}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-bold">Coleção:</dt>
          <dd>{nft.collection}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-bold">Atributos:</dt>
          <dd>{[...nft.attributes, ...(nft.rarity === "raro" ? ["Raro"] : [])].join(", ")}</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center gap-3 text-sm">
        <span className="font-bold">Compartilhar este NFT:</span>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartilhar no LinkedIn (abre em nova aba)"
          className="hover:text-primary"
        >
          <FaLinkedinIn aria-hidden="true" />
        </a>
        <a
          href={`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`}
          aria-label="Compartilhar por e-mail"
          className="hover:text-primary"
        >
          <Mail className="size-4" aria-hidden="true" />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartilhar no X (abre em nova aba)"
          className="hover:text-primary"
        >
          <FaTwitter aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}
