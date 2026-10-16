import { QueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"

/**
 * Política de cache e retry (documentada no ARCHITECTURE.md):
 * - dados ficam "frescos" por 30 s, sem refetch desnecessário ao trocar de tela
 * - erros 4xx (ex.: NFT inexistente) não são repetidos, porque repetir não resolve
 * - falhas de rede e 5xx são repetidas até 2 vezes
 * - mutations nunca são repetidas automaticamente (evita compra duplicada)
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: (failureCount, error) => {
          const status = isAxiosError(error) ? error.response?.status : undefined
          if (status !== undefined && status < 500) return false
          return failureCount < 2
        },
      },
      mutations: {
        retry: false,
      },
    },
  })
}
