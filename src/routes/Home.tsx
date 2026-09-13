import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation-react';
import { doesFocusableExist, setFocus } from '@noriginmedia/norigin-spatial-navigation-core';
import { movies, type Movie } from '../data/movies';
import { Hero } from '../components/Hero';
import { CarouselRow } from '../components/CarouselRow';
import './Home.css';

const actionMovies = movies.filter((movie) => movie.genres.includes('Ação')).slice(0, 12);
const sciFiMovies = movies.filter((movie) => movie.genres.includes('Ficção Científica')).slice(0, 12);

export function Home() {
  const location = useLocation();
  const [focusedMovie, setFocusedMovie] = useState<Movie | null>(actionMovies[0] ?? null);
  const { ref, focusKey } = useFocusable({ focusKey: 'home' });

  useEffect(() => {
    const fromSlug = (location.state as { fromSlug?: string } | null)?.fromSlug;
    const restoreKey = fromSlug ? `card-${fromSlug}` : `card-${actionMovies[0]?.slug}`;
    if (restoreKey && doesFocusableExist(restoreKey)) {
      setFocus(restoreKey);
    } else if (doesFocusableExist('home')) {
      setFocus('home');
    }
  }, [location.state]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="home">
        <Hero movie={focusedMovie} />
        <CarouselRow title="Ação" movies={actionMovies} focusKey="row-acao" onCardFocus={setFocusedMovie} />
        <CarouselRow
          title="Ficção Científica"
          movies={sciFiMovies}
          focusKey="row-ficcao-cientifica"
          onCardFocus={setFocusedMovie}
        />
      </div>
    </FocusContext.Provider>
  );
}
