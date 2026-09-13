# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) ao trabalhar com código neste repositório.

## Projeto

Um app de streaming / Smart TV construído com React 19 + TypeScript + Vite, navegável por controle remoto/setas via `@noriginmedia/norigin-spatial-navigation-react` e `@noriginmedia/norigin-spatial-navigation-core`. Já implementado: rota Home (hero + carrosséis por gênero), rota de Detalhe do filme (`/movie/:slug`, elenco e ações) e rota NotFound, todas roteadas via `react-router-dom` v7. Os dados são um catálogo mock local (`src/data/movies.ts`), sem backend/API real — pôsteres, backdrops e fotos de elenco são gerados via `picsum.photos` com fallback `onError` para uma variação de seed caso a imagem original falhe.

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
- Ícones vêm de uma webfont carregada por CDN (Material Symbols Rounded, via Google Fonts) — nunca escrever SVG inline nem importar ícones por componente (ver `src/components/Icon.tsx`). Fontes de texto também são carregadas por CDN, sempre com stack de fallback local declarada.
- Design tokens (cores, espaçamento, tipografia, sombra de foco, transições) ficam centralizados em `src/styles/tokens.css` como custom properties; todo CSS novo deve consumir esses tokens em vez de valores soltos.

## Navegação espacial (foco por controle remoto/setas de TV)

Ao construir ou modificar qualquer UI focável (menus, linhas, modais, botões alcançáveis por controle remoto/setas), use a skill `norigin-spatial-navigation-react` — ela cobre o hook `useFocusable`, a configuração de `FocusContext.Provider` para componentes container/leaf, foco programático via `setFocus`/`doesFocusableExist`, e captura de foco para modais (`isFocusBoundary`). Pontos-chave que não podem ser violados:

- Todo componente focável deve anexar o `ref` retornado pelo hook a um elemento DOM real.
- Componentes container devem envolver seus filhos em `<FocusContext.Provider value={focusKey}>`, ou esses filhos ficam inalcançáveis a partir de containers irmãos.
- Valores de `focusKey` devem ser estáveis entre renders — não regenerá-los a cada render.
- Padrão de restauração de foco entre rotas: ao navegar de MovieDetail de volta para Home, o `slug` de origem é passado via `navigate('/', { state: { fromSlug } })`; a Home lê esse estado em `useEffect` e chama `setFocus('card-' + slug)` (com fallback para `doesFocusableExist`) para restaurar o foco no card correto em vez de resetar para o primeiro item.
- Rotas terminais sem carrossel (MovieDetail, NotFound) usam `isFocusBoundary: true` + `focusSelf()` em `useEffect` para capturar o foco assim que a rota monta.

## Browser APIs para experiência de app nativo de Smart TV (planejamento futuro)

Quando o desenvolvimento avançar, avaliar a implantação de Browser APIs que aproximam a experiência web de um app nativo de OS de Smart TV: Wake Lock (impedir a tela de dormir durante o playback), Fullscreen API, Media Session (controles de mídia do SO/controle remoto) e Gamepad API (complementar à navegação espacial via controle remoto/joystick), entre outras relevantes ao domínio de streaming. Toda API dessa categoria deve ter fallback para browsers/plataformas sem suporte — nunca assumir disponibilidade sem feature-detection prévia.
