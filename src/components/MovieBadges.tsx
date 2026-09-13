import { classNames } from '../utils/classNames';
import type { Movie } from '../data/movies';
import './MovieBadges.css';

interface MovieBadgesProps {
  movie: Movie;
  compact?: boolean;
  includeGenres?: boolean;
}

export function MovieBadges({ movie, compact = false, includeGenres = false }: MovieBadgesProps) {
  const badgeClass = classNames('badge', compact && 'badge--compact');

  return (
    <div className="badges">
      <span className={badgeClass}>{movie.year}</span>
      <span className={badgeClass}>{movie.durationMinutes} min</span>
      <span className={`${badgeClass} badge--accent`}>{movie.ageRating}</span>
      <span className={badgeClass}>
        <span aria-hidden="true">★</span> {movie.voteAverage.toFixed(1)}
      </span>
      {includeGenres
        ? movie.genres.map((genre) => (
            <span key={genre} className={badgeClass}>
              {genre}
            </span>
          ))
        : null}
    </div>
  );
}
