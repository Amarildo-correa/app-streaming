import { useLayoutEffect, type RefObject } from "react";
import type { HeroCardTransition } from "./useHeroCardTransition";

/**
 * Anima `.hero-slide-track` quando há uma `HeroCardTransition` ativa: mede a
 * largura real do Hero (um painel) e desliza a trilha de duas colunas até
 * revelar o painel novo — o painel antigo termina totalmente fora da tela,
 * grudado no novo, sem sobreposição.
 */
export function useHeroSlideTrack(trackRef: RefObject<HTMLElement | null>, transition: HeroCardTransition | null): void {
    useLayoutEffect(() => {
        const el = trackRef.current;
        if (!el) return;

        if (!transition) {
            el.classList.remove("is-transitioning");
            el.style.transition = "none";
            el.style.transform = "";
            return;
        }

        const panelWidth = el.parentElement?.clientWidth ?? 0;
        el.style.setProperty("--panel-width", `${panelWidth}px`);
        el.classList.add("is-transitioning");

        const revealed = "translateX(calc(-1 * var(--panel-width)))";
        const origin = "translateX(0)";
        const [from, to] = transition.direction === "right" ? [origin, revealed] : [revealed, origin];

        el.style.transition = "none";
        el.style.transform = from;
        el.getBoundingClientRect();
        requestAnimationFrame(() => {
            el.style.transition = "transform 0.3s ease-out";
            el.style.transform = to;
        });
    }, [trackRef, transition]);
}
