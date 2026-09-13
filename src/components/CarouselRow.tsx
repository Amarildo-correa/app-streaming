import { useRef } from 'react';
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const { ref, focusKey: resolvedFocusKey } = useFocusable({
    focusKey,
    trackChildren: true,
    saveLastFocusedChild: true,
  });

  const handleCardFocus = (movie: Movie, index: number) => {
    onCardFocus(movie);
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = 12.5 * 16 + 1.5 * 16;
    const targetScroll = index * cardWidth - container.clientWidth / 2 + cardWidth / 2;
    container.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
  };

  return (
    <FocusContext.Provider value={resolvedFocusKey}>
      <section ref={ref} className="carousel-row">
        <h2 className="carousel-row__title">{title}</h2>
        <div className="carousel-row__track" ref={scrollRef}>
          {movies.map((movie, index) => (
            <MovieCard key={movie.slug} movie={movie} onFocus={() => handleCardFocus(movie, index)} />
          ))}
        </div>
      </section>
    </FocusContext.Provider>
  );
}
