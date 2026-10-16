import { setupWorker } from "msw/browser"
import { handlers } from "./handlers"
import { resetDb } from "./db"
import { initScenarioFromUrl, resetScenario } from "./scenario"

export const worker = setupWorker(...handlers)

/**
 * Liga a API simulada.
 * - `?reset` restaura os dados e o cenário iniciais
 * - `?scenario=nome` escolhe o cenário de rede (ver scenario.ts)
 */
export async function startMocks() {
  const params = new URLSearchParams(window.location.search)

  if (params.has("reset")) {
    resetDb()
    resetScenario()
  }
  initScenarioFromUrl(params)

  // Tira os parâmetros de controle da URL: um refresh não pode resetar os dados de novo
  if (params.has("reset") || params.has("scenario")) {
    params.delete("reset")
    params.delete("scenario")
    const query = params.toString()
    const url = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`
    window.history.replaceState(window.history.state, "", url)
  }

  await worker.start({ onUnhandledRequest: "bypass" })
}
