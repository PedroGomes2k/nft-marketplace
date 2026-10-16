import { Fragment } from "react"
import { Link } from "@tanstack/react-router"

export interface BreadcrumbItem {
  label: string
  /** Sem `to`, o item é a página atual */
  to?: "/" | "/carrinho"
  hash?: string
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Você está em" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm font-bold">
        {items.map((item, index) => (
          <Fragment key={item.label}>
            {index > 0 && (
              <li aria-hidden="true" className="text-muted-foreground">
                /
              </li>
            )}
            <li>
              {item.to ? (
                <Link
                  to={item.to}
                  hash={item.hash}
                  className="hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-muted-foreground">
                  {item.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}
