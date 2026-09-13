import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation-react";
import { getMovieBySlug, type CastMember } from "../data/movies";
import { FocusableButton } from "../components/FocusableButton";
import { CastMemberButton } from "../components/CastMemberButton";
import { NotFound } from "./NotFound";
import "./MovieDetail.css";

export function MovieDetail() {
    const { slug = "" } = useParams();
    const navigate = useNavigate();
    const movie = getMovieBySlug(decodeURIComponent(slug));
    const { ref, focusKey, focusSelf } = useFocusable({
        isFocusBoundary: true,
        focusBoundaryDirections: ["up", "down", "right"],
    });
    useEffect(() => {
        focusSelf();
    }, [focusSelf]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Backspace" || event.key === "Escape") {
                event.preventDefault();
                navigate("/", { state: { fromSlug: movie?.slug } });
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [navigate, movie?.slug]);

    if (!movie) {
        return <NotFound />;
    }

    const goBack = () => navigate("/", { state: { fromSlug: movie.slug } });

    return (
        <FocusContext.Provider value={focusKey}>
            <div ref={ref} className="movie-detail">
                <div className="movie-detail__overview">
                    <div className="movie-detail__content-column">
                        <div className="movie-detail__hero-content">
                            <h1 className="movie-detail__title">{movie.title}</h1>
                            <div className="movie-detail__badges">
                                <span className="movie-detail__badge">{movie.year}</span>
                                <span className="movie-detail__badge">{movie.durationMinutes} min</span>
                                <span className="movie-detail__badge movie-detail__badge--accent">{movie.ageRating}</span>
                                <span className="movie-detail__badge">
                                    <span aria-hidden="true">★</span> {movie.voteAverage.toFixed(1)}
                                </span>
                                {movie.genres.map((genre) => (
                                    <span key={genre} className="movie-detail__badge">
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="movie-detail__body">
                            <p className="movie-detail__synopsis">{movie.synopsis}</p>
                            <p className="movie-detail__director">Direção: {movie.director}</p>
                            <div className="movie-detail__actions">
                                <FocusableButton label="Assistir" iconName="play_arrow" onPress={() => {}} focusKey="detail-watch" variant="secondary" />
                                <FocusableButton label="Minha lista" iconName="add" variant="secondary" onPress={() => {}} focusKey="detail-list" />
                                <FocusableButton label="Voltar" iconName="arrow_back" variant="secondary" onPress={goBack} focusKey="detail-back" />
                            </div>
                        </div>
                    </div>
                    <div className="movie-detail__backdrop-column">
                        <img
                            className="movie-detail__backdrop"
                            src={movie.backdropUrl}
                            width={1280}
                            height={720}
                            loading="lazy"
                            alt=""
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = `https://picsum.photos/seed/${movie.slug}-detail-fallback/1280/720`;
                            }}
                        />
                        <div className="movie-detail__gradient" />
                    </div>
                </div>
                <section className="movie-detail__cast">
                    <h2>Elenco</h2>
                    <MovieDetailCast cast={movie.cast} movieSlug={movie.slug} />
                </section>
            </div>
        </FocusContext.Provider>
    );
}

interface MovieDetailCastProps {
    cast: CastMember[];
    movieSlug: string;
}

function MovieDetailCast({ cast, movieSlug }: MovieDetailCastProps) {
    const { ref: castRef, focusKey: castFocusKey } = useFocusable({
        focusKey: "detail-cast",
        trackChildren: true,
        saveLastFocusedChild: true,
    });

    return (
        <FocusContext.Provider value={castFocusKey}>
            <div ref={castRef} className="movie-detail__cast-track">
                {cast.map((member) => (
                    <div key={member.name} className="cast-member">
                        <CastMemberButton member={member} movieSlug={movieSlug} />
                        <span className="cast-member__name">{member.name}</span>
                        <span className="cast-member__character">{member.character}</span>
                    </div>
                ))}
            </div>
        </FocusContext.Provider>
    );
}
