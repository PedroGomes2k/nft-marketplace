/**
 * Cenários de rede da API simulada, ativados pela URL: `/?scenario=slow`.
 * O cenário fica salvo até ser trocado (ou até `?reset`).
 */
export type MockScenario =
  | "default"
  | "slow"
  | "jitter"
  | "error"
  | "offline"
  | "empty"
  | "write-error"

const STORAGE_KEY = "kurio:mock-scenario"
const VALID: MockScenario[] = [
  "default",
  "slow",
  "jitter",
  "error",
  "offline",
  "empty",
  "write-error",
]

function isScenario(value: string | null): value is MockScenario {
  return value !== null && VALID.includes(value as MockScenario)
}

export function initScenarioFromUrl(params: URLSearchParams) {
  const fromUrl = params.get("scenario")
  if (isScenario(fromUrl)) {
    try {
      localStorage.setItem(STORAGE_KEY, fromUrl)
    } catch (error) {
      console.warn("[mock] não foi possível salvar o cenário", error)
    }
  }
}

export function resetScenario() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn("[mock] não foi possível limpar o cenário", error)
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
