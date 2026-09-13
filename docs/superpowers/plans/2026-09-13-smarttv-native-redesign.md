# Redesign SmartTV Nativo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Capturar screenshots do estado atual (Home, MovieDetail, NotFound) e redesenhar a identidade visual do app para uma UX de app nativo de Smart TV (rail de navegação lateral, hero full-bleed, foco com identidade própria), substituindo a paleta genérica estilo Netflix e o meta-string com middot (tell genérico de design).

**Architecture:** Mudança CSS-first via tokens centralizados (`tokens.css`) + um componente novo (`NavRail`, substituindo `Header`) + ajustes de layout em `App.tsx` (rail lateral fixo em vez de header superior, com `nextFocusResolver` trocando eixo vertical por horizontal) + reestruturação de `Hero`, `MovieCard`/`CarouselRow` (glow de foco) e `MovieDetail` (hero full-bleed + elenco convertido de grid para carrossel horizontal, mantendo navegação em eixo único).

**Tech Stack:** React 19, TypeScript, Vite, Norigin Spatial Navigation. Sem test runner configurado — verificação via `npm run build`, `npm run lint` e validação visual/manual com o CLI `chrome-devtools` (start/new_page/resize_page/press_key/take_screenshot), simulando navegação por controle remoto.

**Spec:** Pedido do usuário nesta conversa — "tirar screenshots das páginas atuais para análise e transformar o frontend design atual em UI/UX de aplicativo streaming para TV, com UI /frontend-design:frontend-design e UX igual aplicativo nativo de SmartTV dentro da viewport do Browser." Direção estética definida nesta sessão aplicando a skill `frontend-design` (ver plano de design abaixo).

## Plano de design (frontend-design)

**Cor** (paleta nomeada, vernacular de "cinema/projetor", substitui o vermelho Netflix `#e50914` que é o tell mais óbvio de template):

| Token                    | Valor                      | Papel                                                                     |
| ------------------------ | -------------------------- | ------------------------------------------------------------------------- |
| `--color-bg`             | `#0b0d12`                  | obsidiana com leve matiz azulado — "cinema à noite"                       |
| `--color-surface`        | `#14171f`                  | superfícies elevadas (cards, botões secundários)                          |
| `--color-surface-raised` | `#1e222c`                  | superfícies mais elevadas (badges, chips)                                 |
| `--color-text`           | `#f2f0ea`                  | branco quente, "papel de cópia de filme"                                  |
| `--color-text-muted`     | `#9a9fb0`                  | texto secundário                                                          |
| `--color-accent`         | `#e8a33d`                  | âmbar de lâmpada de projetor — único acento de cor do app                 |
| `--color-accent-soft`    | `rgba(232, 163, 61, 0.16)` | fundo de badges/chips com o acento                                        |
| `--color-focus`          | `#e8a33d`                  | anel de foco agora usa o acento (identidade própria, não branco genérico) |

**Tipografia:** duas famílias claramente distintas, ambas via Google Fonts (mesmo CDN já usado no `index.html`):

- **Bebas Neue** (condensada, maiúscula) — exclusiva para o título do filme no Hero e no MovieDetail (o "momento pôster/marquise de cinema"), nunca em títulos de seção ou rótulos genéricos.
- **Manrope** (400/500/700/800) — toda a UI: nav, botões, meta, nomes de elenco, títulos de carrossel (case normal, sem all-caps — evita o tell de "eyebrow em maiúsculas").
- Material Symbols Rounded permanece para ícones (já é o padrão do projeto).

**Layout:** rail de navegação fixo à esquerda (colapsado em ícones, expande com rótulo ao focar) substituindo o header horizontal — é o padrão de apps nativos de Smart TV (Apple TV, Google TV, Fire TV, LG/Samsung), diferente de uma barra de navegação de site web. Hero e backdrop do MovieDetail passam a ser full-bleed (sangram até a borda da viewport, sem card arredondado flutuando em padding), com o gradiente dissolvendo diretamente no `--color-bg` da página.

```
ANTES (header topo, hero em card com padding):
┌─────────────────────────────────────┐
│   Início  Filmes  Seriados  Lista    │  <- header centralizado
├─────────────────────────────────────┤
│ ┌───────────────────────────────┐   │
│ │      hero (card arredondado)   │   │
│ └───────────────────────────────┘   │
│  Ação        [card][card][card]      │
└─────────────────────────────────────┘

DEPOIS (rail lateral, hero full-bleed):
┌──┬────────────────────────────────────┐
│▣ │ hero full-bleed (sangra até a borda)│
│▢ │                                     │
│▢ │ Ação          [card][card][card]    │
│▢ │ Ficção Cient. [card][card][card]    │
└──┴────────────────────────────────────┘
 ↑ rail colapsado (ícones); expande ao focar
```

Alinhamento: conteúdo principal alinhado à esquerda dentro da área útil (após o rail), consistente com o padrão de carrosséis horizontais já existente.

**Princípios:**

1. O âmbar de projetor é o único acento de cor — tudo ao redor é neutro obsidiana/grafite, para o acento ler como intencional.
2. Navegação em eixo único sempre: o rail rola verticalmente, as linhas rolam horizontalmente — nunca forçar o D-pad a se mover na diagonal (padrão nativo de TV).
3. Imagens sangram até a borda da viewport; gradientes dissolvem no fundo da página em vez de viverem dentro de cards com borda/padding.
4. Metadados (ano, duração, classificação, nota) tornam-se badges/pills separados — nunca uma string unida por "·" (esse era o tell de template do estado atual).

## Global Constraints

- Sempre `rem`/`em` para fontes e espaçamentos, nunca `px` (regra pessoal do usuário, já seguida no projeto).
- Usar tokens/variáveis CSS (`var(--color-*)`, `var(--space-*)`) em vez de valores soltos — nunca hardcode de cor/espaçamento em CSS novo.
- Nunca `innerHTML` com conteúdo dinâmico — o projeto já usa apenas JSX/`textContent` implícito do React; manter assim.
- Todo componente focável deve anexar o `ref` do `useFocusable` a um elemento DOM real; containers devem envolver os filhos em `FocusContext.Provider`; `focusKey` deve ser estável entre renders (regras do projeto para navegação espacial — consultar a skill `norigin-spatial-navigation-react` antes de mexer em qualquer UI focável).
- Sem test runner configurado neste repo — a verificação de cada tarefa é `npm run build` (inclui `tsc -b`), `npm run lint`, e checagem visual/manual via `chrome-devtools` CLI. Não inventar testes automatizados que o projeto não usa.
- Ícones sempre via `Icon.tsx`/webfont Material Symbols Rounded — nunca SVG inline nem import de ícone por componente.
- Fontes sempre por CDN com fallback local declarado no CSS (nunca depender só da fonte remota).
- Não fazer commit/push automaticamente — o usuário decide quando commitar (só criar commits se pedido explicitamente durante a execução).

---

## Mapa de arquivos

```
src/
  styles/tokens.css              - MODIFICADO: nova paleta, tipografia, tokens de rail e glow de foco
  index.css                      - MODIFICADO: reset de body para rail lateral (flex row)
  App.tsx                        - MODIFICADO: layout rail+conteúdo, nextFocusResolver eixo esquerda/direita
  components/Header.tsx          - REMOVIDO (substituído por NavRail)
  components/Header.css          - REMOVIDO
  components/NavRail.tsx         - NOVO: rail lateral colapsável, ícones + rótulo ao focar
  components/NavRail.css         - NOVO
  components/Hero.tsx            - MODIFICADO: badges de metadado em vez de string com "·", título em Bebas Neue
  components/Hero.css            - MODIFICADO: full-bleed, gradiente até --color-bg
  components/MovieCard.css       - MODIFICADO: glow de foco com --color-focus âmbar
  components/CarouselRow.css     - MODIFICADO: título em Manrope, ajuste de espaçamento pós-rail
  components/FocusableButton.css - MODIFICADO: cores/glow do novo sistema
  components/CastMemberButton.tsx - MODIFICADO: nenhuma mudança de lógica, só herda CSS do novo sistema
  routes/MovieDetail.tsx         - MODIFICADO: hero full-bleed, badges de metadado, elenco em carrossel horizontal (reusa CarouselRow)
  routes/MovieDetail.css         - MODIFICADO: layout full-bleed, remove grid de elenco
  routes/NotFound.css            - MODIFICADO: paleta/tipografia do novo sistema
  index.html                     - MODIFICADO: troca fontes Roboto -> Bebas Neue + Manrope
docs/superpowers/screenshots/2026-09-13-smarttv-redesign/
  antes-home.png, antes-detail.png, antes-notfound.png   - NOVO: capturas "antes"
  depois-home.png, depois-detail.png, depois-notfound.png - NOVO: capturas "depois"
```

---

## Tarefa 1: Capturar screenshots "antes" e registrar análise UX

**Files:**

- Create: `docs/superpowers/screenshots/2026-09-13-smarttv-redesign/antes-home.png`
- Create: `docs/superpowers/screenshots/2026-09-13-smarttv-redesign/antes-detail.png`
- Create: `docs/superpowers/screenshots/2026-09-13-smarttv-redesign/antes-notfound.png`
- Create: `docs/superpowers/screenshots/2026-09-13-smarttv-redesign/analise.md`

**Interfaces:** nenhuma — apenas captura e documentação.

- [ ] **Passo 1: Criar a pasta de screenshots**

```bash
mkdir -p docs/superpowers/screenshots/2026-09-13-smarttv-redesign
```

- [ ] **Passo 2: Subir o dev server em background**

```bash
npm run dev
```

Expected: log do Vite mostrando `Local: http://localhost:5173/`. Manter rodando em background pelo resto da tarefa.

- [ ] **Passo 3: Iniciar o daemon do chrome-devtools e abrir a Home em viewport de TV**

```bash
chrome-devtools start
chrome-devtools new_page http://localhost:5173/
chrome-devtools resize_page <pageId> 1920 1080
chrome-devtools take_screenshot <pageId> --filePath docs/superpowers/screenshots/2026-09-13-smarttv-redesign/antes-home.png
```

Expected: arquivo PNG criado mostrando a Home atual (header centralizado no topo, hero em card arredondado com padding lateral, carrosséis "Ação" e "Ficção Científica").

- [ ] **Passo 4: Capturar MovieDetail**

```bash
chrome-devtools navigate_page <pageId> --type url --url http://localhost:5173/movie/furia-de-aco
chrome-devtools take_screenshot <pageId> --filePath docs/superpowers/screenshots/2026-09-13-smarttv-redesign/antes-detail.png
```

Expected: PNG mostrando backdrop 22rem, pôster + info ao lado, grid 6 colunas de elenco.

- [ ] **Passo 5: Capturar NotFound**

```bash
chrome-devtools navigate_page <pageId> --type url --url http://localhost:5173/movie/rota-inexistente
chrome-devtools take_screenshot <pageId> --filePath docs/superpowers/screenshots/2026-09-13-smarttv-redesign/antes-notfound.png
```

Expected: PNG mostrando página centralizada "Filme não encontrado".

- [ ] **Passo 6: Escrever a análise comparando com heurísticas de app nativo de Smart TV**

Criar `docs/superpowers/screenshots/2026-09-13-smarttv-redesign/analise.md`:

```markdown
# Análise "antes" — estado atual vs. UX nativa de Smart TV

## Achados

1. **Navegação em header horizontal no topo** (`antes-home.png`): padrão de site web, não de app nativo de TV (Apple TV, Google TV, Fire TV usam rail vertical à esquerda, colapsado em ícones). Ocupa `--header-height: 6rem` de altura útil da tela em toda rota.
2. **Paleta vermelho `#e50914` sobre preto**: idêntica à paleta da Netflix, sem identidade própria.
3. **Meta-string unida por "·"** (`{ano} · {duração} min · {classificação} · ★ {nota}`, em `Hero.tsx` e `MovieDetail.tsx`): difícil de escanear a 3 metros de distância (10-foot UI) e é um padrão de string genérica em vez de badges visuais distintos.
4. **Hero e backdrop do MovieDetail vivem em cards arredondados com padding** (`hero { border-radius; margin-bottom }`, `movie-detail__backdrop { border-radius }`): quebra a imersão cinematográfica típica de apps de streaming nativos, que sangram a imagem até a borda da tela.
5. **Elenco em grid 6 colunas** (`movie-detail__cast-grid`): exige navegação diagonal de D-pad entre linhas/colunas, que é desconfortável em controle remoto — apps de TV preferem eixo único (rolagem horizontal).
6. **Anel de foco branco genérico** (`--color-focus: #ffffff`): funcional, mas sem identidade de marca.

## Direção adotada

Ver "Plano de design" no plano de implementação (`docs/superpowers/plans/2026-09-13-smarttv-native-redesign.md`).
```

- [ ] **Passo 7: Confirmar que os arquivos foram criados**

```bash
ls docs/superpowers/screenshots/2026-09-13-smarttv-redesign/
```

Expected: `antes-home.png`, `antes-detail.png`, `antes-notfound.png`, `analise.md` listados.

- [ ] **Passo 8: Commit**

```bash
git add docs/superpowers/screenshots/2026-09-13-smarttv-redesign/
git commit -m "docs: capturar estado antes do redesign smarttv"
```

---

## Tarefa 2: Tokens de design (paleta, tipografia, rail, glow de foco)

**Files:**

- Modify: `src/styles/tokens.css`
- Modify: `index.html`

**Interfaces:**

- Produces: novos custom properties consumidos por todas as tarefas seguintes: `--color-accent`, `--color-accent-soft`, `--color-focus` (redefinido), `--font-family-display`, `--rail-width-collapsed`, `--rail-width-expanded`, `--shadow-focus` (redefinido com glow âmbar).

- [ ] **Passo 1: Atualizar fontes no `index.html`**

Trocar a linha do Google Fonts (linha 10 de `index.html`):

```html
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;700;800&family=Material+Symbols+Rounded&display=swap" rel="stylesheet" />
```

- [ ] **Passo 2: Reescrever `src/styles/tokens.css`**

```css
:root {
    color-scheme: dark;

    --color-bg: #0b0d12;
    --color-surface: #14171f;
    --color-surface-raised: #1e222c;
    --color-text: #f2f0ea;
    --color-text-muted: #9a9fb0;
    --color-accent: #e8a33d;
    --color-accent-soft: rgba(232, 163, 61, 0.16);
    --color-focus: #e8a33d;

    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-5: 1.5rem;
    --space-6: 2rem;
    --space-7: 3rem;
    --space-8: 4rem;

    --font-family-base: "Manrope", Arial, Helvetica, sans-serif;
    --font-family-display: "Bebas Neue", "Manrope", Arial, Helvetica, sans-serif;
    --font-size-sm: 0.875rem;
    --font-size-md: 1rem;
    --font-size-lg: 1.25rem;
    --font-size-xl: 1.75rem;
    --font-size-2xl: 2.5rem;
    --font-size-3xl: 4rem;
    --font-weight-bold: 700;
    --font-weight-medium: 500;
    --letter-spacing-display: 0.01em;

    --safe-area: 4vw;
    --header-height: 6rem;
    --rail-width-collapsed: 5.5rem;
    --rail-width-expanded: 14rem;
    --movie-card-width: 20rem;
    --movie-card-aspect-ratio: 16 / 9;
    --cast-photo-size: 6.25rem;
    --radius-md: 0.5rem;
    --radius-round: 50%;
    --radius-pill: 999rem;
    --shadow-focus: 0 0 0 0.2rem var(--color-focus), 0 0.5rem 1.5rem rgba(232, 163, 61, 0.35);
    --shadow-text: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.8);
    --gradient-card: linear-gradient(180deg, transparent 45%, rgba(0, 0, 0, 0.85) 100%);
    --layer-content: 1;
    --layer-header: 10;
    --transition-focus: transform 0.18s ease, box-shadow 0.18s ease;
}
```

- [ ] **Passo 3: Verificar tipagem/build (ainda sem UI usando os novos tokens, apenas checagem de que nada quebrou)**

```bash
npm run build
```

Expected: build conclui sem erros (os tokens antigos removidos — `--font-family-base` trocado de Roboto para Manrope — ainda não têm consumidor quebrado, pois é só troca de valor da mesma variável).

- [ ] **Passo 4: Commit**

```bash
git add src/styles/tokens.css index.html
git commit -m "style: nova paleta e tipografia de identidade smarttv"
```

---

## Tarefa 3: NavRail lateral (substitui Header) + layout em `App.tsx`

**Consultar antes de implementar:** skill `norigin-spatial-navigation-react` (regras de `useFocusable`, `FocusContext.Provider`, `focusKey` estável, `isFocusBoundary`).

**Files:**

- Create: `src/components/NavRail.tsx`
- Create: `src/components/NavRail.css`
- Delete: `src/components/Header.tsx`
- Delete: `src/components/Header.css`
- Modify: `src/App.tsx`
- Modify: `src/index.css`

**Interfaces:**

- Consumes: `useFocusable`, `FocusContext` de `@noriginmedia/norigin-spatial-navigation-react`; `NextFocusResolver` de `@noriginmedia/norigin-spatial-navigation-core`.
- Produces: `NavRail` (componente sem props, focusKey fixo `'nav-rail'`), consumido por `App.tsx` no lugar de `Header`.

- [ ] **Passo 1: Criar `src/components/NavRail.css`**

```css
.nav-rail {
    position: sticky;
    top: 0;
    z-index: var(--layer-header);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
    width: var(--rail-width-collapsed);
    height: 100vh;
    flex: 0 0 auto;
    padding-block: var(--space-6);
    padding-inline: var(--space-3);
    background: var(--color-bg);
    overflow: hidden;
}

.nav-rail__brand {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 3rem;
    margin-bottom: var(--space-6);
    font-family: var(--font-family-display);
    font-size: var(--font-size-lg);
    letter-spacing: var(--letter-spacing-display);
    color: var(--color-accent);
}

.nav-rail__item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    width: 100%;
    padding: var(--space-3);
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--color-text-muted);
    font-family: var(--font-family-base);
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-medium);
    white-space: nowrap;
    cursor: pointer;
    transition: var(--transition-focus);
}

.nav-rail__item .icon {
    flex: 0 0 auto;
}

.nav-rail__item.is-focused,
.nav-rail__item:focus-visible {
    outline: none;
    background: var(--color-accent-soft);
    color: var(--color-text);
    box-shadow: var(--shadow-focus);
}
```

- [ ] **Passo 2: Criar `src/components/NavRail.tsx`**

```tsx
import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation-react";
import { Icon } from "./Icon";
import "./NavRail.css";

const items = [
    { key: "inicio", label: "Início", iconName: "home" },
    { key: "filmes", label: "Filmes", iconName: "movie" },
    { key: "seriados", label: "Seriados", iconName: "live_tv" },
    { key: "minha-lista", label: "Minha Lista", iconName: "bookmark" },
];

function NavRailItem({ label, itemKey, iconName }: { label: string; itemKey: string; iconName: string }) {
    const { ref, focused, focusSelf } = useFocusable({ focusKey: `nav-${itemKey}` });

    return (
        <button ref={ref} type="button" className={`nav-rail__item ${focused ? "is-focused" : ""}`.trim()} onFocus={() => focusSelf()} onClick={() => focusSelf()}>
            <Icon name={iconName} />
            <span>{label}</span>
        </button>
    );
}

export function NavRail() {
    const { ref, focusKey } = useFocusable({
        focusKey: "nav-rail",
        isFocusBoundary: true,
        focusBoundaryDirections: ["up", "down", "left"],
    });

    return (
        <FocusContext.Provider value={focusKey}>
            <nav ref={ref} className="nav-rail" aria-label="Navegação principal">
                <span className="nav-rail__brand">SCTV</span>
                {items.map(({ key, label, iconName }) => (
                    <NavRailItem key={key} itemKey={key} label={label} iconName={iconName} />
                ))}
            </nav>
        </FocusContext.Provider>
    );
}
```

- [ ] **Passo 3: Apagar `Header.tsx` e `Header.css`**

```bash
rm src/components/Header.tsx src/components/Header.css
```

- [ ] **Passo 4: Reescrever `src/App.tsx`** (troca eixo vertical do resolver por horizontal, `Header` -> `NavRail`, layout em linha)

```tsx
import { Outlet } from "react-router-dom";
import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation-react";
import { init as initNavigation, type NextFocusResolver } from "@noriginmedia/norigin-spatial-navigation-core";
import { NavRail } from "./components/NavRail";

initNavigation({ debug: false, visualDebug: false, distanceCalculationMethod: "corners" });

// O rail permanece fixo à esquerda enquanto o conteúdo rola: a troca de região não
// depende das coordenadas do container da página, que podem estar fora da viewport.
const resolveAppFocus: NextFocusResolver = (direction, currentKey, siblings) => {
    if (direction === "left" && currentKey !== "nav-rail") {
        return siblings.find((sibling) => sibling.focusKey === "nav-rail") ?? null;
    }
    if (direction === "right" && currentKey === "nav-rail") {
        return siblings.find((sibling) => sibling.focusKey !== "nav-rail" && sibling.node) ?? null;
    }
    return null;
};

export function App() {
    const { ref, focusKey } = useFocusable({
        focusKey: "app",
        isFocusBoundary: true,
        nextFocusResolver: resolveAppFocus,
    });

    return (
        <FocusContext.Provider value={focusKey}>
            <div ref={ref} className="app-shell">
                <NavRail />
                <main className="app-content">
                    <Outlet />
                </main>
            </div>
        </FocusContext.Provider>
    );
}
```

- [ ] **Passo 5: Ajustar `src/index.css`** (shell agora é `flex row`; `--safe-area` sai do padding global e passa a viver só no `main`)

Substituir o bloco `.app-shell` existente:

```css
.app-shell {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    min-height: 100vh;
}

.app-content {
    flex: 1 1 auto;
    min-width: 0;
    padding: 0 var(--safe-area) var(--safe-area);
}
```

- [ ] **Passo 6: Verificar build**

```bash
npm run build
npm run lint
```

Expected: ambos concluem sem erros. Se o lint acusar import não usado ou `noUnusedLocals`, corrigir antes de prosseguir.

- [ ] **Passo 7: Validação manual de navegação esquerda/direita**

```bash
chrome-devtools new_page http://localhost:5173/
chrome-devtools resize_page <pageId> 1920 1080
chrome-devtools press_key <pageId> ArrowLeft
chrome-devtools take_screenshot <pageId>
```

Expected: screenshot mostra o rail lateral com o item focado destacado (glow âmbar), conteúdo principal deslocado à direita do rail. Repetir com `ArrowRight` a partir do rail e confirmar que o foco retorna ao primeiro card do carrossel.

- [ ] **Passo 8: Commit**

```bash
git add src/components/NavRail.tsx src/components/NavRail.css src/App.tsx src/index.css
git rm src/components/Header.tsx src/components/Header.css
git commit -m "feat: substituir header horizontal por rail lateral de navegacao"
```

---

## Tarefa 4: Hero full-bleed com badges de metadado

**Files:**

- Modify: `src/components/Hero.tsx`
- Modify: `src/components/Hero.css`

**Interfaces:** `Hero({ movie: Movie | null })` mantém a mesma assinatura — nenhuma mudança de props.

- [ ] **Passo 1: Reescrever `src/components/Hero.tsx`** (título em `Bebas Neue`, meta como badges em vez de string com "·")

```tsx
import type { Movie } from "../data/movies";
import "./Hero.css";

interface HeroProps {
    movie: Movie | null;
}

export function Hero({ movie }: HeroProps) {
    if (!movie) return <div className="hero hero--empty" />;

    return (
        <div className="hero">
            <img
                className="hero__backdrop"
                src={movie.backdropUrl}
                width={1280}
                height={720}
                alt=""
                onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://picsum.photos/seed/${movie.slug}-hero-fallback/1280/720`;
                }}
            />
            <div className="hero__gradient" />
            <div className="hero__content">
                <h1 className="hero__title">{movie.title}</h1>
                <div className="hero__badges">
                    <span className="hero__badge">{movie.year}</span>
                    <span className="hero__badge">{movie.durationMinutes} min</span>
                    <span className="hero__badge hero__badge--accent">{movie.ageRating}</span>
                    <span className="hero__badge">
                        <span aria-hidden="true">★</span> {movie.voteAverage.toFixed(1)}
                    </span>
                </div>
                <p className="hero__synopsis">{movie.synopsis}</p>
            </div>
        </div>
    );
}
```

- [ ] **Passo 2: Reescrever `src/components/Hero.css`** (full-bleed: sangra até a borda da viewport, gradiente dissolve em `--color-bg`)

```css
.hero {
    position: relative;
    width: calc(100% + var(--safe-area) * 2);
    height: 34rem;
    margin-inline: calc(var(--safe-area) * -1);
    margin-bottom: var(--space-6);
    overflow: hidden;
    background: var(--color-surface);
}

.hero--empty {
    height: 34rem;
    width: calc(100% + var(--safe-area) * 2);
    margin-inline: calc(var(--safe-area) * -1);
}

.hero__backdrop {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.hero__gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 0%, rgba(11, 13, 18, 0.55) 55%, var(--color-bg) 100%);
}

.hero__content {
    position: absolute;
    left: var(--safe-area);
    right: var(--safe-area);
    bottom: var(--space-7);
    max-width: 42rem;
}

.hero__title {
    font-family: var(--font-family-display);
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    letter-spacing: var(--letter-spacing-display);
    margin: 0 0 var(--space-3) 0;
    text-shadow: var(--shadow-text);
}

.hero__badges {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-3);
}

.hero__badge {
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-pill);
    background: var(--color-surface-raised);
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
}

.hero__badge--accent {
    background: var(--color-accent-soft);
    color: var(--color-accent);
}

.hero__synopsis {
    font-size: var(--font-size-md);
    line-height: 1.5;
    margin: 0;
}
```

- [ ] **Passo 3: Build e verificação visual**

```bash
npm run build
chrome-devtools navigate_page <pageId> --type reload
chrome-devtools take_screenshot <pageId>
```

Expected: hero sangra até a borda da viewport (sem cantos arredondados visíveis nas laterais), badges separados em vez de string com "·".

- [ ] **Passo 4: Commit**

```bash
git add src/components/Hero.tsx src/components/Hero.css
git commit -m "style: hero full-bleed com badges de metadado"
```

---

## Tarefa 5: Glow de foco âmbar em MovieCard, CarouselRow e FocusableButton

**Files:**

- Modify: `src/components/MovieCard.css`
- Modify: `src/components/CarouselRow.css`
- Modify: `src/components/FocusableButton.css`

**Interfaces:** nenhuma mudança de props/lógica — apenas CSS consumindo os tokens já redefinidos na Tarefa 2 (`--shadow-focus`, `--color-focus`, `--font-family-base`).

- [ ] **Passo 1: Confirmar que `MovieCard.css` já herda o novo glow automaticamente**

`.movie-card.is-focused` usa `box-shadow: var(--shadow-focus)`, já redefinido na Tarefa 2 para âmbar — nenhuma edição de valor é necessária aqui. Apenas rodar:

```bash
npm run build
```

Expected: sem erros (confirma que nenhum seletor ficou órfão).

- [ ] **Passo 2: Ajustar título do carrossel para a nova tipografia** em `src/components/CarouselRow.css`

```css
.carousel-row__title {
    font-family: var(--font-family-base);
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-lg);
    margin: 0 0 var(--space-3) 0;
}
```

- [ ] **Passo 3: Confirmar `FocusableButton.css` já herda o glow**

`.focusable-button:focus-visible, .focusable-button.is-focused` usa `background-color: var(--color-text)` e `box-shadow: var(--shadow-focus)` — o glow já muda para âmbar automaticamente. Nenhuma edição necessária além de checar visualmente no Passo 4.

- [ ] **Passo 4: Validação visual**

```bash
chrome-devtools navigate_page <pageId> --type reload
chrome-devtools press_key <pageId> ArrowRight
chrome-devtools take_screenshot <pageId>
```

Expected: card focado com anel/glow âmbar (não mais branco).

- [ ] **Passo 5: Commit**

```bash
git add src/components/CarouselRow.css
git commit -m "style: tipografia dos titulos de carrossel no novo sistema"
```

---

## Tarefa 6: MovieDetail full-bleed + elenco em carrossel horizontal

**Consultar antes de implementar:** skill `norigin-spatial-navigation-react` (o grid atual de elenco usa `useFocusable` individual sem `trackChildren`; a nova versão reusa o padrão de `CarouselRow` para manter navegação em eixo único).

**Files:**

- Modify: `src/routes/MovieDetail.tsx`
- Modify: `src/routes/MovieDetail.css`

**Interfaces:**

- Consumes: `CastMemberButton` (sem mudança de props: `{ member: CastMember; movieSlug: string }`), `FocusableButton`, `getMovieBySlug` de `../data/movies`.
- Produces: nenhuma nova interface pública — `MovieDetail` continua sendo uma rota sem props.

- [ ] **Passo 1: Reescrever `src/routes/MovieDetail.tsx`** (backdrop full-bleed com título/badges sobrepostos ao gradiente, igual ao Hero; elenco em `FocusContext.Provider` com `trackChildren` para navegação horizontal em eixo único)

```tsx
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation-react";
import { getMovieBySlug } from "../data/movies";
import { FocusableButton } from "../components/FocusableButton";
import { CastMemberButton } from "../components/CastMemberButton";
import { NotFound } from "./NotFound";
import "./MovieDetail.css";

export function MovieDetail() {
    const { slug = "" } = useParams();
    const navigate = useNavigate();
    const movie = getMovieBySlug(decodeURIComponent(slug));
    const { ref, focusKey, focusSelf } = useFocusable({
        isFocusBoundary: true,
        focusBoundaryDirections: ["left", "right", "down"],
    });
    const { ref: castRef, focusKey: castFocusKey } = useFocusable({
        focusKey: "detail-cast",
        trackChildren: true,
        saveLastFocusedChild: true,
    });

    useEffect(() => {
        focusSelf();
    }, [focusSelf]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Backspace" || event.key === "Escape") {
                event.preventDefault();
                navigate("/", { state: { fromSlug: movie?.slug } });
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [navigate, movie?.slug]);

    if (!movie) {
        return <NotFound />;
    }

    const goBack = () => navigate("/", { state: { fromSlug: movie.slug } });

    return (
        <FocusContext.Provider value={focusKey}>
            <div ref={ref} className="movie-detail">
                <div className="movie-detail__hero">
                    <img
                        className="movie-detail__backdrop"
                        src={movie.backdropUrl}
                        width={1280}
                        height={720}
                        loading="lazy"
                        alt=""
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = `https://picsum.photos/seed/${movie.slug}-detail-fallback/1280/720`;
                        }}
                    />
                    <div className="movie-detail__gradient" />
                    <div className="movie-detail__hero-content">
                        <h1 className="movie-detail__title">{movie.title}</h1>
                        <div className="movie-detail__badges">
                            <span className="movie-detail__badge">{movie.year}</span>
                            <span className="movie-detail__badge">{movie.durationMinutes} min</span>
                            <span className="movie-detail__badge movie-detail__badge--accent">{movie.ageRating}</span>
                            <span className="movie-detail__badge">
                                <span aria-hidden="true">★</span> {movie.voteAverage.toFixed(1)}
                            </span>
                            {movie.genres.map((genre) => (
                                <span key={genre} className="movie-detail__badge">
                                    {genre}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="movie-detail__body">
                    <p className="movie-detail__synopsis">{movie.synopsis}</p>
                    <p className="movie-detail__director">Direção: {movie.director}</p>
                    <div className="movie-detail__actions">
                        <FocusableButton label="Assistir" iconName="play_arrow" onPress={() => {}} focusKey="detail-watch" variant="primary" />
                        <FocusableButton label="Minha lista" iconName="add" variant="secondary" onPress={() => {}} focusKey="detail-list" />
                        <FocusableButton label="Voltar" iconName="arrow_back" variant="secondary" onPress={goBack} focusKey="detail-back" />
                    </div>
                </div>
                <section className="movie-detail__cast">
                    <h2>Elenco</h2>
                    <FocusContext.Provider value={castFocusKey}>
                        <div ref={castRef} className="movie-detail__cast-track">
                            {movie.cast.map((member) => (
                                <div key={member.name} className="cast-member">
                                    <CastMemberButton member={member} movieSlug={movie.slug} />
                                    <span className="cast-member__name">{member.name}</span>
                                    <span className="cast-member__character">{member.character}</span>
                                </div>
                            ))}
                        </div>
                    </FocusContext.Provider>
                </section>
            </div>
        </FocusContext.Provider>
    );
}
```

- [ ] **Passo 2: Reescrever `src/routes/MovieDetail.css`** (remove pôster+grid, adota full-bleed + carrossel de elenco)

```css
.movie-detail {
    position: relative;
}

.movie-detail__hero {
    position: relative;
    width: calc(100% + var(--safe-area) * 2);
    height: 30rem;
    margin-inline: calc(var(--safe-area) * -1);
    margin-bottom: var(--space-6);
    overflow: hidden;
    background: var(--color-surface);
}

.movie-detail__backdrop {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.movie-detail__gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 0%, rgba(11, 13, 18, 0.55) 55%, var(--color-bg) 100%);
}

.movie-detail__hero-content {
    position: absolute;
    left: var(--safe-area);
    right: var(--safe-area);
    bottom: var(--space-6);
    max-width: 48rem;
}

.movie-detail__title {
    font-family: var(--font-family-display);
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    letter-spacing: var(--letter-spacing-display);
    margin: 0 0 var(--space-3) 0;
    text-shadow: var(--shadow-text);
}

.movie-detail__badges {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-2);
}

.movie-detail__badge {
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-pill);
    background: var(--color-surface-raised);
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
}

.movie-detail__badge--accent {
    background: var(--color-accent-soft);
    color: var(--color-accent);
}

.movie-detail__body {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    max-width: 48rem;
    margin-bottom: var(--space-7);
}

.movie-detail__synopsis {
    font-size: var(--font-size-md);
    line-height: 1.5;
    margin: 0;
}

.movie-detail__director {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    margin: 0;
}

.movie-detail__actions {
    display: flex;
    gap: var(--space-4);
    margin-top: var(--space-3);
}

.movie-detail__cast h2 {
    font-size: var(--font-size-lg);
    margin: 0 0 var(--space-4) 0;
}

.movie-detail__cast-track {
    display: flex;
    gap: var(--space-5);
    overflow-x: hidden;
    padding: var(--space-5) var(--space-5) var(--space-7);
    margin: 0 calc(var(--space-5) * -1);
}

.cast-member {
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    text-align: center;
}

.cast-member__button {
    display: block;
    padding: 0;
    border: 0;
    border-radius: var(--radius-round);
    background: var(--color-surface);
    cursor: pointer;
    transition: var(--transition-focus);
}

.cast-member__button.is-focused,
.cast-member__button:focus-visible {
    outline: none;
    box-shadow: var(--shadow-focus);
}

.cast-member__button img {
    width: var(--cast-photo-size);
    height: var(--cast-photo-size);
    border-radius: var(--radius-round);
    object-fit: cover;
}

.cast-member__name {
    font-size: var(--font-size-sm);
    font-weight: 500;
}

.cast-member__character {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
}
```

Nota: o media query `@media (max-width: 64rem)` do grid antigo foi removido — o carrossel de elenco já é responsivo por natureza (rolagem horizontal), igual às demais linhas.

- [ ] **Passo 3: Build**

```bash
npm run build
npm run lint
```

Expected: sem erros de tipo/lint.

- [ ] **Passo 4: Validação manual de navegação no elenco (eixo único, sem diagonal)**

```bash
chrome-devtools navigate_page <pageId> --type url --url http://localhost:5173/movie/furia-de-aco
chrome-devtools press_key <pageId> ArrowDown
chrome-devtools press_key <pageId> ArrowDown
chrome-devtools press_key <pageId> ArrowRight
chrome-devtools take_screenshot <pageId>
```

Expected: foco chega até o carrossel de elenco e `ArrowRight` navega para o próximo ator na mesma linha (sem pular verticalmente).

- [ ] **Passo 5: Commit**

```bash
git add src/routes/MovieDetail.tsx src/routes/MovieDetail.css
git commit -m "feat: movie detail full-bleed com elenco em carrossel horizontal"
```

---

## Tarefa 7: NotFound no novo sistema visual

**Files:**

- Modify: `src/routes/NotFound.css`

**Interfaces:** nenhuma — `NotFound.tsx` não muda, só herda os novos tokens.

- [ ] **Passo 1: Ajustar `src/routes/NotFound.css`** para usar a família de exibição no título e o texto muted já redefinido

```css
.not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-4);
    min-height: 60vh;
    text-align: center;
}

.not-found h1 {
    font-family: var(--font-family-display);
    font-size: var(--font-size-2xl);
    letter-spacing: var(--letter-spacing-display);
    margin: 0;
}

.not-found p {
    font-size: var(--font-size-md);
    color: var(--color-text-muted);
    margin: 0;
}
```

- [ ] **Passo 2: Build**

```bash
npm run build
```

- [ ] **Passo 3: Commit**

```bash
git add src/routes/NotFound.css
git commit -m "style: notfound no novo sistema visual"
```

---

## Tarefa 8: Screenshots "depois", comparação final e limpeza

**Files:**

- Create: `docs/superpowers/screenshots/2026-09-13-smarttv-redesign/depois-home.png`
- Create: `docs/superpowers/screenshots/2026-09-13-smarttv-redesign/depois-detail.png`
- Create: `docs/superpowers/screenshots/2026-09-13-smarttv-redesign/depois-notfound.png`
- Modify: `docs/superpowers/screenshots/2026-09-13-smarttv-redesign/analise.md`

**Interfaces:** nenhuma — captura e documentação final.

- [ ] **Passo 1: Capturar as 3 rotas no estado final** (dev server já deve estar rodando)

```bash
chrome-devtools navigate_page <pageId> --type url --url http://localhost:5173/
chrome-devtools resize_page <pageId> 1920 1080
chrome-devtools take_screenshot <pageId> --filePath docs/superpowers/screenshots/2026-09-13-smarttv-redesign/depois-home.png

chrome-devtools navigate_page <pageId> --type url --url http://localhost:5173/movie/furia-de-aco
chrome-devtools take_screenshot <pageId> --filePath docs/superpowers/screenshots/2026-09-13-smarttv-redesign/depois-detail.png

chrome-devtools navigate_page <pageId> --type url --url http://localhost:5173/movie/rota-inexistente
chrome-devtools take_screenshot <pageId> --filePath docs/superpowers/screenshots/2026-09-13-smarttv-redesign/depois-notfound.png
```

- [ ] **Passo 2: Comparar visualmente cada captura "depois" contra a "antes" correspondente e contra os achados listados na Tarefa 1**, confirmando que os 6 pontos foram endereçados: rail lateral em vez de header no topo (1), paleta âmbar/obsidiana em vez de vermelho/preto (2), badges em vez de string com "·" (3), hero/backdrop full-bleed (4), elenco em carrossel horizontal em vez de grid (5), glow de foco âmbar (6).

- [ ] **Passo 3: Acrescentar o veredito ao `analise.md`**

Adicionar ao final do arquivo:

```markdown
## Veredito "depois"

Todos os 6 achados do estado "antes" foram endereçados — ver `depois-home.png`, `depois-detail.png`, `depois-notfound.png` para comparação lado a lado com as capturas "antes".
```

- [ ] **Passo 4: Rodar a suíte completa de verificação final**

```bash
npm run build
npm run lint
```

Expected: ambos passam sem erros/avisos.

- [ ] **Passo 5: Parar o dev server e o daemon do chrome-devtools**

```bash
chrome-devtools stop
```

(Encerrar o `npm run dev` que estava em background.)

- [ ] **Passo 6: Commit final**

```bash
git add docs/superpowers/screenshots/2026-09-13-smarttv-redesign/
git commit -m "docs: capturar estado depois do redesign smarttv"
```
