import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation-react';
import { MovieCard } from './MovieCard';
import type { Movie } from '../data/movies';
import './CarouselRow.css';

interface CarouselRowProps {
  title: string;
  movies: Movie[];
  focusKey: string;
  onCardFocus: (movie: Movie) => void;
}

export function CarouselRow({ title, movies, focusKey, onCardFocus }: CarouselRowProps) {
  const { ref, focusKey: resolvedFocusKey } = useFocusable({
    focusKey,
    trackChildren: true,
    saveLastFocusedChild: true,
  });

  return (
    <FocusContext.Provider value={resolvedFocusKey}>
      <section ref={ref} className="carousel-row">
        <h2 className="carousel-row__title">{title}</h2>
        <div className="carousel-row__track">
          {movies.map((movie) => (
            <MovieCard key={movie.slug} movie={movie} onFocus={onCardFocus} />
          ))}
        </div>
      </section>
    </FocusContext.Provider>
  );
}
