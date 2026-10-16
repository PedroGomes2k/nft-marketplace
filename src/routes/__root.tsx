import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import type { QueryClient } from "@tanstack/react-query"
import { Header } from "@/components/layout/Header/Header"
import { Footer } from "@/components/layout/Footer/indexFooter"
import { Button } from "@/components/ui/button"

type RouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFound,
})

function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <TanStackRouterDevtools />
    </div>
  )
}

function NotFound() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 text-center md:px-8">
      <p className="text-sm font-bold text-primary">Erro 404</p>
      <h1 className="mt-3 text-3xl font-bold">Página não encontrada</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        O endereço que você acessou não existe ou foi removido.
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link to="/">Voltar ao início</Link>
      </Button>
    </section>
  )
}
