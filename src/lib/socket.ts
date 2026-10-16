import type { Socket } from "socket.io-client"

export const REALTIME_URL = import.meta.env.VITE_REALTIME_URL ?? "wss://realtime.kurio.mock"

let socket: Socket | null = null

export async function getSocket(): Promise<Socket> {
  if (socket) return socket

  const { io } = await import("socket.io-client")
  socket = io(REALTIME_URL, { transports: ["websocket"], autoConnect: false })
  return socket
}