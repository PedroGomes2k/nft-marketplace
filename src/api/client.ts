import axios, { isAxiosError } from "axios"
import type { ApiErrorBody } from "@/types/api"
import { getGuestCartId, getStoredToken } from "@/lib/storage"

export const api = axios.create({
  baseURL: "/api",
  timeout: 10_000,
})

// Toda requisição leva a sessão (se houver) e o id do carrinho de visitante
api.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) config.headers.set("Authorization", `Bearer ${token}`)
  config.headers.set("X-Cart-Id", getGuestCartId())
  return config
})

export function getApiError(error: unknown): ApiErrorBody | null {
  if (!isAxiosError<ApiErrorBody>(error)) return null
  return error.response?.data?.code ? error.response.data : null
}

/** Mensagem pronta para mostrar ao usuário, para qualquer tipo de falha */
export function getErrorMessage(error: unknown, fallback = "Algo deu errado. Tente novamente."): string {
  if (isAxiosError(error)) {
    if (error.code === "ECONNABORTED") return "O servidor demorou para responder. Tente novamente."
    if (!error.response) return "Sem conexão com o servidor. Verifique sua internet."
  }
  return getApiError(error)?.message ?? fallback
}

export function getErrorStatus(error: unknown): number | undefined {
  return isAxiosError(error) ? error.response?.status : undefined
}
