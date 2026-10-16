import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { getSocket } from "@/lib/socket"
import type { NftUpdatedEvent } from "@/types/realtime"
import { applyNftUpdated } from "./applyNftUpdated"

export function useRealtime() {
  const queryClient = useQueryClient()

  useEffect(() => {
    let active = true
    let cleanup = () => {}

    void getSocket().then((socket) => {
      if (!active) return

      const onConnect = () => console.info("[socket] conectado")
      const onDisconnect = (reason: string) => console.info("[socket] desconectado:", reason)
      const onNftUpdated = (event: NftUpdatedEvent) => applyNftUpdated(queryClient, event)

      socket.on("connect", onConnect)
      socket.on("disconnect", onDisconnect)
      socket.on("nft.updated", onNftUpdated)
      socket.connect()

      cleanup = () => {
        socket.off("connect", onConnect)
        socket.off("disconnect", onDisconnect)
        socket.off("nft.updated", onNftUpdated)
        socket.disconnect()
      }
    })

    return () => {
      active = false
      cleanup()
    }
  }, [queryClient])
}
