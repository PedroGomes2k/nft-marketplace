import { Link } from "@tanstack/react-router"

/** Banner "NFT em destaque" da lateral do catálogo (Figma, desktop) */
export function FeaturedNft() {
  return (
    <section
      aria-labelledby="featured-title"
      className="group relative rounded-lg bg-card p-4 focus-within:ring-2 focus-within:ring-ring"
    >
      <h3 id="featured-title" className="font-bold uppercase leading-tight">
        <span className="block text-primary">NFT em destaque</span>
        <span className="block pl-6 text-foreground">Oferta limitada</span>
      </h3>
      <img
        src="/images/ape-violet-480.webp"
        alt="Cosmic Bloom #118: gorila de chapéu verde e moletom lilás"
        width={480}
        height={480}
        loading="lazy"
        decoding="async"
        className="mt-4 aspect-square w-full rounded-md object-cover"
      />
      <Link
        to="/nft/$nftId"
        params={{ nftId: "cosmic-bloom-118" }}
        className="mt-3 block text-sm font-bold after:absolute after:inset-0 hover:text-primary focus-visible:outline-none"
      >
        Ver Cosmic Bloom #118
      </Link>
    </section>
  )
}
