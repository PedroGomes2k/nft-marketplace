import { useId, useState, type FormEvent, type ReactNode } from "react"
import { Link } from "@tanstack/react-router"
import { getErrorMessage } from "@/api/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useApplyCoupon, useRemoveCoupon } from "@/queries/cart"
import type { Cart } from "@/types/cart"

interface CartSummaryProps {
  cart: Cart
  updating: boolean
  /** Bloqueia o checkout (carrinho vazio ou mudanças ainda não revistas) */
  checkoutBlocked: boolean
  checkoutAction?: ReactNode
}

export function CartSummary({ cart, updating, checkoutBlocked, checkoutAction }: CartSummaryProps) {
  const { quote } = cart

  return (
    <section aria-labelledby="summary-title" className="rounded-lg bg-card p-5" aria-busy={updating}>
      <h2 id="summary-title" className="border-b border-border pb-3 font-bold">
        Resumo da carteira
      </h2>

      <CouponForm appliedCode={quote.coupon?.code ?? null} percentOff={quote.coupon?.percentOff} />

      <dl className={cn("mt-6 space-y-3 text-sm transition-opacity", updating && "opacity-50")}>
        <SummaryRow label="Subtotal" value={`${quote.subtotalEth} ETH`} />
        <SummaryRow
          label="Desconto do lançamento"
          value={`(-) ${quote.discountEth} ETH`}
        />
        <SummaryRow label="Taxa de rede" value={`${quote.networkFeeEth} ETH`} hint="Taxa estimada" />
        <div className="flex items-center justify-between border-t border-border pt-4 text-base font-bold">
          <dt>Total</dt>
          <dd className="text-primary">{quote.totalEth} ETH</dd>
        </div>
      </dl>
      <p role="status" className="sr-only">
        {updating ? "Atualizando valores…" : `Total ${quote.totalEth} ETH`}
      </p>

      <div className="mt-6 space-y-3">
        {checkoutAction ?? (
          <Button size="lg" className="w-full" disabled={checkoutBlocked || updating}>
            Conectar e finalizar
          </Button>
        )}
        <Link
          to="/"
          hash="catalogo"
          className="block text-center text-sm hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
        >
          Continuar explorando
        </Link>
      </div>
    </section>
  )
}

function SummaryRow({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <dt>{label}</dt>
        <dd className="font-bold tabular-nums">{value}</dd>
      </div>
      {hint && <p className="text-right text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

function CouponForm({ appliedCode, percentOff }: { appliedCode: string | null; percentOff?: number }) {
  const inputId = useId()
  const errorId = useId()
  const [code, setCode] = useState("")
  const applyCoupon = useApplyCoupon()
  const removeCoupon = useRemoveCoupon()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!code.trim()) return
    applyCoupon.mutate(code.trim(), { onSuccess: () => setCode("") })
  }

  if (appliedCode) {
    return (
      <div className="mt-4 flex items-center justify-between rounded-md border border-primary/40 px-3 py-2 text-sm">
        <p>
          Cupom <strong className="text-primary">{appliedCode}</strong> (−{percentOff}%)
        </p>
        <Button
          variant="link"
          size="sm"
          onClick={() => removeCoupon.mutate(undefined)}
          disabled={removeCoupon.isPending}
        >
          Remover
        </Button>
      </div>
    )
  }

  const hasError = applyCoupon.isError

  return (
    <form onSubmit={handleSubmit} className="mt-4" noValidate>
      <Label htmlFor={inputId} className="mb-2 font-bold">
        Código promocional
      </Label>
      <div className="flex">
        <Input
          id={inputId}
          value={code}
          onChange={(event) => {
            setCode(event.target.value)
            if (hasError) applyCoupon.reset()
          }}
          placeholder="Digite o código promocional..."
          autoComplete="off"
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className="h-9 rounded-r-none uppercase placeholder:normal-case"
        />
        <Button
          type="submit"
          size="lg"
          className="rounded-l-none"
          disabled={applyCoupon.isPending}
        >
          {applyCoupon.isPending ? "Aplicando…" : "Aplicar"}
        </Button>
      </div>
      {hasError && (
        <p id={errorId} role="alert" className="mt-2 text-xs text-destructive">
          {getErrorMessage(applyCoupon.error, "Não foi possível aplicar o código.")}
        </p>
      )}
    </form>
  )
}
