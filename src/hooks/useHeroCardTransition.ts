import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { consumeArrowDirection } from "../utils/lastArrowDirection";
import type { Movie } from "../data/movies";

export interface HeroCardTransition {
    from: Movie;
    direction: "left" | "right";
}

const TRANSITION_DURATION_MS = 320;

/**
 * Na Home, ao trocar de foco entre cards com as setas, o hero inteiro faz um
 * "push" horizontal como os Stories do Instagram: o cartão antigo desliza
 * pra fora enquanto o novo entra grudado nele, sem sobrepor um no outro.
 * Isto exige manter os DOIS filmes (antigo e atual) renderizados lado a
 * lado só durante a transição — por isso devolve o filme de origem e a
 * direção, para o chamador desenhar os dois painéis.
 *
 * A primeira renderização é ignorada: a entrada na rota já é animada
 * verticalmente por `useHeroContentFlip`, sem precisar do painel duplo.
 */
export function useHeroCardTransition(movie: Movie | null): HeroCardTransition | null {
    const [transition, setTransition] = useState<HeroCardTransition | null>(null);
    const previousMovie = useRef<Movie | null>(movie);
    const isFirstRender = useRef(true);

    useLayoutEffect(() => {
        const from = previousMovie.current;
        previousMovie.current = movie;

        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (!from || !movie || from.slug === movie.slug) return;

        const direction = consumeArrowDirection();
        if (!direction) return;

        setTransition({ from, direction });
    }, [movie]);

    useEffect(() => {
        if (!transition) return;
        const id = window.setTimeout(() => setTransition(null), TRANSITION_DURATION_MS);
        return () => window.clearTimeout(id);
    }, [transition]);

    return transition;
}
