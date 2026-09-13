import { useLayoutEffect, useRef, useState } from "react";
import type { Movie } from "../data/movies";

const FADE_CLASS = "hero-slide-track--fading";
const FADE_ANIMATION_MS = 360;
/**
 * Enquanto o usuário segura uma seta, o foco troca de card a cada poucos
 * milissegundos; sem esse atraso, cada troca reiniciaria o pulso e ele nunca
 * chegaria a completar um ciclo — a tela ficaria "correndo" sem descanso. O
 * pulso só dispara quando o foco fica parado por este intervalo.
 */
const FADE_TRIGGER_DEBOUNCE_MS = 120;
/**
 * Ponto do pulso (ver `@keyframes hero-fade-pulse` em Hero.css) em que o
 * filme exibido troca — no meio do platô de opacidade/desfoque mínimos
 * (32% a 46%), para a animação seguir encobrindo a troca tanto antes quanto
 * depois do instante exato em que ela acontece, não só nele.
 */
const FADE_PEAK_RATIO = 0.39;
const FADE_SWAP_MS = Math.round(FADE_ANIMATION_MS * FADE_PEAK_RATIO);

/**
 * Na Home, ao trocar o filme em destaque do Hero pela navegação espacial
 * (foco mudando de card), `.hero-slide-track` faz um pulso suave de
 * opacidade e desfoque — e é o próprio pulso que decide quando o filme
 * exibido (`displayedMovie`) troca, no seu ponto mais escuro, para a
 * animação mascarar a troca em vez de só acontecer depois dela.
 *
 * A primeira renderização é ignorada: a entrada na rota já é animada
 * verticalmente por `useHeroContentFlip`.
 */
export function useHeroFocusFade(movie: Movie | null) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [displayedMovie, setDisplayedMovie] = useState(movie);
    const previousMovie = useRef<Movie | null>(movie);
    const isFirstRender = useRef(true);
    const debounceId = useRef<number | null>(null);
    const swapId = useRef<number | null>(null);
    const cleanupId = useRef<number | null>(null);

    useLayoutEffect(() => {
        const from = previousMovie.current;
        previousMovie.current = movie;

        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (!from || !movie || from.slug === movie.slug) return;

        if (debounceId.current !== null) window.clearTimeout(debounceId.current);
        if (swapId.current !== null) window.clearTimeout(swapId.current);
        if (cleanupId.current !== null) window.clearTimeout(cleanupId.current);

        debounceId.current = window.setTimeout(() => {
            debounceId.current = null;
            const el = trackRef.current;
            if (!el) return;

            // Remove e força reflow antes de reaplicar para permitir retrigger
            // da animação caso um pulso anterior ainda esteja em andamento.
            el.classList.remove(FADE_CLASS);
            el.getBoundingClientRect();
            el.classList.add(FADE_CLASS);

            swapId.current = window.setTimeout(() => {
                swapId.current = null;
                setDisplayedMovie(movie);
            }, FADE_SWAP_MS);

            cleanupId.current = window.setTimeout(() => {
                cleanupId.current = null;
                el.classList.remove(FADE_CLASS);
            }, FADE_ANIMATION_MS);
        }, FADE_TRIGGER_DEBOUNCE_MS);

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
    }, [movie]);

    return { trackRef, displayedMovie };
}
