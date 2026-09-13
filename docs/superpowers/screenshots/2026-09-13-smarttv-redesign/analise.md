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

## Veredito "depois"

Todos os 6 achados do estado "antes" foram endereçados — ver `depois-home.png`, `depois-detail.png`, `depois-notfound.png` para comparação lado a lado com as capturas "antes".
