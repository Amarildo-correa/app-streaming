import { useFocusable } from '@noriginmedia/norigin-spatial-navigation-react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../utils/classNames';
import { applyPicsumFallback } from '../utils/picsum';
import { scrollFocusedIntoView } from '../utils/scrollFocusedIntoView';
import { recordHeroContentPosition } from '../hooks/useHeroContentFlip';
import { recordArrowDirection } from '../utils/lastArrowDirection';
import type { Movie } from '../data/movies';
import './MovieCard.css';

interface MovieCardProps {
  movie: Movie;
  onFocus: (movie: Movie) => void;
}

export function MovieCard({ movie, onFocus }: MovieCardProps) {
  const navigate = useNavigate();
  const openMovie = () => {
    recordHeroContentPosition();
    navigate(`/movie/${encodeURIComponent(movie.slug)}`);
  };
  const { ref, focused } = useFocusable({
    focusKey: `card-${movie.slug}`,
    onEnterPress: openMovie,
    // A direção fica registrada aqui para o slide do Hero (useHeroCardTransition);
    // o próprio card não desliza mais, só faz zoom (ver MovieCard.css).
    onArrowPress: (direction) => {
      recordArrowDirection(direction);
      return true;
    },
    onFocus: () => {
      onFocus(movie);
      scrollFocusedIntoView(ref.current);
    },
  });

  return (
    <div ref={ref} className={classNames('movie-card', focused && 'is-focused')} onClick={openMovie}>
      <img
        src={movie.backdropUrl}
        width={1280}
        height={720}
        loading="lazy"
        alt={movie.title}
        onError={(event) => applyPicsumFallback(event, `${movie.slug}-fallback`, 1280, 720)}
      />
      <span className="movie-card__title">{movie.title}</span>
    </div>
  );
}
