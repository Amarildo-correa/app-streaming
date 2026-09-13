# AGENTS.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) ao trabalhar com código neste repositório.

## Projeto

Um app de streaming / Smart TV construído com React 19 + TypeScript + Vite, navegável por controle remoto/setas via `@noriginmedia/norigin-spatial-navigation-react` e `@noriginmedia/norigin-spatial-navigation-core`. Já implementado: rota Home (hero full-bleed + carrosséis por gênero), rota de Detalhe do filme (`/movie/:slug`, backdrop full-bleed, badges de metadado, elenco em carrossel horizontal e ações) e rota NotFound, todas roteadas via `react-router-dom` v7. Os dados são um catálogo mock local (`src/data/movies.ts`), sem backend/API real — pôsteres, backdrops e fotos de elenco são gerados via `picsum.photos` com fallback `onError` para uma variação de seed caso a imagem original falhe.

A identidade visual segue um redesign de UX de app nativo de Smart TV (concluído em 2026-09-13): paleta "cinema à noite" (obsidiana `#0b0d12` + acento âmbar `#e8a33d` como única cor de destaque, sem o vermelho/preto genérico estilo template), tipografia dupla (Bebas Neue para o título em destaque no Hero/MovieDetail, Manrope para o resto da UI), navegação lateral fixa (`NavRail`, substitui o antigo header horizontal) e metadados sempre como badges/pills separados — nunca como string unida por "·". Documentação do processo de redesign (plano, análise antes/depois, screenshots) fica em `docs/superpowers/`.

## Comandos

- `npm run dev` — inicia o servidor de desenvolvimento do Vite
- `npm run build` — checagem de tipos (`tsc -b`) seguida de build de produção via Vite
- `npm run lint` — executa o Oxlint (config em `.oxlintrc.json`)
- `npm run preview` — visualiza o build de produção localmente

Ainda não há test runner configurado neste repositório.

## Notas de arquitetura

- A ferramenta de build é o Vite com `@vitejs/plugin-react` (`vite.config.ts`).
- O TypeScript está dividido em `tsconfig.app.json` (código-fonte do app, resolução via bundler, `verbatimModuleSyntax`, `noUnusedLocals`/`noUnusedParameters` habilitados) e `tsconfig.node.json` (config do próprio Vite); `tsconfig.json` apenas referencia os dois.
- O lint usa Oxlint (não ESLint) — as regras ficam em `.oxlintrc.json` com os plugins `react`, `typescript` e `oxc` habilitados.
- Ponto de entrada: `src/main.tsx` monta `<RouterProvider>` (`src/router.tsx`) em `#root` (ver `index.html`). O roteamento usa `createBrowserRouter` com `App` (`src/App.tsx`) como layout raiz (`<Outlet />`) para as rotas Home, MovieDetail e NotFound.
- `App.tsx` chama `init()` de `@noriginmedia/norigin-spatial-navigation-core` no module scope (fora do componente) para inicializar a navegação espacial uma única vez antes da primeira renderização — não mover essa chamada para dentro de um efeito/render.
- Ícones vêm de uma webfont carregada por CDN (Material Symbols Rounded, via Google Fonts) — nunca escrever SVG inline nem importar ícones por componente (ver `src/components/Icon.tsx`). Fontes de texto (Bebas Neue + Manrope) também são carregadas por CDN no `index.html`, sempre com stack de fallback local declarada.
- Design tokens (cores, espaçamento, tipografia, sombra de foco, transições, largura do rail) ficam centralizados em `src/styles/tokens.css` como custom properties; todo CSS novo deve consumir esses tokens em vez de valores soltos. Acento de cor único: `--color-accent`/`--color-focus` (âmbar) — evitar introduzir outras cores de destaque.
- Layout raiz é `flex row`: `NavRail` (rail lateral fixo, `position: sticky`, `height: 100vh`) + `<main class="app-content">` com o `<Outlet />` das rotas (`src/App.tsx`, `.app-shell`/`.app-content` em `src/index.css`). Hero (Home) e backdrop (MovieDetail) são full-bleed — sangram até a borda da viewport via margem negativa de `--safe-area`, sem card arredondado/padding lateral.
- `NavRail` (`src/components/NavRail.tsx`/`.css`) fica colapsado mostrando só ícones por padrão; expande (`--rail-width-expanded`) e revela os rótulos de texto quando algum item interno está focado, via seletor `:has(.nav-rail__item.is-focused)` (com `:focus-within` como fallback de foco real de DOM) — a navegação espacial do Norigin não move `document.activeElement`, só aplica uma classe virtual `is-focused`, por isso o `:has()` é necessário. Rótulo (`<span class="nav-rail__label">`) e ícone (`<span class="icon">` de `Icon.tsx`) precisam de classes distintas nesse CSS — um seletor genérico `span` esconderia o ícone junto com o rótulo no estado colapsado.

## Navegação espacial (foco por controle remoto/setas de TV)

Ao construir ou modificar qualquer UI focável (menus, linhas, modais, botões alcançáveis por controle remoto/setas), use a skill `norigin-spatial-navigation-react` — ela cobre o hook `useFocusable`, a configuração de `FocusContext.Provider` para componentes container/leaf, foco programático via `setFocus`/`doesFocusableExist`, e captura de foco para modais (`isFocusBoundary`). Pontos-chave que não podem ser violados:

- Todo componente focável deve anexar o `ref` retornado pelo hook a um elemento DOM real.
- Componentes container devem envolver seus filhos em `<FocusContext.Provider value={focusKey}>`, ou esses filhos ficam inalcançáveis a partir de containers irmãos.
- **Um `useFocusable` só enxerga o `FocusContext` acima de onde ele é CHAMADO, não o `FocusContext.Provider` que o mesmo componente renderiza.** Se um componente A renderiza `<FocusContext.Provider value={focusKey}>` e, no corpo da própria função A, chama `useFocusable` para um sub-elemento que só existe dentro desse Provider, esse hook lê o contexto de FORA de A (o pai de A), não o Provider que A acabou de declarar — o sub-elemento vira irmão de A na árvore de foco em vez de filho. Sempre que uma seção precisa do próprio escopo de foco aninhado dentro do container que a envolve, extraia-a para um componente filho separado (ver `MovieDetailCast` dentro de `src/routes/MovieDetail.tsx` como referência) para que o `useFocusable` dessa seção rode dentro da árvore JSX correta.
- Valores de `focusKey` devem ser estáveis entre renders — não regenerá-los a cada render.
- `focusBoundaryDirections` (passado a `useFocusable` num boundary) lista as direções BLOQUEADAS de escalar para o resolver do componente pai — não as direções permitidas. Ao mudar o layout raiz (ex.: trocar eixo de navegação entre regiões), revisar todo `useFocusable` com `isFocusBoundary`/`focusBoundaryDirections` em cada rota, não só no container que mudou — um valor esquecido bloqueia silenciosamente a direção que deveria escalar (ex.: rotas terminais como MovieDetail/NotFound precisam liberar `left` para alcançar o `NavRail` lateral).
- Padrão de restauração de foco entre rotas: ao navegar de MovieDetail de volta para Home, o `slug` de origem é passado via `navigate('/', { state: { fromSlug } })`; a Home lê esse estado em `useEffect` e chama `setFocus('card-' + slug)` (com fallback para `doesFocusableExist`) para restaurar o foco no card correto em vez de resetar para o primeiro item.
- Rotas terminais sem carrossel (MovieDetail, NotFound) usam `isFocusBoundary: true` + `focusSelf()` em `useEffect` para capturar o foco assim que a rota monta.

## Browser APIs para experiência de app nativo de Smart TV (planejamento futuro)

Quando o desenvolvimento avançar, avaliar a implantação de Browser APIs que aproximam a experiência web de um app nativo de OS de Smart TV: Wake Lock (impedir a tela de dormir durante o playback), Fullscreen API, Media Session (controles de mídia do SO/controle remoto) e Gamepad API (complementar à navegação espacial via controle remoto/joystick), entre outras relevantes ao domínio de streaming. Toda API dessa categoria deve ter fallback para browsers/plataformas sem suporte — nunca assumir disponibilidade sem feature-detection prévia.
