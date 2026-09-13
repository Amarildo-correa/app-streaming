# TV UI Focus & Scroll Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corrigir os três defeitos visuais/UX reportados pelo usuário após teste manual no browser — anel de foco parcialmente oculto, scrollbar interna visível dentro dos carrosséis, e a página não acompanhar o foco verticalmente (o card focado sai da viewport e o "cliente na frente da TV" perde o foco de vista) — e aplicar uma passada de design para reduzir a sensação de protótipo.

**Architecture:** Correções são CSS-first (a combinação de overflow horizontal oculto com padding vertical insuficiente causa 2 dos 3 bugs) mais uma pequena função utilitária de scroll compartilhada (`scrollFocusedIntoView`) que substitui o cálculo manual de `scrollLeft` por `Element.scrollIntoView()`, que já resolve simultaneamente o alinhamento horizontal dentro da linha e o alinhamento vertical da página.

**Tech Stack:** Mesmo stack do plano anterior (React 19, TypeScript, Vite, Norigin Spatial Navigation). Validação visual via `chrome-devtools` CLI (headless), simulando um usuário de controle remoto — `/playwright-cli` não está disponível nesta sessão como skill instalada, então o CLI do chrome-devtools (já configurado e preferido pelas instruções do usuário) faz o papel equivalente: navegação por teclado + captura de screenshot em cada estado.

**Spec:** relato do usuário nesta conversa (screenshot anexado mostrando `Zona de Impacto` como hero, carrossel "Ação" com anel de foco parcialmente visível e uma scrollbar fina no canto superior direito da área do carrossel) + diagnóstico confirmado nesta sessão via `evaluate_script` (ver Restrições Globais).

## Diagnóstico confirmado (não repetir a investigação, já validado)

- `.carousel-row__track` tem `overflow-x: hidden` sem `overflow-y` explícito. Pela especificação CSS, quando um eixo é `hidden` e o outro fica em `visible`, o browser recalcula o `visible` para `auto`. Isso faz o card focado (que cresce com `transform: scale(1.12)`) disparar uma scrollbar vertical interna na trilha e cortar o `box-shadow` do anel de foco no topo/base — explica os bugs 1 e 2 do usuário.
- Não existe nenhum código que role a página verticalmente quando o foco muda de linha. Teste feito nesta sessão: após `ArrowDown` a partir do primeiro card, o card focado (`Órbita Perdida`) ficou com `getBoundingClientRect().top = 970.9` numa viewport de `864px` de altura, e `window.scrollY` permaneceu `0` — o card focado fica completamente fora da área visível. Explica o bug 3.
- A rolagem horizontal atual (`CarouselRow.tsx`) usa um cálculo manual de `scrollLeft` baseado em largura fixa de card — funciona, mas duplica lógica que `Element.scrollIntoView()` resolve nativamente para os dois eixos ao mesmo tempo.

## Restrições Globais

- Atualização solicitada durante a execução: usar cards horizontais 16:9 nos carrosséis, com `backdropUrl` e fallback horizontal. Dimensões centralizadas em tokens; a Tarefa 2 inclui `scroll-margin-block` para reservar espaço para o crescimento do foco durante `scrollIntoView`.
- Ajuste posterior solicitado: aproximar os cards do título da linha. Com os cards horizontais, reduzir apenas o padding superior da trilha para `var(--space-5)`, mantendo as laterais e a base e revalidando o anel completo.
- Não introduzir scroll nativo do mouse/trackpad como forma de navegação — o scroll continua sendo consequência do foco, nunca a causa.
- Manter todas as restrições do plano anterior (`docs/superpowers/plans/2026-09-12-tv-streaming-app.md`): `rem`/`em` (nunca `px`), custom properties CSS, sem SVG inline, sem `innerHTML`, `focusKey` estável.
- Nenhuma regressão nos fluxos já validados: Home → Detalhe → Voltar com foco restaurado, deep link em `/movie/:slug`, estado NotFound.
- Validação final usa `chrome-devtools` CLI para simular literalmente a sequência de teclas que um usuário faria com um controle remoto (setas + Enter + Backspace), com screenshot em cada estado-chave — não apenas `npm run build`/`lint`.

---

## Mapa de arquivos

```
src/
  utils/scrollFocusedIntoView.ts   - NOVO: helper compartilhado de scroll-para-foco
  components/CarouselRow.css       - MODIFICADO: padding vertical suficiente para eliminar overflow real do card focado
  components/CarouselRow.tsx       - MODIFICADO: remove cálculo manual de scroll
  components/MovieCard.tsx         - MODIFICADO: usa o helper no onFocus
  components/FocusableButton.tsx   - MODIFICADO: usa o helper no onFocus
  components/Hero.css              - MODIFICADO: ajustes de tipografia/contraste (passada de design)
  components/MovieCard.css         - MODIFICADO: ajustes de acabamento visual
  index.css                        - MODIFICADO: ocultar scrollbar nativa da página (mantendo função)
```

---

## Tarefa 1: Corrigir overflow da trilha do carrossel (elimina scrollbar interna e anel de foco cortado)

**Files:**

- Modify: `src/components/CarouselRow.css`

**Interfaces:** nenhuma mudança de interface — só CSS.

- [x] **Passo 1:** Reservar padding vertical suficiente em `.carousel-row__track`, acomodando o card com `scale(1.12)` e seu anel de foco sem overflow real. Inicialmente foi usado `var(--space-7)` nos dois lados; após a mudança para cards horizontais e o pedido de aproximar os títulos, o topo usa `var(--space-5)` e a base mantém `var(--space-7)`. Manter `overflow-x: hidden`: declarar `overflow-y: visible` não impediria seu valor computado `auto`. A ausência de scrollbar deve resultar de `scrollHeight === clientHeight`, sem apenas escondê-la.

```css
.carousel-row__track {
    display: flex;
    gap: var(--space-5);
    overflow-x: hidden;
    /* Cards horizontais precisam de menos folga acima para o scale e o anel. */
    padding: var(--space-5) var(--space-5) var(--space-7);
    margin: 0 calc(var(--space-5) * -1);
}
```

- [x] **Passo 2 (verificação manual via chrome-devtools CLI):** com `npm run dev` ativo, rodar:

```bash
chrome-devtools new_page http://localhost:5173/
chrome-devtools evaluate_script --pageId <id> "() => { const el = document.querySelector('.movie-card.is-focused'); const track = el.closest('.carousel-row__track'); const r = el.getBoundingClientRect(); const t = track.getBoundingClientRect(); const scale = r.width / el.offsetWidth; const ring = parseFloat(getComputedStyle(el).boxShadow.split(', rgba')[0].split(' ').at(-1)) * scale; return { overflowY: getComputedStyle(track).overflowY, scrollHeight: track.scrollHeight, clientHeight: track.clientHeight, noVerticalOverflow: track.scrollHeight === track.clientHeight, ringInsideTrack: r.top - ring >= t.top && r.bottom + ring <= t.bottom && r.left - ring >= t.left && r.right + ring <= t.right }; }"
```

Esperado: `overflowY: "auto"` é normal; `noVerticalOverflow: true` e `ringInsideTrack: true` comprovam a correção. Medição do padding candidato a 1536×864: `scrollHeight = clientHeight = 421`, folga superior/inferior de `28.5` e lateral esquerda de `12`, maiores que a extensão do anel transformado (`3.584`, medidas DOM em pixels).

- [x] **Passo 3 (verificação visual):** `chrome-devtools resize_page <id> 1536 864` seguido de `chrome-devtools take_screenshot <id> --filePath ...`; abrir a imagem e confirmar visualmente que o anel branco de foco (`box-shadow` de `--shadow-focus`) aparece **inteiro** ao redor do primeiro card (topo, base, esquerda e direita), sem nenhuma barra de rolagem fina visível dentro da área do carrossel. Nesta tarefa, capturar também com `--fullPage` para inspecionar a base do anel, pois o acompanhamento vertical da viewport só será implementado na Tarefa 2.
- [x] **Passo 4 (commit):**

```bash
git add src/components/CarouselRow.css docs/superpowers/plans/2026-09-13-tv-ui-focus-fixes.md
git commit -m "fix: ampliar padding da trilha para eliminar overflow vertical e preservar o anel de foco"
```

---

## Tarefa 2: Scroll automático (vertical e horizontal) acompanhando o foco

**Files:**

- Create: `src/utils/scrollFocusedIntoView.ts`
- Modify: `src/components/MovieCard.tsx`
- Modify: `src/components/CarouselRow.tsx`
- Modify: `src/components/FocusableButton.tsx`
- Modify: `src/components/MovieCard.css` — formato horizontal e margem de scroll para o foco.
- Modify: `src/styles/tokens.css` — largura e proporção do card.

**Interfaces:**

- Produces: `scrollFocusedIntoView(el: Element | null, block?: ScrollLogicalPosition): void` — chamada por qualquer componente focável que precise garantir que, ao ganhar foco, o próprio elemento fique visível na viewport (rolando tanto o scroll vertical da página quanto o scroll horizontal do carrossel, num único mecanismo nativo do browser).
- Consumes (em `MovieCard`/`FocusableButton`): `ref.current` retornado por `useFocusable`.

- [x] **Passo 1:** Criar `src/utils/scrollFocusedIntoView.ts`:

```ts
export function scrollFocusedIntoView(el: Element | null, block: ScrollLogicalPosition = "nearest"): void {
    if (!(el instanceof HTMLElement)) return;
    el.scrollIntoView({ behavior: "smooth", block, inline: "center" });
}
```

- [x] **Passo 2:** Atualizar `src/components/MovieCard.tsx` para chamar o helper no próprio `onFocus` do card (substituindo a necessidade do cálculo manual que hoje vive em `CarouselRow`):

```tsx
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation-react";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../data/movies";
import { scrollFocusedIntoView } from "../utils/scrollFocusedIntoView";
import "./MovieCard.css";

interface MovieCardProps {
    movie: Movie;
    onFocus: (movie: Movie) => void;
}

export function MovieCard({ movie, onFocus }: MovieCardProps) {
    const navigate = useNavigate();
    const { ref, focused } = useFocusable({
        focusKey: `card-${movie.slug}`,
        onEnterPress: () => navigate(`/movie/${encodeURIComponent(movie.slug)}`),
        onFocus: () => {
            onFocus(movie);
            scrollFocusedIntoView(ref.current);
        },
    });

    return (
        <div ref={ref} className={`movie-card ${focused ? "is-focused" : ""}`.trim()} onClick={() => navigate(`/movie/${encodeURIComponent(movie.slug)}`)}>
            <img
                src={movie.backdropUrl}
                width={1280}
                height={720}
                loading="lazy"
                alt={movie.title}
                onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://picsum.photos/seed/${movie.slug}-fallback/1280/720`;
                }}
            />
            <span className="movie-card__title">{movie.title}</span>
        </div>
    );
}
```

- [x] **Passo 3:** Simplificar `src/components/CarouselRow.tsx`, removendo o cálculo manual de `scrollLeft` (a rolagem horizontal agora é responsabilidade do `scrollIntoView` chamado dentro do próprio `MovieCard`):

```tsx
import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation-react";
import { MovieCard } from "./MovieCard";
import type { Movie } from "../data/movies";
import "./CarouselRow.css";

interface CarouselRowProps {
    title: string;
    movies: Movie[];
    focusKey: string;
    onCardFocus: (movie: Movie) => void;
}

export function CarouselRow({ title, movies, focusKey, onCardFocus }: CarouselRowProps) {
    const { ref, focusKey: resolvedFocusKey } = useFocusable({
        focusKey,
        trackChildren: true,
        saveLastFocusedChild: true,
    });

    return (
        <FocusContext.Provider value={resolvedFocusKey}>
            <section ref={ref} className="carousel-row">
                <h2 className="carousel-row__title">{title}</h2>
                <div className="carousel-row__track">
                    {movies.map((movie) => (
                        <MovieCard key={movie.slug} movie={movie} onFocus={onCardFocus} />
                    ))}
                </div>
            </section>
        </FocusContext.Provider>
    );
}
```

- [x] **Passo 4:** Atualizar `src/components/FocusableButton.tsx` para também rolar a página quando um botão (ex.: "Assistir", "Voltar", elenco futuro) receber foco fora da área visível:

```tsx
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation-react";
import { Icon } from "./Icon";
import { scrollFocusedIntoView } from "../utils/scrollFocusedIntoView";
import "./FocusableButton.css";

interface FocusableButtonProps {
    label: string;
    iconName?: string;
    onPress: () => void;
    focusKey?: string;
    variant?: "primary" | "secondary";
}

export function FocusableButton({ label, iconName, onPress, focusKey, variant = "primary" }: FocusableButtonProps) {
    const { ref, focused } = useFocusable({
        focusKey,
        onEnterPress: onPress,
        onFocus: () => scrollFocusedIntoView(ref.current, "center"),
    });

    return (
        <button ref={ref} type="button" className={`focusable-button focusable-button--${variant} ${focused ? "is-focused" : ""}`.trim()} onClick={onPress}>
            {iconName ? <Icon name={iconName} /> : null}
            <span>{label}</span>
        </button>
    );
}
```

- [x] **Passo 5 (verificação manual via chrome-devtools CLI):** com o dev server rodando, simular o percurso completo de um usuário de controle remoto e confirmar que o foco nunca sai da viewport:

```bash
chrome-devtools new_page http://localhost:5173/
chrome-devtools resize_page <id> 1536 864
# desce para a 2a linha (Ficção Científica)
chrome-devtools press_key <id> ArrowDown
chrome-devtools evaluate_script --pageId <id> "() => { const el = document.querySelector('.movie-card.is-focused'); const r = el.getBoundingClientRect(); return { withinViewport: r.top >= 0 && r.bottom <= window.innerHeight, top: r.top, bottom: r.bottom }; }"
```

Esperado: `withinViewport: true`. Repetir avançando `ArrowRight` até o último card (12º) de cada linha e confirmar o mesmo (`inline: 'center'` deve manter o card sempre visível horizontalmente também).

- [x] **Passo 6 (commit):**

```bash
git add src/utils/scrollFocusedIntoView.ts src/components/MovieCard.tsx src/components/CarouselRow.tsx src/components/FocusableButton.tsx src/components/MovieCard.css src/styles/tokens.css docs/superpowers/plans/2026-09-13-tv-ui-focus-fixes.md
git commit -m "fix: substituir calculo manual de scroll por scrollIntoView para acompanhar o foco em ambos os eixos"
```

---

## Tarefa 3: Ocultar scrollbar nativa da página (mantendo a função de scroll)

**Files:**

- Modify: `src/index.css`

**Interfaces:** nenhuma — só CSS.

- [x] **Passo 1:** Adicionar ao final de `src/index.css`:

```css
html {
    scrollbar-width: none;
}

html::-webkit-scrollbar {
    display: none;
}
```

- [x] **Passo 2 (verificação manual):** com o percurso do Passo 5 da Tarefa 2 em execução, tirar screenshot em pelo menos 2 estados (linha 1 focada, linha 2 focada) e confirmar visualmente que nenhuma barra de rolagem do browser aparece em nenhum dos dois, mesmo com a página tendo mais conteúdo do que a viewport.
- [x] **Passo 3 (commit):**

```bash
git add src/index.css
git commit -m "style: ocultar scrollbar nativa da pagina mantendo scroll funcional"
```

---

## Tarefa 4: Passada de design (reduzir sensação de protótipo)

**Files:**

- Modify: `src/components/Hero.css`
- Modify: `src/components/MovieCard.css`

Usar a skill /frontend-design antes de aplicar esta tarefa (carregar e seguir suas diretrizes de tipografia/hierarquia/contraste); os ajustes concretos abaixo são o resultado mínimo esperado dessa passada — outros refinamentos que a skill sugerir e que não quebrem as Restrições Globais podem ser incorporados no mesmo commit.

**Interfaces:** nenhuma — só CSS.

- [ ] **Passo 1:** Em `src/components/Hero.css`, reforçar a legibilidade do texto sobre o backdrop e dar mais peso tipográfico ao título (a fonte "Roboto" com `font-weight: 400` padrão fica fraca em telas grandes de TV):

```css
.hero__title {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0 0 var(--space-2) 0;
    text-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.8);
}
```

(Substituir a regra `.hero__title` existente por esta.)

- [ ] **Passo 2:** Em `src/components/MovieCard.css`, adicionar um leve gradiente escuro sobre a base do pôster para a faixa de título ter contraste consistente independentemente da imagem de fundo (hoje os pôsteres são fotos aleatórias do picsum.photos, com luminosidade muito variada entre si):

```css
.movie-card {
    position: relative;
    width: 12.5rem;
    flex: 0 0 auto;
    cursor: pointer;
    transition: var(--transition-focus);
    border-radius: var(--radius-md);
}

.movie-card::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: var(--radius-md);
    background: linear-gradient(180deg, transparent 60%, rgba(0, 0, 0, 0.55) 100%);
    pointer-events: none;
}
```

(Adicionar a nova regra `.movie-card::after` junto às regras existentes de `.movie-card`, sem remover `position: relative`.)

- [ ] **Passo 3 (verificação visual):** capturar novo screenshot da Home e comparar lado a lado com o screenshot anterior (antes desta tarefa) — confirmar que o título de cada card ficou legível mesmo sobre pôsteres claros (ex.: "Fúria de Aço", que usa uma foto de floresta com neblina bem clara).
- [ ] **Passo 4 (commit):**

```bash
git add src/components/Hero.css src/components/MovieCard.css
git commit -m "style: reforcar tipografia do hero e contraste do titulo dos cards"
```

---

## Tarefa 5: Validação end-to-end simulando um usuário de controle remoto

**Files:** nenhum (apenas comandos via `chrome-devtools` CLI e checagem manual)

- [ ] **Passo 1:** `npm run build` e `npm run lint` — devem continuar limpos.
- [ ] **Passo 2:** Com `npm run dev` ativo, abrir a Home via `chrome-devtools new_page` e redimensionar para `1536x864` (viewport de notebook, o cenário mais apertado verticalmente — se funcionar aqui, funciona em telas de TV maiores).
- [ ] **Passo 3:** Simular o percurso completo de um espectador com controle remoto, tirando screenshot a cada parada e usando `evaluate_script` para confirmar `withinViewport` (ver fórmula da Tarefa 2, Passo 5) em cada uma:
    1. Estado inicial (primeiro card da linha "Ação" focado).
    2. `ArrowRight` × 11 até o último card da linha "Ação" — screenshot no 6º e no 11º.
    3. `ArrowDown` para a linha "Ficção Científica" — screenshot confirmando que a linha ficou visível e sem scrollbar nativa.
    4. `ArrowRight` × 11 até o último card da linha "Ficção Científica".
    5. `Enter` no último card focado — screenshot da página de Detalhe.
    6. Dentro do Detalhe, `ArrowRight` entre os 3 botões de ação — confirmar que o foco visível troca de botão e nenhum fica fora da viewport.
    7. `Backspace` — confirmar retorno à Home com foco restaurado no card de origem (mesmo card do passo 5) e visível na viewport (sem precisar de scroll manual do usuário).
- [ ] **Passo 4:** Revisar todos os screenshots capturados nesta tarefa em sequência (como um "storyboard") e confirmar que em nenhum deles: (a) aparece scrollbar nativa do browser, (b) o anel de foco aparece cortado, (c) o card/botão focado está parcial ou totalmente fora da área visível.
- [ ] **Passo 5:** Se qualquer verificação falhar, voltar à tarefa correspondente (1, 2 ou 3) e corrigir antes de prosseguir — não seguir para o commit final com um problema conhecido em aberto.
- [ ] **Passo 6 (commit final, se algo foi ajustado durante a validação):**

```bash
git add -A
git commit -m "fix: ajustes finais da validacao end-to-end de foco/scroll"
```
