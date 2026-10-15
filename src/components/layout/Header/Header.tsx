import { useState } from "react"
import { Link, useLocation } from "@tanstack/react-router"
import { LogIn, Menu, Search, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const focusRing =
    "rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"

type NavLinksProps = {
    orientation: "horizontal" | "vertical"
    onNavigate?: () => void
}

function NavLinks({ orientation, onNavigate }: NavLinksProps) {
    const { pathname } = useLocation()
    const isHome = pathname === "/"
    const isMarketPage = ["/nft", "/carrinho", "/pagamento"].some((path) =>
        pathname.startsWith(path),
    )

    const horizontal = orientation === "horizontal"
    const base = cn(
        "text-sm transition-colors hover:text-primary",
        focusRing,
        horizontal
            ? "flex h-16 items-center border-b-2 border-transparent"
            : "py-3",
    )
    const active = cn("text-primary", horizontal && "border-primary")

    return (
        <>
            <Link to="/" className={cn(base, isHome && active)} onClick={onNavigate}>
                Início
            </Link>

            <Link
                to="/"
                hash="catalogo"
                activeOptions={{ exact: true, includeHash: true }}
                className={cn(base, isMarketPage && active)}
                onClick={onNavigate}
            >
                Mercado
            </Link>

            {/* Fora do escopo do desafio: não podem parecer funcionar */}
            {["Criadores", "Aprenda"].map((label) => (
                <span
                    key={label}
                    aria-disabled="true"
                    title="Em breve"
                    className={cn(
                        base,
                        "cursor-not-allowed text-muted-foreground hover:text-muted-foreground",
                    )}
                >
                    {label}
                </span>
            ))}
        </>
    )
}

export function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    const cartCount = 0 // TODO: vai vir do useCart() quando o carrinho existir

    return (
        <header className="border-b border-border">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:grid md:grid-cols-[1fr_auto_1fr] md:px-8">
                <Link
                    to="/"
                    className={cn("w-fit text-sm font-bold tracking-widest", focusRing)}
                >
                    KURIO
                </Link>

                <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
                    <NavLinks orientation="horizontal" />
                </nav>

                <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" aria-label="Buscar">
                        <Search />
                    </Button>

                    <Button variant="ghost" size="icon" asChild>
                        <Link
                            to="/carrinho"
                            aria-label={`Carrinho, ${cartCount} itens`}
                            className="relative"
                        >
                            <ShoppingCart />
                            <span
                                aria-hidden="true"
                                className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                            >
                                {cartCount}
                            </span>
                        </Link>
                    </Button>

                    <Button size="sm" className="ml-2">
                        <LogIn />
                        <span className="sr-only sm:not-sr-only">Entrar</span>
                    </Button>

                    <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                aria-label="Abrir menu"
                            >
                                <Menu />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="bg-background">
                            <SheetTitle className="px-4 pt-4">Menu</SheetTitle>
                            <nav aria-label="Principal" className="flex flex-col px-4">
                                <NavLinks
                                    orientation="vertical"
                                    onNavigate={() => setMenuOpen(false)}
                                />
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}