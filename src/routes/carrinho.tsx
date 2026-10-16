import { createFileRoute, Link } from "@tanstack/react-router"
import { useIsMutating } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/api/client"
import { CartItemRow } from "@/components/cart/CartItemRow"
import { CartSummary } from "@/components/cart/CartSummary"
import { Breadcrumbs } from "@/components/layout/Breadcrumbs"
import { RelatedNfts } from "@/components/nft/RelatedNfts"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  cartKeys,
  useAcknowledgeCart,
  useCart,
  useRemoveCartItem,
  useUpdateCartQuantity,
} from "@/queries/cart"

export const Route = createFileRoute("/carrinho")({
  component: CartPage,
})

function CartPage() {
  const { data: cart, error, isPending, isError, isFetching, refetch } = useCart()
  const updateQuantity = useUpdateCartQuantity()
  const removeItem = useRemoveCartItem()
  const acknowledge = useAcknowledgeCart()
  const updating = useIsMutating({ mutationKey: cartKeys.all }) > 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <Breadcrumbs
        items={[
          { label: "Início", to: "/" },
          { label: "Mercado", to: "/", hash: "catalogo" },
          { label: "Carrinho" },
        ]}
      />
      <h1 className="sr-only">Carrinho de NFTs</h1>

      {isPending ? (
        <CartSkeleton />
      ) : isError ? (
        <div role="alert" className="rounded-lg bg-card px-6 py-12 text-center">
          <p className="font-bold">Não foi possível carregar o carrinho.</p>
          <p className="mt-2 text-sm text-muted-foreground">{getErrorMessage(error)}</p>
          <Button className="mt-6" onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? "Tentando…" : "Tentar novamente"}
          </Button>
        </div>
      ) : cart.items.length === 0 ? (
        <div className="rounded-lg bg-card px-6 py-16 text-center">
          <p className="text-lg font-bold">Seu carrinho está vazio.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Explore o catálogo e escolha seus próximos NFTs.
          </p>
          <Button asChild className="mt-6">
            <Link to="/" hash="catalogo">
              Explorar NFTs
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
          <section aria-labelledby="cart-items-title">
            <h2 id="cart-items-title" className="sr-only">
              Itens do carrinho ({cart.itemCount})
            </h2>

            {cart.hasChanges && (
              <div
                role="alert"
                className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary bg-primary/10 p-4 text-sm"
              >
                <p>
                  <strong>Alguns itens mudaram de preço ou disponibilidade.</strong> Revise os
                  valores marcados antes de finalizar.
                </p>
                <Button
                  size="sm"
                  onClick={() =>
                    acknowledge.mutate(undefined, {
                      onError: (mutationError) => toast.error(getErrorMessage(mutationError)),
                    })
                  }
                  disabled={acknowledge.isPending}
                >
                  Aceitar novos valores
                </Button>
              </div>
            )}

            <div
              aria-hidden="true"
              className="mb-2 hidden grid-cols-[2fr_1fr_1fr_1fr_auto] gap-x-4 px-3 text-sm font-bold md:grid"
            >
              <span>NFTs</span>
              <span>Preço</span>
              <span>Edições</span>
              <span>Total</span>
              <span className="w-8" />
            </div>
            <ul className="space-y-3">
              {cart.items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  disabled={removeItem.isPending}
                  onQuantityChange={(quantity) =>
                    updateQuantity.mutate({ itemId: item.id, quantity })
                  }
                  onRemove={() =>
                    removeItem.mutate(item.id, {
                      onSuccess: () => toast.success(`${item.name} saiu do carrinho.`),
                      onError: (mutationError) =>
                        toast.error(getErrorMessage(mutationError, "Não foi possível remover.")),
                    })
                  }
                />
              ))}
            </ul>
          </section>

          <CartSummary
            cart={cart}
            updating={updating}
            checkoutBlocked={cart.hasChanges}
            checkoutAction={
              cart.hasChanges || updating ? undefined : (
                <Button asChild size="lg" className="w-full">
                  <Link to="/pagamento">Conectar e finalizar</Link>
                </Button>
              )
            }
          />
        </div>
      )}

      <RelatedNfts
        title="Colecionadores também viram"
        excludeIds={cart?.items.map((item) => item.nftId) ?? []}
      />
    </div>
  )
}

function CartSkeleton() {
  return (
    <div role="status" className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
      <span className="sr-only">Carregando carrinho…</span>
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-20 w-full rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-96 w-full rounded-lg" />
    </div>
  )
}
