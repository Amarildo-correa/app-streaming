import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation-react';
import { doesFocusableExist, setFocus } from '@noriginmedia/norigin-spatial-navigation-core';
import { movies, type Genre, type Movie } from '../data/movies';
import { Hero } from '../components/Hero';
import { CarouselRow } from '../components/CarouselRow';
import './Home.css';

const MAX_ROW_LENGTH = 12;

function moviesByGenre(genre: Genre): Movie[] {
  return movies.filter((movie) => movie.genres.includes(genre)).slice(0, MAX_ROW_LENGTH);
}

const rows = [
  { title: 'Ação', focusKey: 'row-acao', movies: moviesByGenre('Ação') },
  { title: 'Ficção Científica', focusKey: 'row-ficcao-cientifica', movies: moviesByGenre('Ficção Científica') },
];

const firstMovie = rows[0]?.movies[0] ?? null;

export function Home() {
  const location = useLocation();
  const [focusedMovie, setFocusedMovie] = useState<Movie | null>(firstMovie);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const { ref, focusKey } = useFocusable({ focusKey: 'home' });

  const handleCardFocus = (movie: Movie, index: number) => {
    setFocusedMovie(movie);
    setFocusedIndex(index);
  };

  useEffect(() => {
    const fromSlug = (location.state as { fromSlug?: string } | null)?.fromSlug;
    const restoreSlug = fromSlug ?? firstMovie?.slug;
    if (restoreSlug && doesFocusableExist(`card-${restoreSlug}`)) {
      setFocus(`card-${restoreSlug}`);
    } else if (doesFocusableExist('home')) {
      setFocus('home');
    }
  }, [location.state]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="home">
        <Hero movie={focusedMovie} variant="home" />
        {rows.map((row) => {
          const alignedMovie = row.movies[Math.min(focusedIndex, row.movies.length - 1)];
          return (
            <CarouselRow
              key={row.focusKey}
              title={row.title}
              movies={row.movies}
              focusKey={row.focusKey}
              onCardFocus={handleCardFocus}
              preferredChildFocusKey={alignedMovie ? `card-${alignedMovie.slug}` : undefined}
            />
          );
        })}
      </div>
    </FocusContext.Provider>
  );
}
