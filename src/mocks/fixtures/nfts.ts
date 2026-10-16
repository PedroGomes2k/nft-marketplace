import type { Nft } from "@/types/nft"

function images(name: string): Pick<Nft, "image" | "thumbnail"> {
  return {
    image: `/images/ape-${name}-960.webp`,
    thumbnail: `/images/ape-${name}-480.webp`,
  }
}

const IMG = {
  emerald: images("emerald"),
  violet: images("violet"),
  ivory: images("ivory"),
  golden: images("golden"),
}

function defaults(): Pick<Nft, "collection" | "previousPriceEth" | "rarity" | "editions" | "trending" | "version"> {
  return {
    collection: "Kurio Apes",
    previousPriceEth: null,
    rarity: "comum",
    editions: [
      { edition: "1/1", available: 1 },
      { edition: "1/10", available: 10 },
      { edition: "1/50", available: 50 },
      { edition: "aberta", available: 99 },
    ],
    trending: false,
    version: 1,
  }
}

export const nftsFixture: Nft[] = [
  {
    ...defaults(),
    id: "emerald-ape-042", tokenId: "#0042", name: "Emerald Ape #042", ...IMG.emerald,
    priceEth: "1.19", category: "arte-digital", network: "ethereum",
    attributes: ["Óculos", "Esmeralda"], listedAt: "2026-10-14",
    rarity: "raro", trending: true,
  },
  {
    ...defaults(),
    id: "sage-nomad-009", tokenId: "#0009", name: "Sage Nomad #009", ...IMG.violet,
    priceEth: "1.69", category: "arte-digital", network: "ethereum",
    attributes: ["Chapéu", "Moletom"], listedAt: "2026-10-13",
  },
  {
    ...defaults(),
    id: "neon-vessel-552", tokenId: "#0552", name: "Neon Vessel #552", ...IMG.ivory,
    priceEth: "1.99", previousPriceEth: "2.29", category: "colecionaveis", network: "ethereum",
    attributes: ["Gola alta", "Blazer"], listedAt: "2026-10-12",
    rarity: "raro", trending: true,
  },
  {
    ...defaults(),
    id: "cosmic-bloom-118", tokenId: "#0118", name: "Cosmic Bloom #118", ...IMG.violet,
    priceEth: "1.29", category: "generativa", network: "polygon",
    attributes: ["Chapéu", "Moletom"], listedAt: "2026-10-11",
  },
  {
    ...defaults(),
    id: "violet-nomad-314", tokenId: "#0314", name: "Violet Nomad #314", ...IMG.violet,
    priceEth: "1.39", category: "fotografia", network: "ethereum",
    attributes: ["Chapéu", "Lilás"], listedAt: "2026-10-10",
  },
  {
    ...defaults(),
    id: "ivory-baron-088", tokenId: "#0088", name: "Ivory Baron #088", ...IMG.ivory,
    priceEth: "1.79", category: "arte-3d", network: "ethereum",
    attributes: ["Blazer", "Brinco"], listedAt: "2026-10-09",
    trending: true,
  },
  {
    ...defaults(),
    id: "golden-beat-207", tokenId: "#0207", name: "Golden Beat #207", ...IMG.golden,
    priceEth: "0.99", category: "musica", network: "polygon",
    attributes: ["Fones", "Dourado"], listedAt: "2026-10-08",
  },
  {
    ...defaults(),
    id: "golden-frequency-071", tokenId: "#0071", name: "Golden Frequency #071", ...IMG.golden,
    priceEth: "0.59", category: "musica", network: "solana",
    attributes: ["Fones"], listedAt: "2026-10-07",
  },
  {
    ...defaults(),
    id: "golden-signal-160", tokenId: "#0160", name: "Golden Signal #160", ...IMG.golden,
    priceEth: "0.39", category: "musica", network: "solana",
    attributes: ["Fones"], listedAt: "2026-10-06",
  },
  {
    ...defaults(),
    id: "crimson-ape-133", tokenId: "#0133", name: "Crimson Ape #133", ...IMG.emerald,
    priceEth: "2.49", category: "colecionaveis", network: "ethereum",
    attributes: ["Óculos", "Jaqueta"], listedAt: "2026-10-05",
  },
  {
    ...defaults(),
    id: "jade-monarch-021", tokenId: "#0021", name: "Jade Monarch #021", ...IMG.emerald,
    priceEth: "12.30", category: "arte-digital", network: "ethereum",
    attributes: ["Óculos", "Jade"], listedAt: "2026-10-04",
    rarity: "raro", trending: true,
  },
  {
    ...defaults(),
    id: "ember-nomad-276", tokenId: "#0276", name: "Ember Nomad #276", ...IMG.violet,
    priceEth: "0.89", category: "jogos", network: "polygon",
    attributes: ["Chapéu"], listedAt: "2026-10-03",
  },
  {
    ...defaults(),
    id: "obsidian-duke-005", tokenId: "#0005", name: "Obsidian Duke #005", ...IMG.ivory,
    priceEth: "4.75", category: "arte-digital", network: "ethereum",
    attributes: ["Gola alta", "Ônix"], listedAt: "2026-10-02",
    rarity: "raro",
    editions: [
      { edition: "1/1", available: 0 },
      { edition: "1/10", available: 3 },
      { edition: "1/50", available: 50 },
      { edition: "aberta", available: 99 },
    ],
  },
  {
    ...defaults(),
    id: "amber-pulse-391", tokenId: "#0391", name: "Amber Pulse #391", ...IMG.golden,
    priceEth: "0.25", category: "musica", network: "polygon",
    attributes: ["Fones", "Âmbar"], listedAt: "2026-10-01",
  },
  {
    ...defaults(),
    id: "velvet-drifter-145", tokenId: "#0145", name: "Velvet Drifter #145", ...IMG.violet,
    priceEth: "0.72", category: "assinaturas", network: "solana",
    attributes: ["Moletom"], listedAt: "2026-09-30",
  },
  {
    ...defaults(),
    id: "onyx-scholar-062", tokenId: "#0062", name: "Onyx Scholar #062", ...IMG.ivory,
    priceEth: "3.10", category: "utilidade", network: "ethereum",
    attributes: ["Blazer"], listedAt: "2026-09-29",
  },
  {
    ...defaults(),
    id: "copper-rhythm-218", tokenId: "#0218", name: "Copper Rhythm #218", ...IMG.golden,
    priceEth: "0.45", category: "jogos", network: "solana",
    attributes: ["Fones", "Cobre"], listedAt: "2026-09-28",
    trending: true,
  },
  {
    ...defaults(),
    id: "lime-voyager-099", tokenId: "#0099", name: "Lime Voyager #099", ...IMG.emerald,
    priceEth: "1.05", category: "fotografia", network: "polygon",
    attributes: ["Óculos"], listedAt: "2026-09-27",
  },
  {
    ...defaults(),
    id: "mist-wanderer-187", tokenId: "#0187", name: "Mist Wanderer #187", ...IMG.violet,
    priceEth: "0.15", category: "generativa", network: "solana",
    attributes: ["Chapéu", "Névoa"], listedAt: "2026-09-26",
  },
  {
    ...defaults(),
    id: "pearl-regent-011", tokenId: "#0011", name: "Pearl Regent #011", ...IMG.ivory,
    priceEth: "6.80", previousPriceEth: "7.50", category: "arte-3d", network: "ethereum",
    attributes: ["Pérola", "Blazer"], listedAt: "2026-09-25",
    rarity: "raro",
  },
  {
    ...defaults(),
    id: "solar-groove-344", tokenId: "#0344", name: "Solar Groove #344", ...IMG.golden,
    priceEth: "0.02", category: "utilidade", network: "polygon",
    attributes: ["Fones", "Solar"], listedAt: "2026-09-24",
  },
  {
    ...defaults(),
    id: "moss-ranger-256", tokenId: "#0256", name: "Moss Ranger #256", ...IMG.emerald,
    priceEth: "1.49", category: "jogos", network: "ethereum",
    attributes: ["Óculos", "Musgo"], listedAt: "2026-09-23",
  },
  {
    ...defaults(),
    id: "lilac-hermit-402", tokenId: "#0402", name: "Lilac Hermit #402", ...IMG.violet,
    priceEth: "0.33", category: "assinaturas", network: "polygon",
    attributes: ["Moletom", "Lilás"], listedAt: "2026-09-22",
  },
  {
    ...defaults(),
    id: "slate-envoy-077", tokenId: "#0077", name: "Slate Envoy #077", ...IMG.ivory,
    priceEth: "2.05", category: "colecionaveis", network: "solana",
    attributes: ["Gola alta"], listedAt: "2026-09-21",
  },
]