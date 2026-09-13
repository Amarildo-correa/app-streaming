import { useCallback, useState } from "react";
import { useFocusFade } from "./useFocusFade";
import type { Movie } from "../data/movies";

/** Troca o filme no ponto de pausa do efeito compartilhado da máscara. */
export function useHeroFocusFade(movie: Movie | null, holdMask = false) {
    const [displayedMovie, setDisplayedMovie] = useState(movie);
    const swapMovie = useCallback(() => setDisplayedMovie(movie), [movie]);
    const trackRef = useFocusFade(holdMask, movie?.slug, swapMovie);

    return { trackRef, displayedMovie };
}
