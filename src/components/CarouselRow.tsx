import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation-react';
import { MovieCard } from './MovieCard';
import type { Movie } from '../data/movies';
import './CarouselRow.css';

interface CarouselRowProps {
  title: string;
  movies: Movie[];
  focusKey: string;
  onCardFocus: (movie: Movie, index: number) => void;
  /**
   * Sem isto, a lib sempre abre uma fileira nunca visitada pelo primeiro
   * card ao entrar via seta cima/baixo, ignorando de qual coluna o usuário
   * veio — por isso os cards "desalinham" ao trocar de fileira. Repassa o
   * índice da última coluna focada (em qualquer fileira) para manter o
   * alinhamento horizontal na primeira visita.
   */
  preferredChildFocusKey?: string;
}

export function CarouselRow({ title, movies, focusKey, onCardFocus, preferredChildFocusKey }: CarouselRowProps) {
  const { ref, focusKey: resolvedFocusKey } = useFocusable({
    focusKey,
    trackChildren: true,
    saveLastFocusedChild: true,
    preferredChildFocusKey,
  });

  return (
    <FocusContext.Provider value={resolvedFocusKey}>
      <section ref={ref} className="carousel-row">
        <h2 className="carousel-row__title">{title}</h2>
        <div className="carousel-row__track">
          {movies.map((movie, index) => (
            <MovieCard key={movie.slug} movie={movie} onFocus={() => onCardFocus(movie, index)} />
          ))}
        </div>
      </section>
    </FocusContext.Provider>
  );
}
