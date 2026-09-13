import type { Movie } from '../data/movies';
import './Hero.css';

interface HeroProps {
  movie: Movie | null;
}

export function Hero({ movie }: HeroProps) {
  if (!movie) return <div className="hero hero--empty" />;

  return (
    <div className="hero">
      <img
        className="hero__backdrop"
        src={movie.backdropUrl}
        width={1280}
        height={720}
        alt=""
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = `https://picsum.photos/seed/${movie.slug}-hero-fallback/1280/720`;
        }}
      />
      <div className="hero__gradient" />
      <div className="hero__content">
        <h1 className="hero__title">{movie.title}</h1>
        <p className="hero__meta">
          {movie.year} · {movie.durationMinutes} min · {movie.ageRating} · ★ {movie.voteAverage.toFixed(1)}
        </p>
        <p className="hero__synopsis">{movie.synopsis}</p>
      </div>
    </div>
  );
}
