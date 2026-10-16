import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/nft/$nftId")({
  component: NftDetailPage,
})

function NftDetailPage() {
  const { nftId } = Route.useParams()
  return <p className="p-8">Detalhe do NFT: {nftId}</p>
}