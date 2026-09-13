# AGENTS.md

Este é o documento normativo do repositório para agentes de código. Ele descreve o estado atual do app e as regras que devem ser seguidas ao modificar a implementação. O arquivo `CLAUDE.md` apenas referencia este documento; não duplique regras nele.

## Produto e escopo

O projeto é um app de streaming para Smart TV feito com React 19, TypeScript e Vite. A navegação principal é controlada por setas/controle remoto usando `@noriginmedia/norigin-spatial-navigation-react` e `@noriginmedia/norigin-spatial-navigation-core`.

O catálogo é mock e local em `src/data/movies.ts`; não existe backend nem API de produção. Pôsteres, backdrops e fotos de elenco usam `picsum.photos` e os componentes de imagem têm fallback para outro seed quando o carregamento falha.

Rotas implantadas: `/` para Home, `/movie/:slug` para detalhe do filme e `*` para NotFound. O roteador usa `createBrowserRouter` com `basename: import.meta.env.BASE_URL`; a configuração do Vite define `base: '/app-streaming/'` para o GitHub Pages.

## Comandos

- `npm run dev` inicia o servidor Vite local.
- `npm run build` executa `tsc -b` e o build de produção com Vite.
- `npm run lint` executa o Oxlint configurado em `.oxlintrc.json`.
- `npm run preview` serve o build de produção localmente.

Não há test runner configurado. Toda alteração deve ser validada, no mínimo, com `npm run build`; execute também `npm run lint` quando alterar TypeScript, JSX ou regras estruturais de CSS.

## Estrutura de entrada e roteamento

- `src/main.tsx` monta o `RouterProvider` em `#root`.
- `src/router.tsx` declara as rotas e o `basename`.
- `src/App.tsx` é o layout raiz: fornece o contexto de foco `app`, renderiza `NavRail` e entrega a rota no `<main class="app-content">`.
- `src/routes/Home.tsx` gerencia o filme em destaque e restaura o foco do card ao retornar do detalhe.
- `src/routes/MovieDetail.tsx` exibe backdrop, metadados em badges, sinopse, ações e carrossel de elenco.
- `src/routes/NotFound.tsx` é a rota terminal para caminhos desconhecidos.
- `src/components` contém Hero, NavRail, carrosséis, cards, botões focáveis, ícones e membros do elenco.
- `src/styles/tokens.css` é a fonte dos tokens de cor, espaçamento, tipografia, raios, sombras, camadas e transições.

## Design e CSS

A identidade visual atual é "cinema à noite": fundo obsidiana, texto claro, superfícies escuras e âmbar como único acento de destaque. O título usa `Bebas Neue`; o restante da interface usa `Manrope`, com fallbacks declarados no token correspondente. Ícones são a webfont Material Symbols Rounded carregada no `index.html`; use `src/components/Icon.tsx` e não crie SVG inline nem importe ícones individuais.

Use os custom properties de `src/styles/tokens.css` em CSS novo. Não introduza outra cor de destaque, valores de espaçamento ou tipografia sem necessidade. Preserve a convenção atual de unidades relativas (`rem`, `em`, `vw`) e os raios pequenos ou em formato pill usados pelo design.

O layout raiz é uma linha flexível com `NavRail` à esquerda e `.app-content` à direita. Home e MovieDetail usam áreas full-bleed, com margens negativas baseadas em `--safe-area`; não envolva essas áreas em cards decorativos ou bordas arredondadas externas.

O Hero usa duas colunas: `.hero__content-column` tem largura fixa de `34rem` e `.hero__backdrop-column` ocupa o espaço restante e se estende pela largura do rail expandido. MovieDetail segue a mesma ideia com conteúdo separado do backdrop. Ao alterar essas colunas, confira o media query de `52rem` e mantenha o backdrop atrás do conteúdo.

Metadados devem permanecer como badges/pills separados. Em MovieDetail, `.movie-detail__badges` usa quebra de linha controlada por `column-gap` e `row-gap`; o espaçamento entre badges não deve ser recriado juntando valores com `·`.

## Navegação espacial

`App.tsx` chama `initNavigation` uma única vez no escopo do módulo, antes da primeira renderização, com `debug: false`, `visualDebug: false` e `distanceCalculationMethod: 'corners'`. Não mova essa inicialização para um componente, efeito ou handler.

Todo componente focável deve anexar o `ref` retornado por `useFocusable` a um elemento DOM real. Todo container que possui filhos focáveis deve envolver os filhos com `<FocusContext.Provider value={focusKey}>`. Um `FocusContext.Provider` renderizado pelo próprio componente não altera o contexto lido por hooks chamados antes dele; extraia a seção para um componente filho quando for necessário criar um escopo aninhado. `MovieDetailCast` é o padrão existente.

Use `focusKey` estável quando o elemento for alvo de `setFocus` ou `doesFocusableExist`. Não gere chaves novas a cada render. Ative `trackChildren` e `saveLastFocusedChild` apenas em containers que precisam acompanhar ou restaurar o filho focado.

O container `app` usa `nextFocusResolver`: esquerda a partir do conteúdo vai para `nav-rail`, e direita a partir do rail vai para o primeiro foco válido do conteúdo. O `NavRail` é boundary e bloqueia `up`, `down` e `left`, deixando a direita alcançar o conteúdo. MovieDetail e NotFound são rotas terminais com boundary e captura de foco na montagem; mantenha a direção esquerda liberada para alcançar o rail.

Ao voltar de MovieDetail para Home, navegue com `navigate('/', { state: { fromSlug } })`. Home deve tentar restaurar `card-${fromSlug}` após a montagem, usando `doesFocusableExist` antes de `setFocus`, e ter fallback para `home` ou para o primeiro card.

Botões focáveis devem usar `FocusableButton`, responder a Enter pelo `onEnterPress` e manter o callback de foco que centraliza o elemento com `scrollFocusedIntoView`. Cards, itens do rail e membros do elenco devem seguir os componentes focáveis existentes em vez de criar controles paralelos.

`focusBoundaryDirections` representa direções bloqueadas, não direções permitidas. Sempre que o eixo ou a hierarquia do layout mudar, revise os boundaries da rota afetada, do `NavRail` e do `App` em conjunto.

## Imagens e acessibilidade

Imagens de catálogo devem ter dimensões explícitas quando o formato for conhecido, `alt` adequado quando forem informativas e `alt=""` quando forem puramente decorativas. Preserve os fallbacks `onError` existentes para recursos de `picsum.photos`. Controles devem continuar sendo elementos semânticos, com `type="button"` em botões e labels acessíveis em navegação.

## Deploy

O deploy é feito pelo workflow `.github/workflows/deploy.yml` em todo push para `main` ou manualmente via `workflow_dispatch`. O workflow roda `npm ci`, `npm run build`, copia `dist/index.html` para `dist/404.html`, publica o artefato e executa `actions/deploy-pages` no ambiente `github-pages`.

Antes de considerar uma alteração pronta, confirme `npm run build`, `npm run lint` quando aplicável e o estado do Git. Não faça commit ou push automaticamente, a menos que o usuário peça explicitamente. O deploy remoto só deve ser considerado concluído quando a execução do workflow terminar com sucesso.

## Documentação visual

Planos e registros do redesign ficam em `docs/superpowers/`; imagens de referência ficam em `docs/base/` e screenshots de navegação ficam em `docs/superpowers/screenshots/`. Ao modificar o layout visual, preserve essa documentação e compare screenshots quando houver uma referência correspondente.