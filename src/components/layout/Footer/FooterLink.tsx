import type { ReactNode } from "react"
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube } from "react-icons/fa"


const linkColumns = [
  {
    title: "Meu perfil",
    links: ["Meu perfil", "Minha coleção", "Atividade", "Estúdio do criador", "Lista de interesse"],
  },
  {
    title: "Central de ajuda",
    links: ["Central de ajuda", "Como comprar NFTs", "Carteira e segurança", "Política do mercado", "Denunciar item"],
  },
  {
    title: "Coleções",
    links: ["Arte digital", "Fotografia", "Música", "Arte 3D", "Utilidade"],
  },
]

const socialLinks = [
  { name: "Facebook", icon: FaFacebookF },
  { name: "Instagram", icon: FaInstagram },
  { name: "X (Twitter)", icon: FaTwitter },
  { name: "LinkedIn", icon: FaLinkedinIn },
  { name: "YouTube", icon: FaYoutube },
]

const wallets = ["MetaMask", "WalletConnect", "Coinbase"]

function DisabledLink({ children }: { children: ReactNode }) {
  return (
    <a
      role="link"
      aria-disabled="true"
      title="Em breve"
      className="cursor-not-allowed text-sm text-foreground"
    >
      {children}
    </a>
  )
}

export function FooterLink() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 lg:grid-cols-4">
        {linkColumns.map((column) => (
          <div key={column.title}>
            <h2 className="mb-4 text-xl font-bold text-foreground">{column.title}</h2>
            <ul className="space-y-3">
              {column.links.map((link) => (
                <li key={link}>
                  <DisabledLink>{link}</DisabledLink>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h2 className="mb-4 text-xl font-bold text-foreground">Redes sociais</h2>
          <ul className="mb-8 flex flex-wrap gap-3">
            {socialLinks.map(({ name, icon: Icon }) => (
              <li key={name}>
                <a
                  role="link"
                  aria-disabled="true"
                  aria-label={name}
                  title="Em breve"
                  className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-md border border-primary text-primary"
                >
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </a>
              </li>
            ))}
          </ul>

          <h2 className="mb-4 text-xl font-bold text-foreground">Carteiras compatíveis</h2>
          <p className="inline-block whitespace-nowrap rounded-md border border-primary/40 bg-footer-band px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-primary">
            {wallets.join(" • ")}
          </p>
        </div>
      </div>
    </section>
  )
}