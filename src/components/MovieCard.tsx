import { useFocusable } from '@noriginmedia/norigin-spatial-navigation-react';
import { useNavigate } from 'react-router-dom';
import type { Movie } from '../data/movies';
import './MovieCard.css';

interface MovieCardProps {
  movie: Movie;
  onFocus: (movie: Movie) => void;
}

export function MovieCard({ movie, onFocus }: MovieCardProps) {
  const navigate = useNavigate();
  const { ref, focused } = useFocusable({
    focusKey: `card-${movie.slug}`,
    onEnterPress: () => navigate(`/movie/${encodeURIComponent(movie.slug)}`),
    onFocus: () => onFocus(movie),
  });

  return (
    <div
      ref={ref}
      className={`movie-card ${focused ? 'is-focused' : ''}`.trim()}
      onClick={() => navigate(`/movie/${encodeURIComponent(movie.slug)}`)}
    >
      <img
        src={movie.posterUrl}
        width={200}
        height={300}
        loading="lazy"
        alt={movie.title}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = `https://picsum.photos/seed/${movie.slug}-fallback/200/300`;
        }}
      />
      <span className="movie-card__title">{movie.title}</span>
    </div>
  );
}
