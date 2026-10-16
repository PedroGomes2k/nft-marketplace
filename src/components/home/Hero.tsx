import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:px-8 md:py-16"
    >
      <div>
        <p className="text-sm font-bold">Bem-vindo à Kurio</p>
        <h1
          id="hero-title"
          className="mt-4 text-3xl leading-tight font-bold uppercase sm:text-4xl lg:text-5xl"
        >
          Seja dono do futuro da arte digital
        </h1>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
          Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte
          digital rara, apoie artistas e tenha uma parte da cultura da internet.
        </p>
        <Button asChild size="lg" className="mt-8 px-6 uppercase">
          <Link from="/" to="/" search={(prev) => prev} hash="catalogo" resetScroll={false}>
            Explorar
          </Link>
        </Button>
      </div>

      <img
        src="/images/ape-emerald-960.webp"
        srcSet="/images/ape-emerald-480.webp 480w, /images/ape-emerald-960.webp 960w"
        sizes="(min-width: 768px) 448px, 90vw"
        alt="Emerald Ape #042: macaco de óculos redondos e jaqueta verde de colecionador"
        width={960}
        height={960}
        fetchPriority="high"
        className="aspect-square w-full max-w-md justify-self-center rounded-xl object-cover md:justify-self-end"
      />
    </section>
  )
}
