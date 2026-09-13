import { useLayoutEffect, useRef } from "react";
import "../styles/focusFade.css";

const FADE_CLASS = "focus-fade--active";
const FADE_ANIMATION_MS = 240;
/**
 * Um toque isolado mantém o atraso original antes de iniciar o pulso.
 * Nas trocas rápidas, o mesmo pulso fica pausado no ponto de troca até
 * o foco estabilizar, sem reiniciar a animação a cada card.
 */
const FADE_TRIGGER_DEBOUNCE_MS = 120;
const RAPID_FOCUS_THRESHOLD_MS = 200;
const RAPID_FOCUS_IDLE_MS = 400;
/**
 * Ponto do pulso (ver `@keyframes focus-fade-pulse` em focusFade.css) em que o
 * filme exibido troca — no meio do platô de opacidade/desfoque mínimos
 * (32% a 46%), para a animação seguir encobrindo a troca tanto antes quanto
 * depois do instante exato em que ela acontece, não só nele.
 */
const FADE_PEAK_RATIO = 0.39;
const FADE_SWAP_MS = Math.round(FADE_ANIMATION_MS * FADE_PEAK_RATIO);

function startFade(track: HTMLElement) {
    // Reinicia o mesmo pulso tanto para a troca normal quanto para a pausa.
    track.classList.remove(FADE_CLASS);
    track.getBoundingClientRect();
    track.classList.add(FADE_CLASS);
    return track.getAnimations().find(
        (animation) => animation instanceof CSSAnimation && animation.animationName === "focus-fade-pulse",
    );
}

/** Compartilha o pulso e a pausa da máscara entre regiões da interface. */
export function useFocusFade<T extends HTMLElement = HTMLDivElement>(
    holdMask: boolean,
    contentKey?: string,
    onSwap?: () => void,
) {
    const trackRef = useRef<T>(null);
    const previousContentKey = useRef(contentKey);
    const debounceId = useRef<number | null>(null);
    const swapId = useRef<number | null>(null);
    const cleanupId = useRef<number | null>(null);
    const lastChangeAt = useRef<number | null>(null);
    const heldAnimation = useRef<Animation | null>(null);

    useLayoutEffect(() => {
        const from = previousContentKey.current;
        previousContentKey.current = contentKey;

        const contentChanged = from !== contentKey;
        if (!contentChanged && !holdMask && !heldAnimation.current) return;

        if (debounceId.current !== null) window.clearTimeout(debounceId.current);
        if (swapId.current !== null) window.clearTimeout(swapId.current);
        if (cleanupId.current !== null) window.clearTimeout(cleanupId.current);

        const now = performance.now();
        const isRapidChange = contentChanged && lastChangeAt.current !== null && now - lastChangeAt.current < RAPID_FOCUS_THRESHOLD_MS;
        if (contentChanged) lastChangeAt.current = now;

        const track = trackRef.current;
        if ((holdMask || isRapidChange) && track && !heldAnimation.current) {
            // Reutiliza os keyframes atuais: mantém exatamente a máscara do
            // pulso, sem criar outra camada ou outro efeito visual.
            const animation = startFade(track);
            if (animation) {
                animation.pause();
                animation.currentTime = FADE_SWAP_MS;
                heldAnimation.current = animation;
            }
        }

        // Enquanto o rail tem foco, nenhuma liberação é agendada.
        if (holdMask) return;

        debounceId.current = window.setTimeout(() => {
            debounceId.current = null;
            const el = trackRef.current;
            if (!el) return;

            if (heldAnimation.current) {
                onSwap?.();
                heldAnimation.current.play();
                heldAnimation.current = null;
                cleanupId.current = window.setTimeout(() => {
                    cleanupId.current = null;
                    el.classList.remove(FADE_CLASS);
                }, FADE_ANIMATION_MS - FADE_SWAP_MS);
                return;
            }

            startFade(el);

            swapId.current = window.setTimeout(() => {
                swapId.current = null;
                onSwap?.();
            }, FADE_SWAP_MS);

            cleanupId.current = window.setTimeout(() => {
                cleanupId.current = null;
                el.classList.remove(FADE_CLASS);
            }, FADE_ANIMATION_MS);
        }, heldAnimation.current ? RAPID_FOCUS_IDLE_MS : FADE_TRIGGER_DEBOUNCE_MS);

        return () => {
            if (debounceId.current !== null) {
                window.clearTimeout(debounceId.current);
                debounceId.current = null;
            }
            if (swapId.current !== null) {
                window.clearTimeout(swapId.current);
                swapId.current = null;
            }
            if (cleanupId.current !== null) {
                window.clearTimeout(cleanupId.current);
                cleanupId.current = null;
            }
        };
    }, [contentKey, holdMask, onSwap]);

    return trackRef;
}
