import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import type { QueryClient } from "@tanstack/react-query"
import { Header } from "@/components/layout/Header/Header"
import { Footer } from "@/components/layout/Footer/indexFooter"

type RouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
      <Footer />
    </div>
  )
}
