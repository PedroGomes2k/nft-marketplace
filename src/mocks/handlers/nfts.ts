import { http, HttpResponse, delay } from "msw"
import { nftsFixture } from "@/mocks/fixtures/nfts"

export const nftHandlers = [
  http.get("/api/nfts", async () => {
    await delay()
    return HttpResponse.json({
      items: nftsFixture,
      total: nftsFixture.length,
    })
  }),
]