import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { createQueryClient } from "./lib/query-client"
import { routeTree } from "./routeTree.gen"
import "./index.css"

const queryClient = createQueryClient()

async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MOCKS === "false") return

  const { startMocks } = await import("./mocks/browser")
  await startMocks()
}

function createAppRouter() {
  return createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
  })
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>
  }
}

enableMocking().then(() => {
  const router = createAppRouter()
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </StrictMode>,
  )
})
