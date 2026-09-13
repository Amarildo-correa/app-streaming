# TV Streaming App (Home + Movie Detail) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o scaffold padrão do Vite por uma aplicação de streaming de 2 rotas (`/` e `/movie/:slug`), navegável 100% por D-pad/teclado via Norigin Spatial Navigation, com aparência de app nativo de Connected TV.

**Architecture:** SPA React 19 + TypeScript + Vite, roteamento client-side com `react-router-dom` v7 (`createBrowserRouter`), dataset estático tipado em `src/data/movies.ts` (sem fetch), navegação espacial via `@noriginmedia/norigin-spatial-navigation-react`/`-core` já instalados, estilos com custom properties CSS (`rem`/`em`, sem `px`).

**Tech Stack:** React 19, TypeScript, Vite 8, react-router-dom v7, @noriginmedia/norigin-spatial-navigation-{react,core}, Oxlint.

**Spec:** requisitos completos fornecidos pelo usuário na conversa (sem arquivo de spec separado — replicados abaixo nas Restrições Globais e em cada tarefa).

## Restrições Globais

- Exatamente 2 rotas: `/` (Home) e `/movie/:slug` (Detalhe). Sem player, auth, backend, busca ou filtros.
- Slug = título normalizado (`normalize('NFD')` + remoção de diacríticos, minúsculas, não-alfanumérico → `-`, hífens colapsados/aparados), calculado **uma única vez** e persistido como campo `slug` no dataset — nunca recalculado em render/navegação.
- 24 filmes únicos, 2 gêneros de carrossel na Home, 12 filmes por linha.
- Slug inexistente/malformado → estado "filme não encontrado" focável com botão de volta para `/`, nunca tela branca ou exceção.
- Navegação/links sempre com `encodeURIComponent(slug)`.
- Foco: `↑↓←→` movem, `Enter` ativa, `Backspace`/`Escape` volta. Nunca depender de mouse/hover/scroll nativo. Nunca existe estado "sem foco". Voltar do detalhe restaura foco no card de origem.
- Ícones: webfont Material Symbols Rounded via CDN, encapsulada em `<Icon name="..." />` — nunca SVG inline, nunca import de ícone por componente.
- Imagens: `width`/`height` explícitos, `loading="lazy"` (exceto hero), `onError` com placeholder. URLs verificadas como respondendo 200 antes de fixar no dataset (ver Tarefa 3 — TMDB sem API key não é confiável para lookup de paths; dataset usa `picsum.photos/seed/{...}` determinístico, verificado nesta sessão).
- CSS: custom properties (`var(--color-*)`, `var(--space-*)`, `var(--font-*)`), `rem`/`em` para fonte e espaçamento — **nunca `px`**.
- JS/TS: `const`/`let`, `===`/`!==`, nunca `innerHTML`.
- `focusKey` de cada card derivado do `slug` do filme; `focusKey`s sempre estáveis entre renders.
- Sem test runner configurado no projeto e sem exigência de testes nos critérios de aceite — verificação é por `npm run build`, `npm run lint` e checagem manual (teclado + screenshots), não TDD com Vitest.
- Critérios de aceite finais (Tarefa 14): build+lint limpos, navegação 100% por teclado sem focáveis inalcançáveis, refresh em `/movie/:slug` funciona (deep link), slugs únicos/legíveis, foco restaurado ao voltar, nenhuma imagem quebrada, nenhum SVG inline, nenhum `px`, screenshots avaliados contra estética de TV.

---

## Mapa de arquivos

```
src/
  data/slugify.ts        - normalização de título -> slug
  data/movies.ts          - tipos Movie/CastMember/Genre + 24 entradas + getMovieBySlug
  styles/tokens.css       - custom properties globais + reset
  components/Icon.tsx     - wrapper da webfont de ícones
  components/FocusableButton.tsx - botão focável genérico
  components/MovieCard.tsx       - card de carrossel (focusKey = slug)
  components/CarouselRow.tsx     - linha de carrossel com scroll por foco
  components/Hero.tsx            - banner que reflete o filme focado
  routes/Home.tsx
  routes/MovieDetail.tsx
  routes/NotFound.tsx
  router.tsx              - createBrowserRouter
  App.tsx                 - init da navegação espacial + RouterProvider
  main.tsx                - modificado (remove StrictMode extra imports do template)
  index.css               - modificado (reset, remove estilos do template)
public/
  icons.svg               - removido (só ícones sociais do template)
```

---

## Tarefa 1: Limpeza do scaffold + tokens de design

**Files:**
- Delete: `public/icons.svg`, `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png`, `src/App.css`
- Create: `src/styles/tokens.css`
- Modify: `src/index.css`

**Interfaces:**
- Produces: custom properties consumidas por todos os componentes seguintes — `--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-accent`, `--color-focus`, `--space-1` a `--space-8`, `--font-size-sm|md|lg|xl|2xl|3xl`, `--safe-area` (4vw), `--radius-md`, `--shadow-focus`, `--transition-focus`.

- [ ] **Passo 1:** Apagar `public/icons.svg`, `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png`, `src/App.css` (não usados na nova UI).
- [ ] **Passo 2:** Criar `src/styles/tokens.css`:

```css
:root {
  color-scheme: dark;

  --color-bg: #0a0a0c;
  --color-surface: #16161a;
  --color-surface-raised: #1f1f24;
  --color-text: #f5f5f7;
  --color-text-muted: #a3a3ad;
  --color-accent: #e50914;
  --color-focus: #ffffff;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-7: 3rem;
  --space-8: 4rem;

  --font-family-base: 'Roboto', Arial, Helvetica, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.75rem;
  --font-size-2xl: 2.5rem;
  --font-size-3xl: 3.5rem;

  --safe-area: 4vw;
  --radius-md: 0.5rem;
  --shadow-focus: 0 0 0 0.2rem var(--color-focus), 0 0.5rem 1.5rem rgba(0, 0, 0, 0.6);
  --transition-focus: transform 0.18s ease, box-shadow 0.18s ease;
}
```

- [ ] **Passo 3:** Substituir `src/index.css` por reset + import dos tokens + fonte via CDN com fallback local:

```css
@import './styles/tokens.css';

html, body {
  margin: 0;
  padding: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-family-base);
  font-size: 100%;
}

#root {
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}

img {
  display: block;
}
```

- [ ] **Passo 4:** Adicionar no `index.html` (dentro de `<head>`, antes do `<link rel="stylesheet" href="/src/index.css">` implícito do Vite) os links de webfont: Google Fonts "Roboto" (texto) e "Material Symbols Rounded" (ícones), cada um com `rel="preconnect"` para `fonts.googleapis.com`/`fonts.gstatic.com`.
- [ ] **Passo 5 (verificação manual):** `npm run dev`, abrir no browser, confirmar que a tela carrega sem erros de console (mesmo com App.tsx ainda no template — só interessa que CSS não quebrou).
- [ ] **Passo 6 (commit):**

```bash
git add -A src/styles src/index.css src/App.css src/assets public/icons.svg index.html
git commit -m "chore: remover assets do template Vite e adicionar tokens de design"
```

---

## Tarefa 2: `slugify`

**Files:**
- Create: `src/data/slugify.ts`

**Interfaces:**
- Produces: `slugify(title: string): string` — usado por Tarefa 3 para gerar o campo `slug` do dataset (uma única vez, não em runtime de render).

- [ ] **Passo 1:** Implementar:

```ts
export function slugify(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

- [ ] **Passo 2 (verificação manual, sem test runner):** rodar via `npx tsx -e` (ou node com ts-node se disponível) os casos abaixo e confirmar visualmente a saída antes de seguir:

```ts
import { slugify } from './src/data/slugify';
console.log(slugify('O Iluminado'));      // esperado: o-iluminado
console.log(slugify('Última Fronteira')); // esperado: ultima-fronteira
console.log(slugify('  Espaço  Extra  ')); // esperado: espaco-extra
```

- [ ] **Passo 3 (commit):**

```bash
git add src/data/slugify.ts
git commit -m "feat: adicionar utilitario de slugify para titulos de filme"
```

---

## Tarefa 3: Dataset de filmes

**Files:**
- Create: `src/data/movies.ts`

**Interfaces:**
- Consumes: `slugify` de `src/data/slugify.ts` (só para gerar os 24 slugs uma vez ao escrever o arquivo — não é chamado em runtime; os slugs finais são literais no array).
- Produces: `type Genre`, `type CastMember`, `type Movie`, `export const movies: Movie[]` (24 entradas), `export function getMovieBySlug(slug: string): Movie | undefined`.

- [ ] **Passo 1:** Definir tipos:

```ts
export type Genre = 'Ação' | 'Ficção Científica' | 'Drama' | 'Suspense';

export interface CastMember {
  name: string;
  character: string;
  photoUrl: string;
}

export interface Movie {
  slug: string;
  title: string;
  year: number;
  durationMinutes: number;
  ageRating: string;
  voteAverage: number;
  genres: Genre[];
  synopsis: string;
  director: string;
  cast: CastMember[];
  posterUrl: string;
  backdropUrl: string;
}
```

- [ ] **Passo 2:** Gerar helpers determinísticos de imagem no topo do arquivo (evita repetir URL longa 24×3 vezes):

```ts
const posterUrl = (seed: string) => `https://picsum.photos/seed/${seed}/500/750`;
const backdropUrl = (seed: string) => `https://picsum.photos/seed/${seed}-bg/1280/720`;
const castPhotoUrl = (seed: string, i: number) => `https://picsum.photos/seed/${seed}-cast-${i}/300/300`;
```

Essas URLs foram verificadas nesta sessão: `picsum.photos/seed/.../W/H` resolve com `200` após seguir o redirect (`curl -sL -o /dev/null -w "%{http_code}"`), então qualquer seed é válida — não é necessário verificar as 72 URLs individualmente, apenas confirmar que o padrão de URL responde (já confirmado).

- [ ] **Passo 3:** Popular `movies` com as 24 entradas abaixo (título, slug, gênero primário, ano — dados completos de sinopse/elenco/diretor devem ser escritos com o mesmo nível de detalhe do exemplo completo ao final deste passo; todos fictícios):

| # | Título | Slug | Gênero(s) |
|---|--------|------|-----------|
| 1 | Fúria de Aço | furia-de-aco | Ação |
| 2 | Zona de Impacto | zona-de-impacto | Ação |
| 3 | Código Vermelho | codigo-vermelho | Ação, Suspense |
| 4 | Última Fronteira | ultima-fronteira | Ação |
| 5 | Linha de Fogo | linha-de-fogo | Ação |
| 6 | Operação Sombra | operacao-sombra | Ação, Suspense |
| 7 | Vingança Silenciosa | vinganca-silenciosa | Ação, Drama |
| 8 | Alvo Certo | alvo-certo | Ação |
| 9 | Guerra Urbana | guerra-urbana | Ação |
| 10 | Ponto de Ruptura | ponto-de-ruptura | Ação, Suspense |
| 11 | Comando Noturno | comando-noturno | Ação |
| 12 | Ronda Final | ronda-final | Ação, Drama |
| 13 | Órbita Perdida | orbita-perdida | Ficção Científica |
| 14 | Eco Estelar | eco-estelar | Ficção Científica |
| 15 | Horizonte Sintético | horizonte-sintetico | Ficção Científica, Drama |
| 16 | Máquina de Amanhã | maquina-de-amanha | Ficção Científica |
| 17 | Colônia Zero | colonia-zero | Ficção Científica, Suspense |
| 18 | Singularidade | singularidade | Ficção Científica, Drama |
| 19 | Portal de Cronos | portal-de-cronos | Ficção Científica |
| 20 | Réplica Humana | replica-humana | Ficção Científica, Drama |
| 21 | Nebulosa Azul | nebulosa-azul | Ficção Científica |
| 22 | Sistema Fantasma | sistema-fantasma | Ficção Científica, Suspense |
| 23 | Origem Digital | origem-digital | Ficção Científica |
| 24 | Última Transmissão | ultima-transmissao | Ficção Científica, Suspense |

Exemplo completo de entrada (mesmo padrão para as 24, com sinopse/elenco/diretor variados e fictícios por filme, não reaproveitando o mesmo texto):

```ts
{
  slug: 'furia-de-aco',
  title: 'Fúria de Aço',
  year: 2021,
  durationMinutes: 118,
  ageRating: '14',
  voteAverage: 7.6,
  genres: ['Ação'],
  synopsis: 'Um ex-soldado é forçado a voltar ao campo de batalha para resgatar a filha, sequestrada por uma milícia que controla um porto industrial.',
  director: 'Marcos Vilela',
  cast: [
    { name: 'Renato Souza', character: 'Diego Almeida', photoUrl: castPhotoUrl('furia-de-aco', 1) },
    { name: 'Ana Beatriz Lima', character: 'Cap. Marta Rios', photoUrl: castPhotoUrl('furia-de-aco', 2) },
    { name: 'Caio Ferraz', character: 'Bruno "Trovão"', photoUrl: castPhotoUrl('furia-de-aco', 3) },
    { name: 'Juliana Prado', character: 'Helena Diego', photoUrl: castPhotoUrl('furia-de-aco', 4) },
    { name: 'Otávio Reis', character: 'Comandante Falcão', photoUrl: castPhotoUrl('furia-de-aco', 5) },
    { name: 'Bianca Nogueira', character: 'Agente Costa', photoUrl: castPhotoUrl('furia-de-aco', 6) },
  ],
  posterUrl: posterUrl('furia-de-aco'),
  backdropUrl: backdropUrl('furia-de-aco'),
},
```

Repetir esse padrão para as outras 23 linhas da tabela (títulos/slugs exatos da tabela, ano entre 2018–2024, duração 95–140 min, `ageRating` em `{'L','10','12','14','16','18'}`, `voteAverage` entre 6.0–9.0, sinopse própria de 1–2 frases coerente com o gênero, diretor e 6 membros de elenco fictícios únicos por filme).

- [ ] **Passo 4:** Implementar o seletor:

```ts
export function getMovieBySlug(slug: string): Movie | undefined {
  return movies.find((movie) => movie.slug === slug);
}
```

- [ ] **Passo 5 (verificação manual):** rodar um script rápido que confere unicidade dos 24 slugs:

```ts
const slugs = movies.map((m) => m.slug);
console.log('duplicados:', slugs.filter((s, i) => slugs.indexOf(s) !== i));
console.log('total:', slugs.length, 'únicos:', new Set(slugs).size);
```

Esperado: `duplicados: []`, `total: 24 únicos: 24`.

- [ ] **Passo 6 (commit):**

```bash
git add src/data/movies.ts
git commit -m "feat: adicionar dataset de 24 filmes ficticios com seletor por slug"
```

---

## Tarefa 4: `Icon`

**Files:**
- Create: `src/components/Icon.tsx`

**Interfaces:**
- Consumes: webfont "Material Symbols Rounded" carregada via CDN (Tarefa 1, Passo 4).
- Produces: `<Icon name="play_arrow" />` — componente usado por `FocusableButton`, `MovieCard` (badge de nota) e `MovieDetail`.

- [ ] **Passo 1:** Implementar:

```tsx
interface IconProps {
  name: string;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  return (
    <span className={`material-symbols-rounded icon ${className ?? ''}`.trim()} aria-hidden="true">
      {name}
    </span>
  );
}
```

- [ ] **Passo 2:** Adicionar em `src/index.css`:

```css
.icon {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  font-size: var(--font-size-lg);
  line-height: 1;
  vertical-align: middle;
}
```

- [ ] **Passo 3 (commit):**

```bash
git add src/components/Icon.tsx src/index.css
git commit -m "feat: adicionar componente Icon encapsulando webfont de icones"
```

---

## Tarefa 5: Router

**Files:**
- Create: `src/router.tsx`
- Modify: `src/main.tsx`, `package.json` (dependência)

**Interfaces:**
- Consumes: `Home` (Tarefa 10), `MovieDetail` (Tarefa 11), `NotFound` (Tarefa 12), `App` (Tarefa 13).
- Produces: `export const router` (createBrowserRouter) com rotas `/` e `/movie/:slug`, e `*` → NotFound.

- [ ] **Passo 1:** Instalar dependência:

```bash
npm install react-router-dom@^7
```

- [ ] **Passo 2:** Criar `src/router.tsx`:

```tsx
import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';
import { Home } from './routes/Home';
import { MovieDetail } from './routes/MovieDetail';
import { NotFound } from './routes/NotFound';

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/movie/:slug', element: <MovieDetail /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
```

- [ ] **Passo 3:** Atualizar `src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
```

- [ ] **Passo 4 (verificação manual):** `npm run dev`, navegar para `/` e `/movie/qualquer-slug` na URL — mesmo sem conteúdo final ainda, não deve haver erro de rota.
- [ ] **Passo 5 (commit):**

```bash
git add src/router.tsx src/main.tsx package.json package-lock.json
git commit -m "feat: configurar react-router-dom v7 com rotas Home e MovieDetail"
```

---

## Tarefa 6: `App` (init da navegação espacial + layout raiz)

**Files:**
- Create: `src/App.tsx` (substitui o conteúdo de template)

**Interfaces:**
- Consumes: `init` de `@noriginmedia/norigin-spatial-navigation-core`, `Outlet` de `react-router-dom`.
- Produces: componente raiz que injeta `<Outlet />` e roda `init()` uma única vez.

- [ ] **Passo 1:** Implementar:

```tsx
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { init as initNavigation } from '@noriginmedia/norigin-spatial-navigation-core';

let navigationInitialized = false;

export function App() {
  useEffect(() => {
    if (navigationInitialized) return;
    initNavigation({ debug: false, visualDebug: false, distanceCalculationMethod: 'corners' });
    navigationInitialized = true;
  }, []);

  return (
    <div className="app-shell">
      <Outlet />
    </div>
  );
}
```

- [ ] **Passo 2:** Em `src/index.css`, adicionar:

```css
.app-shell {
  min-height: 100vh;
  padding: var(--safe-area);
}
```

- [ ] **Passo 3 (commit):**

```bash
git add src/App.tsx src/index.css
git commit -m "feat: inicializar spatial navigation e definir shell raiz da app"
```

---

## Tarefa 7: `FocusableButton`

**Files:**
- Create: `src/components/FocusableButton.tsx`
- Create (styles co-localizados): `src/components/FocusableButton.css`

**Interfaces:**
- Consumes: `useFocusable` de `@noriginmedia/norigin-spatial-navigation-react`, `Icon` (Tarefa 4).
- Produces: `<FocusableButton label="Assistir" iconName="play_arrow" onPress={...} focusKey="..." />` — usado por `MovieDetail` (Tarefa 11) e `NotFound` (Tarefa 12).

- [ ] **Passo 1:** Implementar:

```tsx
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation-react';
import { Icon } from './Icon';
import './FocusableButton.css';

interface FocusableButtonProps {
  label: string;
  iconName?: string;
  onPress: () => void;
  focusKey?: string;
  variant?: 'primary' | 'secondary';
}

export function FocusableButton({ label, iconName, onPress, focusKey, variant = 'primary' }: FocusableButtonProps) {
  const { ref, focused } = useFocusable({ focusKey, onEnterPress: onPress });

  return (
    <button
      ref={ref}
      type="button"
      className={`focusable-button focusable-button--${variant} ${focused ? 'is-focused' : ''}`.trim()}
      onClick={onPress}
    >
      {iconName ? <Icon name={iconName} /> : null}
      <span>{label}</span>
    </button>
  );
}
```

- [ ] **Passo 2:** Criar `src/components/FocusableButton.css`:

```css
.focusable-button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  font-family: var(--font-family-base);
  cursor: pointer;
  transition: var(--transition-focus);
}

.focusable-button--primary {
  background: var(--color-text);
  color: var(--color-bg);
}

.focusable-button--secondary {
  background: var(--color-surface-raised);
  color: var(--color-text);
}

.focusable-button.is-focused {
  transform: scale(1.08);
  box-shadow: var(--shadow-focus);
}
```

- [ ] **Passo 3 (commit):**

```bash
git add src/components/FocusableButton.tsx src/components/FocusableButton.css
git commit -m "feat: adicionar FocusableButton com estado de foco visivel"
```

---

## Tarefa 8: `MovieCard`

**Files:**
- Create: `src/components/MovieCard.tsx`, `src/components/MovieCard.css`

**Interfaces:**
- Consumes: `useFocusable`, `Movie` (tipo, Tarefa 3), `useNavigate`/`Link` de react-router-dom.
- Produces: `<MovieCard movie={movie} onFocus={(movie) => void} />` — `focusKey` = `` `card-${movie.slug}` ``. Usado por `CarouselRow` (Tarefa 9) e referenciado por `Home` (Tarefa 10) para restaurar foco.

- [ ] **Passo 1:** Implementar:

```tsx
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation-react';
import { useNavigate } from 'react-router-dom';
import type { Movie } from '../data/movies';
import './MovieCard.css';

interface MovieCardProps {
  movie: Movie;
  onFocus: (movie: Movie) => void;
}

export function MovieCard({ movie, onFocus }: MovieCardProps) {
  const navigate = useNavigate();
  const { ref, focused } = useFocusable({
    focusKey: `card-${movie.slug}`,
    onEnterPress: () => navigate(`/movie/${encodeURIComponent(movie.slug)}`),
    onFocus: () => onFocus(movie),
  });

  return (
    <div
      ref={ref}
      className={`movie-card ${focused ? 'is-focused' : ''}`.trim()}
      onClick={() => navigate(`/movie/${encodeURIComponent(movie.slug)}`)}
    >
      <img
        src={movie.posterUrl}
        width={200}
        height={300}
        loading="lazy"
        alt={movie.title}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = `https://picsum.photos/seed/${movie.slug}-fallback/200/300`;
        }}
      />
      <span className="movie-card__title">{movie.title}</span>
    </div>
  );
}
```

- [ ] **Passo 2:** Criar `src/components/MovieCard.css`:

```css
.movie-card {
  width: 12.5rem;
  flex: 0 0 auto;
  cursor: pointer;
  transition: var(--transition-focus);
  border-radius: var(--radius-md);
}

.movie-card img {
  width: 100%;
  height: auto;
  border-radius: var(--radius-md);
}

.movie-card__title {
  display: block;
  margin-top: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.movie-card.is-focused {
  transform: scale(1.12);
  box-shadow: var(--shadow-focus);
}

.movie-card.is-focused .movie-card__title {
  color: var(--color-text);
}
```

- [ ] **Passo 3 (commit):**

```bash
git add src/components/MovieCard.tsx src/components/MovieCard.css
git commit -m "feat: adicionar MovieCard focavel com navegacao para detalhe"
```

---

## Tarefa 9: `CarouselRow`

**Files:**
- Create: `src/components/CarouselRow.tsx`, `src/components/CarouselRow.css`

**Interfaces:**
- Consumes: `useFocusable` (container, `trackChildren: true`), `MovieCard` (Tarefa 8).
- Produces: `<CarouselRow title="Ação" movies={movies} onCardFocus={(movie) => void} focusKey="row-acao" />`. O scroll horizontal reage ao foco do filho (via `onFocus` do card, calculando `scrollLeft` do container ref) — não a scroll nativo.

- [ ] **Passo 1:** Implementar:

```tsx
import { useRef } from 'react';
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation-react';
import { MovieCard } from './MovieCard';
import type { Movie } from '../data/movies';
import './CarouselRow.css';

interface CarouselRowProps {
  title: string;
  movies: Movie[];
  focusKey: string;
  onCardFocus: (movie: Movie) => void;
}

export function CarouselRow({ title, movies, focusKey, onCardFocus }: CarouselRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { ref, focusKey: resolvedFocusKey } = useFocusable({ focusKey, trackChildren: true, saveLastFocusedChild: true });

  const handleCardFocus = (movie: Movie, index: number) => {
    onCardFocus(movie);
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = 12.5 * 16 + 1.5 * 16;
    const targetScroll = index * cardWidth - container.clientWidth / 2 + cardWidth / 2;
    container.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
  };

  return (
    <FocusContext.Provider value={resolvedFocusKey}>
      <section ref={ref} className="carousel-row">
        <h2 className="carousel-row__title">{title}</h2>
        <div className="carousel-row__track" ref={scrollRef}>
          {movies.map((movie, index) => (
            <MovieCard key={movie.slug} movie={movie} onFocus={() => handleCardFocus(movie, index)} />
          ))}
        </div>
      </section>
    </FocusContext.Provider>
  );
}
```

- [ ] **Passo 2:** Criar `src/components/CarouselRow.css`:

```css
.carousel-row {
  margin-bottom: var(--space-6);
}

.carousel-row__title {
  font-size: var(--font-size-lg);
  margin: 0 0 var(--space-3) 0;
}

.carousel-row__track {
  display: flex;
  gap: var(--space-5);
  overflow-x: hidden;
  padding: var(--space-2) 0;
}
```

- [ ] **Passo 3 (commit):**

```bash
git add src/components/CarouselRow.tsx src/components/CarouselRow.css
git commit -m "feat: adicionar CarouselRow com scroll horizontal guiado por foco"
```

---

## Tarefa 10: `Hero`

**Files:**
- Create: `src/components/Hero.tsx`, `src/components/Hero.css`

**Interfaces:**
- Consumes: `Movie | null` (filme atualmente focado, injetado por `Home`).
- Produces: `<Hero movie={movie} />` — usado por `Home` (Tarefa 11).

- [ ] **Passo 1:** Implementar:

```tsx
import type { Movie } from '../data/movies';
import './Hero.css';

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
        <p className="hero__meta">
          {movie.year} · {movie.durationMinutes} min · {movie.ageRating} · ★ {movie.voteAverage.toFixed(1)}
        </p>
        <p className="hero__synopsis">{movie.synopsis}</p>
      </div>
    </div>
  );
}
```

- [ ] **Passo 2:** Criar `src/components/Hero.css`:

```css
.hero {
  position: relative;
  width: 100%;
  height: 26rem;
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: var(--space-6);
  background: var(--color-surface);
}

.hero--empty {
  height: 26rem;
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
  background: linear-gradient(180deg, transparent 0%, rgba(10, 10, 12, 0.4) 50%, rgba(10, 10, 12, 0.95) 100%);
}

.hero__content {
  position: absolute;
  left: var(--space-6);
  bottom: var(--space-6);
  max-width: 40rem;
}

.hero__title {
  font-size: var(--font-size-3xl);
  margin: 0 0 var(--space-2) 0;
}

.hero__meta {
  font-size: var(--font-size-md);
  color: var(--color-text-muted);
  margin: 0 0 var(--space-3) 0;
}

.hero__synopsis {
  font-size: var(--font-size-md);
  line-height: 1.5;
  margin: 0;
}
```

Nota: hero usa `alt=""` decorativo pois título/metadados já são texto real na sobreposição (evita duplicação para leitores de tela); imagem sem `loading="lazy"` conforme requisito (é o elemento above-the-fold).

- [ ] **Passo 3 (commit):**

```bash
git add src/components/Hero.tsx src/components/Hero.css
git commit -m "feat: adicionar Hero que reflete o filme atualmente focado"
```

---

## Tarefa 11: `Home`

**Files:**
- Create: `src/routes/Home.tsx`, `src/routes/Home.css`
- Modify: `src/data/movies.ts` (nenhuma mudança de código, apenas consumo)

**Interfaces:**
- Consumes: `movies` (Tarefa 3), `Hero` (Tarefa 10), `CarouselRow` (Tarefa 9), `setFocus`/`doesFocusableExist` de `@noriginmedia/norigin-spatial-navigation-core`.
- Produces: rota `/` completa; expõe o contrato de foco inicial e de restauração usado pela navegação (`card-${slug}` — ver Tarefa 8) via `location.state.fromSlug` recebido do `MovieDetail` (Tarefa 12).

- [ ] **Passo 1:** Implementar:

```tsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation-react';
import { doesFocusableExist, setFocus } from '@noriginmedia/norigin-spatial-navigation-core';
import { movies, type Movie } from '../data/movies';
import { Hero } from '../components/Hero';
import { CarouselRow } from '../components/CarouselRow';
import './Home.css';

const actionMovies = movies.filter((movie) => movie.genres.includes('Ação')).slice(0, 12);
const sciFiMovies = movies.filter((movie) => movie.genres.includes('Ficção Científica')).slice(0, 12);

export function Home() {
  const location = useLocation();
  const [focusedMovie, setFocusedMovie] = useState<Movie | null>(actionMovies[0] ?? null);
  const { ref, focusKey } = useFocusable({ focusKey: 'home', isFocusBoundary: false });

  useEffect(() => {
    const fromSlug = (location.state as { fromSlug?: string } | null)?.fromSlug;
    const restoreKey = fromSlug ? `card-${fromSlug}` : 'card-' + actionMovies[0]?.slug;
    if (restoreKey && doesFocusableExist(restoreKey)) {
      setFocus(restoreKey);
    } else if (doesFocusableExist('home')) {
      setFocus('home');
    }
  }, [location.state]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="home">
        <Hero movie={focusedMovie} />
        <CarouselRow title="Ação" movies={actionMovies} focusKey="row-acao" onCardFocus={setFocusedMovie} />
        <CarouselRow
          title="Ficção Científica"
          movies={sciFiMovies}
          focusKey="row-ficcao-cientifica"
          onCardFocus={setFocusedMovie}
        />
      </div>
    </FocusContext.Provider>
  );
}
```

- [ ] **Passo 2:** Criar `src/routes/Home.css`:

```css
.home {
  display: flex;
  flex-direction: column;
}
```

- [ ] **Passo 3 (verificação manual):** `npm run dev`, abrir `/`, confirmar 2 linhas com 12 cards cada, hero exibindo o primeiro filme, e que apertar `→`/`↓` no teclado move o foco e atualiza o hero.
- [ ] **Passo 4 (commit):**

```bash
git add src/routes/Home.tsx src/routes/Home.css
git commit -m "feat: implementar rota Home com hero e dois carrosseis por genero"
```

---

## Tarefa 12: `MovieDetail`

**Files:**
- Create: `src/routes/MovieDetail.tsx`, `src/routes/MovieDetail.css`

**Interfaces:**
- Consumes: `getMovieBySlug` (Tarefa 3), `FocusableButton` (Tarefa 7), `useParams`/`useNavigate` de react-router-dom.
- Produces: rota `/movie/:slug`; ao voltar, navega para `/` passando `state: { fromSlug: movie.slug }` (contrato consumido pela Tarefa 11).

- [ ] **Passo 1:** Implementar:

```tsx
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation-react';
import { getMovieBySlug } from '../data/movies';
import { FocusableButton } from '../components/FocusableButton';
import { NotFound } from './NotFound';
import './MovieDetail.css';

export function MovieDetail() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const movie = getMovieBySlug(decodeURIComponent(slug));
  const { ref, focusKey, focusSelf } = useFocusable({ isFocusBoundary: true });

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Backspace' || event.key === 'Escape') {
        event.preventDefault();
        navigate('/', { state: { fromSlug: movie?.slug } });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, movie?.slug]);

  if (!movie) {
    return <NotFound />;
  }

  const goBack = () => navigate('/', { state: { fromSlug: movie.slug } });

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="movie-detail">
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
        <div className="movie-detail__body">
          <img
            className="movie-detail__poster"
            src={movie.posterUrl}
            width={200}
            height={300}
            loading="lazy"
            alt={movie.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `https://picsum.photos/seed/${movie.slug}-poster-fallback/200/300`;
            }}
          />
          <div className="movie-detail__info">
            <h1>{movie.title}</h1>
            <p className="movie-detail__meta">
              {movie.year} · {movie.durationMinutes} min · {movie.ageRating} · ★ {movie.voteAverage.toFixed(1)} ·{' '}
              {movie.genres.join(', ')}
            </p>
            <p className="movie-detail__synopsis">{movie.synopsis}</p>
            <p className="movie-detail__director">Direção: {movie.director}</p>
            <div className="movie-detail__actions">
              <FocusableButton label="Assistir" iconName="play_arrow" onPress={() => {}} focusKey="detail-watch" />
              <FocusableButton
                label="Minha lista"
                iconName="add"
                variant="secondary"
                onPress={() => {}}
                focusKey="detail-list"
              />
              <FocusableButton label="Voltar" iconName="arrow_back" variant="secondary" onPress={goBack} focusKey="detail-back" />
            </div>
          </div>
        </div>
        <section className="movie-detail__cast">
          <h2>Elenco</h2>
          <div className="movie-detail__cast-grid">
            {movie.cast.map((member) => (
              <div key={member.name} className="cast-member">
                <img
                  src={member.photoUrl}
                  width={100}
                  height={100}
                  loading="lazy"
                  alt={member.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://picsum.photos/seed/${movie.slug}-cast-fallback/100/100`;
                  }}
                />
                <span className="cast-member__name">{member.name}</span>
                <span className="cast-member__character">{member.character}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </FocusContext.Provider>
  );
}
```

- [ ] **Passo 2:** Criar `src/routes/MovieDetail.css` com layout (backdrop, poster + info em linha, grid de elenco 6 colunas responsivas, ações em linha) — usar `var(--space-*)`/`rem` em todas as medidas, seguindo o mesmo padrão de tokens das tarefas anteriores.
- [ ] **Passo 3 (verificação manual):** navegar de um card da Home até `/movie/furia-de-aco`, confirmar todos os campos exibidos; apertar `Backspace`, confirmar volta para `/` com foco no card de origem.
- [ ] **Passo 4 (commit):**

```bash
git add src/routes/MovieDetail.tsx src/routes/MovieDetail.css
git commit -m "feat: implementar rota de detalhe do filme com elenco e acoes"
```

---

## Tarefa 13: `NotFound`

**Files:**
- Create: `src/routes/NotFound.tsx`, `src/routes/NotFound.css`

**Interfaces:**
- Consumes: `FocusableButton` (Tarefa 7).
- Produces: estado "filme não encontrado" reutilizado tanto pela rota `*` quanto por `MovieDetail` quando `getMovieBySlug` retorna `undefined`.

- [ ] **Passo 1:** Implementar:

```tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation-react';
import { FocusableButton } from '../components/FocusableButton';
import './NotFound.css';

export function NotFound() {
  const navigate = useNavigate();
  const { ref, focusKey, focusSelf } = useFocusable({ isFocusBoundary: true });

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="not-found">
        <h1>Filme não encontrado</h1>
        <p>O título que você procura não está disponível no catálogo.</p>
        <FocusableButton label="Voltar para a Home" iconName="home" onPress={() => navigate('/')} focusKey="not-found-home" />
      </div>
    </FocusContext.Provider>
  );
}
```

- [ ] **Passo 2:** Criar `src/routes/NotFound.css` (centralizado, `min-height: 60vh`, tipografia em `rem`, usando tokens de cor/espaçamento).
- [ ] **Passo 3 (verificação manual):** acessar `/movie/titulo-inexistente` e `/rota-qualquer`, confirmar que ambos caem nesse estado navegável (Enter no botão volta para `/`).
- [ ] **Passo 4 (commit):**

```bash
git add src/routes/NotFound.tsx src/routes/NotFound.css
git commit -m "feat: adicionar estado not-found focavel para slugs invalidos"
```

---

## Tarefa 14: Verificação final

**Files:** nenhum (apenas comandos e checagem manual)

- [ ] **Passo 1:** `npm run build` — deve terminar sem erros de `tsc` nem de Vite.
- [ ] **Passo 2:** `npm run lint` — Oxlint deve reportar 0 erros/warnings.
- [ ] **Passo 3:** `npm run dev`, percorrer manualmente com teclado (sem mouse): `Tab`/setas para navegar cards, `Enter` para abrir detalhe, `Backspace` para voltar, confirmar foco restaurado no card de origem, confirmar hero atualiza ao mover foco, confirmar refresh em `/movie/orbita-perdida` funciona direto (deep link) e `/movie/nao-existe` cai no NotFound.
- [ ] **Passo 4:** Tirar screenshots da Home (com hero + 2 carrosséis visíveis) e do MovieDetail (com backdrop/poster/elenco visíveis), avaliar contraste alto, tema escuro, safe area nas bordas e se a estética lê como 10-foot UI de Connected TV — ajustar CSS se algo parecer "página web" em vez de "app de TV".
- [ ] **Passo 5:** Confirmar por inspeção de código: nenhum `innerHTML`, nenhum SVG inline, nenhum valor `px` em fonte/espaçamento, todos os `<img>` com `width`/`height`/`onError`/`loading="lazy"` (exceto heros).
- [ ] **Passo 6 (commit final, se algo foi ajustado):**

```bash
git add -A
git commit -m "fix: ajustes finais de verificacao da UI de TV"
```
