import { delay, HttpResponse } from "msw"
import type { ApiErrorBody } from "@/types/api"
import { getScenario } from "./scenario"

/** Hash simples e estável: a mesma URL sempre gera o mesmo número */
function stableHash(text: string): number {
  let hash = 0
  for (const char of text) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }
  return hash
}

export function apiError(status: number, code: string, message: string) {
  return HttpResponse.json<ApiErrorBody>({ code, message }, { status })
}

/**
 * Aplica o cenário de rede ativo a uma requisição.
 * Devolve uma resposta de falha, ou `undefined` para o handler seguir normalmente.
 */
export async function simulateNetwork(request: Request): Promise<Response | undefined> {
  const scenario = getScenario()

  if (scenario === "slow") {
    await delay(3000)
  } else if (scenario === "jitter") {
    // Entre 0,2 s e 2 s, sempre igual para a mesma URL: dá para reproduzir
    // respostas chegando fora de ordem trocando filtros rapidamente.
    await delay(200 + (stableHash(request.url) % 1800))
  } else {
    await delay()
  }

  if (scenario === "offline") {
    return HttpResponse.error()
  }

  if (scenario === "error") {
    return apiError(500, "INTERNAL_ERROR", "Falha temporária no servidor. Tente novamente.")
  }

  return undefined
}
