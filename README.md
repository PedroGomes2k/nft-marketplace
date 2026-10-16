# Kurio · Marketplace de NFTs

Marketplace de NFTs feito em React + TypeScript para o **Desafio Frontend da Jungle Gaming**, seguindo o layout do Figma do projeto.

Toda a "API" do projeto é simulada no próprio navegador com **MSW**: catálogo, carrinho, cupons e eventos em tempo real (Socket.IO) funcionam sem nenhum backend, inclusive na versão publicada.

**Demo:** _adicione aqui a URL da Vercel depois do deploy_

---

## O que já funciona

| Área | Status | Destaques |
|---|---|---|
| Catálogo (Início) | ✅ | Busca, filtros combináveis (coleção, rede, faixa de preço), abas, ordenação e paginação **na URL**: sobrevivem ao refresh e ao botão "voltar" |
| Estados de carregamento | ✅ | Skeleton com shimmer (respeita "reduzir movimento"), tela vazia, erro com "tentar novamente" (diferencia falha de servidor e falta de conexão) |
| Detalhe do NFT | ✅ | Galeria com zoom, edições (esgotadas desabilitadas), quantidade limitada ao estoque, NFT inexistente com tela própria |
| Carrinho | ✅ | Quantidades com **atualização otimista e rollback**, remoção, cupom (válido, inválido e expirado), totais calculados com `decimal.js`, persistência após refresh |
| Destaques e Diário da Cunhagem | ✅ | Os banners levam ao catálogo já filtrado; os artigos editoriais aparecem como "Em breve" |
| Tempo real (`nft.updated`) | ✅ | Preço e estoque mudam ao vivo no catálogo, no detalhe e no carrinho; eventos repetidos ou antigos são ignorados; a finalização fica bloqueada até o usuário revisar os novos valores |
| Login, cadastro e sessão | 🚧 | Usuários e sessão já existem na API simulada; faltam as telas |
| Pagamento, confirmação e pedidos | 🚧 | Rota criada; faltam formulário, pedido idempotente e `order.updated` |
| Reconexão com reconciliação | 🚧 | Próximo passo do tempo real |
| Testes E2E (Playwright) | ✅ | 25 cenários, rodados em desktop e celular: catálogo, detalhe, carrinho, tempo real, layout responsivo e regressão visual |
| Relatório Lighthouse | 🚧 | Próximo passo |
| Perfil, Carteiras e Favoritos | ⏸️ | Fora desta entrega; os botões aparecem como "Em breve" e não fingem funcionar |

---

## Stack

| Tecnologia | Uso no projeto |
|---|---|
| **React 19 + TypeScript** | Interface, com contratos tipados entre API, cache e tela (`src/types`) |
| **TanStack Router** | Rotas por arquivo, parâmetros de busca validados (`validateSearch`) e página 404 |
| **TanStack Query** | Cache, estados de carregamento/erro, cancelamento de respostas antigas, mutations e atualização otimista |
| **Axios** | Cliente HTTP único (`src/api/client.ts`), com interceptor que envia sessão e id do carrinho |
| **Socket.IO** | Eventos em tempo real (`socket.io-client`), simulados com `@mswjs/socket.io-binding` |
| **MSW** | API REST e servidor de tempo real simulados na camada de rede |
| **Tailwind CSS v4 + shadcn/ui** | Estilo e componentes acessíveis (Radix), adaptados às cores do Figma |
| **decimal.js** | Contas com valores em ETH sem erro de ponto flutuante |
| **Playwright** | Testes E2E no navegador real, em desktop e celular, com regressão visual |
| **Vite** | Build e servidor de desenvolvimento |

---

## Como rodar

Pré-requisito: **Node.js 20.19 ou mais recente**.

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`. A API simulada liga sozinha.

| Comando | O que faz |
|---|---|
| `npm run dev` | Desenvolvimento com a API simulada |
| `npm run build` | Verifica os tipos e gera a versão de produção em `dist/` |
| `npm run preview` | Serve a versão de produção localmente |
| `npm run typecheck` | Verificação de tipos do TypeScript |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Testes E2E com Playwright (gera o build e sobe o servidor sozinho) |
| `npm run test:e2e:ui` | Abre a interface do Playwright para ver os testes rodando |
| `npm run test:e2e:update` | Recria as imagens de referência da regressão visual |
| `npm run test:e2e:report` | Abre o relatório HTML da última execução |

### Variáveis de ambiente

Nenhuma é obrigatória. Para mudar algo, copie `.env.example` para `.env`:

| Variável | Padrão | Para que serve |
|---|---|---|
| `VITE_ENABLE_MOCKS` | `true` | `false` desliga o MSW (para usar um backend real) |
| `VITE_REALTIME_URL` | `wss://realtime.kurio.mock` | Endereço do servidor Socket.IO |

---

## API simulada (MSW)

O app faz requisições HTTP de verdade pelo Axios e não sabe que os dados são simulados. O MSW intercepta as chamadas na camada de rede (Service Worker). Nenhum componente ou hook contém dados fictícios.

Os dados ficam num "banco" em memória (`src/mocks/db.ts`), salvo no `localStorage` para sobreviver ao refresh.

### Endpoints

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/nfts` | Lista com `q`, `category`, `network`, `minPrice`, `maxPrice`, `tab`, `sort` e `page`. Devolve itens, paginação e contagens por filtro |
| `GET` | `/api/nfts/:id` | Detalhe do NFT (`404` se não existir) |
| `GET` | `/api/cart` | Carrinho com itens, totais e versão da cotação |
| `POST` | `/api/cart/items` | Adiciona item (`409` se passar do estoque) |
| `PATCH` | `/api/cart/items/:itemId` | Altera a quantidade |
| `DELETE` | `/api/cart/items/:itemId` | Remove o item |
| `POST` / `DELETE` | `/api/cart/coupon` | Aplica (`422` se inválido ou expirado) ou remove o cupom |
| `POST` | `/api/cart/acknowledge` | Aceita as mudanças de preço/estoque dos itens |

Erros seguem sempre o formato `{ code, message }`.

O carrinho do visitante é identificado pelo header `X-Cart-Id`, gerado no navegador.

### Cenários de teste

Ative pela URL, por exemplo `http://localhost:5173/?scenario=slow`. O cenário fica salvo até ser trocado.

| Cenário | Efeito |
|---|---|
| `default` | Latência curta e realista |
| `slow` | 3 s em cada resposta (mostra os skeletons) |
| `jitter` | Latência variável e determinística, para respostas fora de ordem |
| `error` | HTTP 500 em todas as respostas |
| `offline` | Falha de conexão |
| `empty` | Catálogo sem resultados |
| `write-error` | Só as alterações falham (mostra o rollback da atualização otimista) |

**`?reset`** restaura os dados e o cenário iniciais.

### Dados de teste

- 24 NFTs em 9 coleções e 3 redes, com preços de 0.02 a 12.30 ETH
- Cupons: `KURIO10` (10% de desconto) e `GENESIS5` (expirado)
- Contas fictícias, já preparadas para o login: `ana@kurio.dev` e `bruno@kurio.dev`, ambas com senha `kurio123` (guardadas como hash, nunca em texto puro)

---

## Tempo real (Socket.IO)

O cliente usa o `socket.io-client` de verdade. Quem responde é um servidor Socket.IO simulado pelo MSW (`src/mocks/handlers/realtime.ts`), que repassa os eventos publicados pela API simulada.

Evento disponível: **`nft.updated`**, com identidade estável (`eventId`), recurso afetado (`resourceId`) e versão (`version`).

- Evento repetido (mesmo `eventId`) é ignorado.
- Evento antigo (versão menor ou igual à da tela) não altera nada.
- Detalhe e catálogo são atualizados direto no cache; o carrinho é buscado de novo na API, porque totais e cotação são calculados lá.

Para disparar eventos, use o console do navegador:

```js
kurioMock.raiseCartItemPrice()                        // +10% no preço de um NFT do carrinho
kurioMock.changeNftPrice("emerald-ape-042", "1.49")   // muda o preço de um NFT
kurioMock.changeStock("emerald-ape-042", "1/50", 0)   // esgota uma edição
kurioMock.resendLastEvent()                           // reenvia o último evento (duplicata)
```

Os comandos alteram o servidor simulado; o aviso chega à tela pelo socket, como chegaria de um servidor real.

---

## Testes E2E (Playwright)

Os testes abrem o app de verdade num Chromium, sobre o build de produção (`npm run build` + `npm run preview`), com a mesma API simulada pelo MSW. Cada cenário roda duas vezes: **desktop** (1440 × 900) e **celular** (Pixel 7).

### Primeira vez

```bash
npx playwright install chromium
npm run test:e2e:update
npm run test:e2e
```

O `test:e2e:update` cria as imagens de referência da regressão visual (`e2e/visual.spec.ts-snapshots/`). Elas devem ser commitadas. Se uma mudança no layout for intencional, rode o comando de novo e commite as novas imagens.

### O que é testado

| Arquivo | Cenários |
|---|---|
| `catalog.spec.ts` | Filtros combinados e ordenação na URL (refresh e "voltar"), paginação com refresh e histórico, troca de filtro voltando à página 1, busca só pelo teclado, resultado vazio com "limpar filtros", skeletons com API lenta, erro de servidor com "tentar novamente", falha de conexão |
| `nft-detail.spec.ts` | Acesso direto pela URL, NFT inexistente, edição esgotada desabilitada, quantidade limitada ao estoque, rota 404 |
| `cart.spec.ts` | Adicionar a partir do detalhe, cupom inválido, expirado e válido, totais, persistência após refresh, remoção, rollback da atualização otimista quando a API recusa |
| `realtime.spec.ts` | Mudança de preço via Socket.IO com o NFT no carrinho (aviso, finalização bloqueada até aceitar), evento repetido ignorado, preço ao vivo no detalhe |
| `layout.spec.ts` | Nenhuma página tem rolagem horizontal |
| `visual.spec.ts` | Regressão visual de Início, Detalhe e Carrinho |

Os eventos em tempo real são disparados pelo servidor simulado (`window.kurioMock`), nunca direto na tela. A interface só muda quando o evento chega pelo socket.

Cada teste começa com `?reset`, então nenhum depende de outro e todos podem rodar em paralelo.

---

## Estrutura

Camadas, fluxo de dados, tempo real e decisões técnicas estão detalhados no [ARCHITECTURE.md](./ARCHITECTURE.md).

```
e2e/              Testes E2E (Playwright)
src/
├── api/          Chamadas HTTP (Axios), uma função por endpoint
├── queries/      Hooks do TanStack Query (cache, mutations, atualização otimista)
├── realtime/     Conexão Socket.IO e aplicação dos eventos no cache
├── routes/       Páginas (rotas por arquivo do TanStack Router)
├── components/   Componentes por área: catalog, nft, cart, home, layout, ui (shadcn)
├── lib/          Utilitários: cálculo em ETH, validação dos filtros, armazenamento
├── types/        Contratos tipados (NFT, carrinho, catálogo, sessão, eventos)
└── mocks/        API simulada: banco, fixtures, handlers REST e Socket.IO, cenários
```

---

## Decisões técnicas

- **Estado na URL.** Busca, filtros, ordenação e página são parâmetros validados pelo TanStack Router. Mudar qualquer filtro volta para a página 1.
- **A API filtra, não o componente.** O handler do MSW recebe a query string, filtra, ordena e pagina, como um backend real faria.
- **Respostas fora de ordem.** Cada combinação de filtros tem sua própria chave de cache, e o `AbortSignal` cancela a requisição anterior.
- **Valores em ETH como texto.** Preços trafegam como string decimal (`"1.19"`) e as contas usam `decimal.js`.
- **Atualização otimista.** Alterar a quantidade no carrinho muda a tela na hora; se a API recusar, o valor volta e um aviso aparece. Cliques rápidos viram uma fila, enviada em ordem.
- **Política de cache.** Dados ficam frescos por 30 s; erros `4xx` não são repetidos; falhas de rede e `5xx` são repetidas até 2 vezes; mutations nunca são repetidas sozinhas (`src/lib/query-client.ts`).
- **Socket.IO carregado sob demanda.** O cliente é importado só depois que o MSW começa a interceptar o WebSocket. Se fosse carregado antes, a conexão escaparia da simulação. Bônus: ele sai do pacote inicial.
- **Imagens.** Os PNGs do Figma (cerca de 2 MB cada) viraram WebP de 480 e 960 px (15 a 60 KB), servidos com `srcset`. A imagem principal é pré-carregada.

### Desvios do Figma

- A fonte do Figma está numa variável oculta; foi usada a **JetBrains Mono**, monoespaçada como a do layout.
- As contagens das coleções vêm dos dados simulados, por isso são menores que as do Figma.
- Na aba "Detalhes do NFT", o Figma troca os rótulos: o texto de royalties aparece em "Contrato" e o endereço do contrato em "Direitos autorais". Aqui cada informação está sob o rótulo certo.
- O Figma chama a coleção de "Kurio Editions" na descrição e de "Kurio Apes" na ficha do NFT. Aqui o nome vem sempre do mesmo campo (`collection`).
- O texto do banner "Arte digital selecionada e muito mais" está cortado no Figma ("...obras digitais que definem a"). Foi completado como "...que definem a cultura da internet".

---

## Deploy (Vercel)

O projeto já tem `vercel.json` com o build e o redirecionamento das rotas para o `index.html`, para que acesso direto e refresh funcionem em qualquer página. Não é preciso configurar variáveis de ambiente.

1. Envie o código para o GitHub.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório. O preset **Vite** é detectado sozinho.
3. Clique em **Deploy**. Cada novo `git push` publica uma nova versão.

---

## Uso de IA

Este projeto foi desenvolvido com o Claude (Anthropic) como par de programação. A IA gerou parte do código e explicou as decisões técnicas; eu conduzi o escopo, revisei e testei cada etapa no navegador antes de commitar.
