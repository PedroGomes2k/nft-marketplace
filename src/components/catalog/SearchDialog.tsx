import { useState, type FormEvent } from "react"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/** Busca do cabeçalho: abre um diálogo e leva o termo para a URL do catálogo */
export function SearchDialog() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const currentQuery = useSearch({ strict: false, select: (search) => search.q })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const q = String(new FormData(event.currentTarget).get("q") ?? "").trim()
    setOpen(false)
    navigate({ to: "/", search: q ? { q } : {}, hash: "catalogo" })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Buscar NFTs">
          <Search />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buscar NFTs</DialogTitle>
          <DialogDescription>Procure por nome, coleção ou ID do token.</DialogDescription>
        </DialogHeader>
        <form role="search" onSubmit={handleSubmit} className="flex gap-2">
          <Label htmlFor="search-q" className="sr-only">
            Termo de busca
          </Label>
          <Input
            id="search-q"
            name="q"
            type="search"
            defaultValue={currentQuery ?? ""}
            placeholder="Ex.: Emerald Ape"
            autoComplete="off"
            className="h-9"
          />
          <Button type="submit" size="lg">
            Buscar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
