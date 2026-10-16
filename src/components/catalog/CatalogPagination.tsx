import type { ReactNode } from "react"
import { Link } from "@tanstack/react-router"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

interface CatalogPaginationProps {
  page: number
  totalPages: number
}

export function CatalogPagination({ page, totalPages }: CatalogPaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <Pagination aria-label="Paginação do catálogo" className="mt-10 justify-end">
      <PaginationContent className="gap-1">
        {page > 1 && (
          <PaginationItem>
            <PageLink page={page - 1} label="Página anterior">
              <ChevronLeft aria-hidden="true" />
            </PageLink>
          </PaginationItem>
        )}

        {pages.map((number) => (
          <PaginationItem key={number}>
            <PageLink page={number} label={`Página ${number}`} isCurrent={number === page}>
              {number}
            </PageLink>
          </PaginationItem>
        ))}

        {page < totalPages && (
          <PaginationItem>
            <PageLink page={page + 1} label="Próxima página">
              <ChevronRight aria-hidden="true" />
            </PageLink>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}

interface PageLinkProps {
  page: number
  label: string
  isCurrent?: boolean
  children: ReactNode
}

function PageLink({ page, label, isCurrent = false, children }: PageLinkProps) {
  return (
    <Link
      from="/"
      to="/"
      search={(prev) => ({ ...prev, page: page === 1 ? undefined : page })}
      hash="catalogo"
      activeOptions={{ exact: true }}
      aria-label={label}
      aria-current={isCurrent ? "page" : undefined}
      className={cn(
        buttonVariants({ variant: isCurrent ? "default" : "ghost", size: "icon" }),
        "tabular-nums",
      )}
    >
      {children}
    </Link>
  )
}
