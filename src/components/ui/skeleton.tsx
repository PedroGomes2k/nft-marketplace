import { cn } from "@/lib/utils"

/**
 * Skeleton com efeito shimmer (faixa de brilho passando).
 * Com "reduzir movimento" ativado no sistema, a faixa não aparece.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-md bg-foreground/5",
        "before:absolute before:inset-0 before:animate-shimmer before:bg-linear-to-r before:from-transparent before:via-foreground/10 before:to-transparent",
        "motion-reduce:before:hidden",
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
