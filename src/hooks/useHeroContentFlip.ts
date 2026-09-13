import { useLayoutEffect, useRef } from "react";

/**
 * Home e MovieDetail alinham `.hero__content` em pontos verticais diferentes
 * (base fixa vs. centro). Ao trocar de rota, o componente é desmontado e
 * remontado, então guardamos a posição vertical de origem e, ao montar de
 * novo, aplicamos um `translateY` dela até 0 — em qualquer direção (entrando
 * ou saindo de MovieDetail), sem redimensionar.
 *
 * A captura acontece em `recordHeroContentPosition`, chamada explicitamente
 * pelo código que dispara a navegação (não no cleanup do efeito): no
 * `StrictMode` de desenvolvimento, o React invoca `setup → cleanup → setup`
 * a cada montagem, e um cleanup só descobre o estado real bem depois de o
 * componente já estar desmontado — na volta para a Home isso apagava a
 * transformação antes de qualquer pintura, e a animação nunca aparecia.
 *
 * Quem rola é a janela, não `.app-content`. Se a rota de origem estiver
 * rolada no momento da captura (ex.: role o elenco e clique em Voltar), a
 * medição pega a posição fora do lugar e infla o deslocamento calculado — por
 * isso resetamos o scroll para o topo antes de medir, tanto na origem quanto
 * no destino.
 */
let lastTop: number | null = null;

export function recordHeroContentPosition() {
    window.scrollTo(0, 0);
    const el = document.querySelector<HTMLElement>(".hero__content");
    lastTop = el ? el.getBoundingClientRect().top : null;
}

export function useHeroContentFlip<T extends HTMLElement>() {
    const ref = useRef<T>(null);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Quem rola é a janela, não `.app-content`, e o roteador não reseta essa
        // posição ao trocar de rota; sem isto, uma rolagem residual da rota
        // anterior desloca a medição abaixo.
        window.scrollTo(0, 0);

        if (lastTop === null) return;
        const delta = lastTop - el.getBoundingClientRect().top;
        lastTop = null;
        if (delta === 0) return;

        el.style.transition = "none";
        el.style.transform = `translateY(${delta}px)`;
        el.getBoundingClientRect();
        requestAnimationFrame(() => {
            el.style.transition = "transform 0.16s ease-out";
            el.style.transform = "";
        });
        el.addEventListener(
            "transitionend",
            () => {
                el.style.transition = "";
            },
            { once: true },
        );
    }, []);

    return ref;
}
