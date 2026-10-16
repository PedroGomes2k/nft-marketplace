import { useState } from "react"
import { ZoomIn } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { Nft } from "@/types/nft"

/**
 * Cada NFT tem uma arte; a galeria mostra a obra inteira e três recortes de detalhe,
 * como os quadros do Figma.
 */
const VIEWS = [
  { label: "Obra completa", style: {} },
  { label: "Detalhe do rosto", style: { transform: "scale(1.8)", transformOrigin: "50% 38%" } },
  { label: "Detalhe dos olhos", style: { transform: "scale(2.6)", transformOrigin: "50% 36%" } },
  { label: "Detalhe da roupa", style: { transform: "scale(1.8)", transformOrigin: "50% 92%" } },
] as const

export function NftGallery({ nft }: { nft: Pick<Nft, "name" | "image" | "thumbnail"> }) {
  const [viewIndex, setViewIndex] = useState(0)
  const view = VIEWS[viewIndex]

  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row">
      <ul aria-label="Imagens da galeria" className="flex gap-3 md:flex-col">
        {VIEWS.map((item, index) => (
          <li key={item.label} className="w-1/4 md:w-24">
            <button
              type="button"
              aria-label={`Ver ${item.label.toLowerCase()}`}
              aria-pressed={index === viewIndex}
              onClick={() => setViewIndex(index)}
              className={cn(
                "block w-full overflow-hidden rounded-md border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                index === viewIndex ? "border-primary" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <img
                src={nft.thumbnail}
                alt=""
                width={480}
                height={480}
                loading="lazy"
                decoding="async"
                style={item.style}
                className="aspect-square w-full object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      <div className="relative flex-1 self-start overflow-hidden rounded-lg bg-card">
        <img
          src={nft.image}
          srcSet={`${nft.thumbnail} 480w, ${nft.image} 960w`}
          sizes="(min-width: 1024px) 480px, 100vw"
          alt={`${nft.name}, ${view.label.toLowerCase()}`}
          width={960}
          height={960}
          fetchPriority="high"
          style={view.style}
          className="aspect-square w-full object-cover transition-transform duration-300 motion-reduce:transition-none"
        />
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label="Ampliar imagem"
              className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
            >
              <ZoomIn className="size-5" aria-hidden="true" />
            </button>
          </DialogTrigger>
          <DialogContent aria-describedby={undefined} className="bg-background p-3 sm:max-w-2xl">
            <DialogTitle className="sr-only">{nft.name} ampliado</DialogTitle>
            <div className="overflow-hidden rounded-md">
              <img
                src={nft.image}
                alt={`${nft.name}, ${view.label.toLowerCase()}`}
                width={960}
                height={960}
                style={view.style}
                className="aspect-square w-full object-cover"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
