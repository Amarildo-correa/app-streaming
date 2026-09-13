import type { Movie } from "../data/movies";
import "./Hero.css";

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
                <div className="hero__badges">
                    <span className="hero__badge">{movie.year}</span>
                    <span className="hero__badge">{movie.durationMinutes} min</span>
                    <span className="hero__badge hero__badge--accent">{movie.ageRating}</span>
                    <span className="hero__badge">
                        <span aria-hidden="true">★</span> {movie.voteAverage.toFixed(1)}
                    </span>
                </div>
                <p className="hero__synopsis">{movie.synopsis}</p>
            </div>
        </div>
    );
}
