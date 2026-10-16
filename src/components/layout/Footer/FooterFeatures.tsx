

export function FooterFeatures() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-background">
            W
          </div>
          <h2 className="mb-2 font-bold text-foreground">Segurança da carteira</h2>
          <p className="text-sm text-muted-foreground">
            Proteja sua carteira e colecione arte digital verificada com confiança.
          </p>
        </div>

        <div className="lg:border-l lg:border-primary lg:pl-8">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-background">
            C
          </div>
          <h2 className="mb-2 font-bold text-foreground">Criadores em destaque</h2>
          <p className="text-sm text-muted-foreground">
            Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
          </p>
        </div>

        <div className="lg:border-l lg:border-primary lg:pl-8">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-background">
            D
          </div>
          <h2 className="mb-2 font-bold text-foreground">Alertas de lançamentos</h2>
          <p className="text-sm text-muted-foreground">
            Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.
          </p>
        </div>

        <div className="lg:border-l lg:border-primary lg:pl-8">
          <h2 className="mb-2 font-bold text-foreground">Antecipe-se ao próximo lançamento</h2>
          <form className="mb-3 flex">
            <input
              type="email"
              aria-label="Seu e-mail"
              placeholder="digite seu e-mail..."
              disabled
              className="w-full rounded-l-md border border-transparent bg-footer-band px-3 py-2 text-sm placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled
              className="rounded-r-md bg-primary px-4 py-2 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-60"
            >
              Enviar
            </button>
          </form>
          <p className="text-sm text-muted-foreground">
            Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
          </p>
        </div>
      </div>
    </section>
  )
}