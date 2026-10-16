import { ws } from "msw"
import { toSocketIo } from "@mswjs/socket.io-binding"
import { REALTIME_URL } from "@/lib/socket"
import { subscribe } from "@/mocks/events"

const realtime = ws.link(REALTIME_URL)

export const realtimeHandlers = [
  realtime.addEventListener("connection", (connection) => {
    const io = toSocketIo(connection)

    const keepAlive = setInterval(() => connection.client.send("2"), 20_000)

    const unsubscribe = subscribe((event) => io.client.emit(event.type, event))

    connection.client.addEventListener("close", () => {
      clearInterval(keepAlive)
      unsubscribe()
    })
  }),
]
