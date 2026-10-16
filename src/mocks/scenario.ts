/**
 * Cenários de rede da API simulada, ativados pela URL: `/?scenario=slow`.
 * O cenário fica salvo até ser trocado (ou até `?reset`).
 */
export type MockScenario =
  | "default" // latência realista curta
  | "slow" // 3 s em toda resposta (mostra os skeletons)
  | "jitter" // latência variável e determinística: respostas fora de ordem
  | "error" // HTTP 500 em toda resposta
  | "offline" // falha de conexão (a requisição nem chega)
  | "empty" // catálogo sem resultados

const STORAGE_KEY = "kurio:mock-scenario"
const VALID: MockScenario[] = ["default", "slow", "jitter", "error", "offline", "empty"]

function isScenario(value: string | null): value is MockScenario {
  return value !== null && VALID.includes(value as MockScenario)
}

export function initScenarioFromUrl(params: URLSearchParams) {
  const fromUrl = params.get("scenario")
  if (isScenario(fromUrl)) {
    try {
      localStorage.setItem(STORAGE_KEY, fromUrl)
    } catch {
      // sem localStorage o cenário vale só para esta página
    }
  }
}

export function resetScenario() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // nada para limpar
  }
}

export function getScenario(): MockScenario {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return isScenario(saved) ? saved : "default"
  } catch {
    return "default"
  }
}
