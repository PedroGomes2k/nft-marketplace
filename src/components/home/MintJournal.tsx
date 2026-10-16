const ARTICLES = [
  {
    title: "Como funciona a propriedade de NFTs",
    text: "Aprenda a colecionar, negociar e verificar ativos digitais.",
    image: "/images/ape-ivory-480.webp",
    date: "2026-09-12",
    dateLabel: "12 de setembro",
    readingMinutes: 6,
  },
  {
    title: "10 artistas digitais para acompanhar",
    text: "Conheça criadores que moldam a cultura digital.",
    image: "/images/ape-emerald-480.webp",
    date: "2026-09-13",
    dateLabel: "13 de setembro",
    readingMinutes: 2,
  },
  {
    title: "Raridade, atributos e procedência",
    text: "Entenda raridade, procedência, direitos autorais e utilidade.",
    image: "/images/ape-violet-480.webp",
    date: "2026-09-15",
    dateLabel: "15 de setembro",
    readingMinutes: 3,
  },
  {
    title: "Como proteger sua carteira",
    text: "Proteja sua carteira, seus ativos e sua identidade.",
    image: "/images/ape-golden-480.webp",
    date: "2026-09-15",
    dateLabel: "15 de setembro",
    readingMinutes: 2,
  },
]

export function MintJournal() {
  return (
    <section aria-labelledby="journal-title" className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
      <header className="mb-10 text-center">
        <h2 id="journal-title" className="text-2xl font-bold md:text-3xl">
          Diário da Cunhagem
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
        </p>
      </header>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ARTICLES.map((article) => (
          <li key={article.title}>
            <article className="flex h-full flex-col overflow-hidden rounded-lg bg-card">
              <img
                src={article.image}
                alt=""
                width={480}
                height={360}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="flex flex-1 flex-col gap-2 p-5">
                <p className="text-xs text-muted-foreground">
                  <time dateTime={article.date}>{article.dateLabel}</time>
                  <span aria-hidden="true"> | </span>
                  <span className="sr-only">, </span>
                  Leitura de {article.readingMinutes} min
                </p>
                <h3 className="font-bold leading-snug">{article.title}</h3>
                <p className="text-sm text-muted-foreground">{article.text}</p>
                <a
                  role="link"
                  aria-disabled="true"
                  title="Em breve"
                  className="mt-auto cursor-not-allowed pt-2 text-sm font-bold text-primary"
                >
                  Ler mais <span aria-hidden="true">→</span>
                  <span className="sr-only"> sobre {article.title} (em breve)</span>
                </a>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
