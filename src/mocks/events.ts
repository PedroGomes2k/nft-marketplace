import type { NftUpdatedEvent } from "@/types/realtime"

/**
 * "Alto-falante" da API simulada: quando um dado muda, o evento é publicado aqui
 * e o servidor de Socket.IO repassa para os clientes conectados.
 */
export type ServerEvent = NftUpdatedEvent

type Listener = (event: ServerEvent) => void

const listeners = new Set<Listener>()
let lastEvent: ServerEvent | null = null

export function publish(event: ServerEvent) {
  lastEvent = event
  listeners.forEach((listener) => listener(event))
}

export function subscribe(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Reenvia o último evento: serve para testar que o cliente ignora duplicatas */
export function resendLastEvent() {
  if (lastEvent) publish(lastEvent)
}
