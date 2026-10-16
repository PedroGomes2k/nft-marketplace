import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuantityStepperProps {
  value: number
  max: number
  min?: number
  /** Nome do item, para os botões dizerem ao leitor de tela o que alteram */
  itemName: string
  disabled?: boolean
  onChange: (value: number) => void
  className?: string
}

const stepButton =
  "flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-40"

export function QuantityStepper({
  value,
  max,
  min = 1,
  itemName,
  disabled = false,
  onChange,
  className,
}: QuantityStepperProps) {
  return (
    <div role="group" aria-label={`Quantidade de ${itemName}`} className={cn("flex items-center gap-3", className)}>
      <button
        type="button"
        className={stepButton}
        aria-label={`Diminuir quantidade de ${itemName}`}
        disabled={disabled || value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <output aria-live="polite" className="min-w-6 text-center text-sm font-bold tabular-nums">
        {value}
      </output>
      <button
        type="button"
        className={stepButton}
        aria-label={`Aumentar quantidade de ${itemName}`}
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}
