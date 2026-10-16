import { Link } from "@tanstack/react-router"
import { Trash2 } from "lucide-react"
import { QuantityStepper } from "@/components/nft/QuantityStepper"
import { cn } from "@/lib/utils"
import type { CartItem } from "@/types/cart"

interface CartItemRowProps {
  item: CartItem
  disabled: boolean
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
}

export function CartItemRow({ item, disabled, onQuantityChange, onRemove }: CartItemRowProps) {
  const overStock = item.quantity > item.available

  return (
    <li
      className={cn(
        "grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 rounded-lg bg-card p-3 md:grid-cols-[2fr_1fr_1fr_1fr_auto]",
        (overStock || item.previousUnitPriceEth) && "ring-1 ring-primary",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={item.thumbnail}
          alt=""
          width={56}
          height={56}
          loading="lazy"
          className="size-14 shrink-0 rounded-md object-cover"
        />
        <div className="min-w-0">
          <Link
            to="/nft/$nftId"
            params={{ nftId: item.nftId }}
            className="block truncate text-sm font-bold hover:text-primary"
          >
            {item.name}
          </Link>
          <p className="text-xs text-muted-foreground">
            ID do token: {item.tokenId} · Edição {item.edition === "aberta" ? "aberta" : item.edition}
          </p>
        </div>
      </div>

      <p className="text-sm font-bold md:order-none">
        <span className="sr-only">Preço unitário: </span>
        {item.unitPriceEth} ETH
        {item.previousUnitPriceEth && (
          <span className="block text-xs font-normal text-primary">
            era {item.previousUnitPriceEth} ETH
          </span>
        )}
      </p>

      <div>
        <QuantityStepper
          value={item.quantity}
          max={Math.max(item.available, 1)}
          itemName={item.name}
          disabled={disabled}
          onChange={onQuantityChange}
        />
        {overStock && (
          <p className="mt-1 text-xs text-primary">
            {item.available === 0
              ? "Edição esgotada"
              : `Só ${item.available === 1 ? "resta 1" : `restam ${item.available}`}`}
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 md:contents">
        <p className="text-sm font-bold text-primary">
          <span className="sr-only">Total do item: </span>
          {item.lineTotalEth} ETH
        </p>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          aria-label={`Remover ${item.name} do carrinho`}
          className="flex size-8 items-center justify-center rounded-md text-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-40"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      </div>
    </li>
  )
}
