import { cartHandlers } from "./cart"
import { nftHandlers } from "./nfts"
import { realtimeHandlers } from "./realtime"

export const handlers = [...nftHandlers, ...cartHandlers, ...realtimeHandlers]