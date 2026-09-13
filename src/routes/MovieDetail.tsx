import { useCallback, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation-react";
import { getMovieBySlug, type CastMember } from "../data/movies";
import { FocusableButton } from "../components/FocusableButton";
import { CastMemberButton } from "../components/CastMemberButton";
import { Hero } from "../components/Hero";
import { useTerminalRouteFocus } from "../hooks/useTerminalRouteFocus";
import { recordHeroContentPosition } from "../hooks/useHeroContentFlip";
import { useFocusFade } from "../hooks/useFocusFade";
import { NavRailFocusContext } from "../contexts/NavRailFocusContext";
import { NotFound } from "./NotFound";
import "./MovieDetail.css";

export function MovieDetail() {
    const { slug = "" } = useParams();
    const navigate = useNavigate();
    const movie = getMovieBySlug(decodeURIComponent(slug));
    const { ref, focusKey } = useTerminalRouteFocus();
    const isNavRailFocused = useContext(NavRailFocusContext);
    const castMaskRef = useFocusFade<HTMLElement>(isNavRailFocused);

    const goBack = useCallback(() => {
        recordHeroContentPosition();
        navigate("/", { state: { fromSlug: movie?.slug } });
    }, [navigate, movie?.slug]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Backspace" || event.key === "Escape") {
                event.preventDefault();
                goBack();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [goBack]);

    if (!movie) {
        return <NotFound />;
    }

    return (
        <FocusContext.Provider value={focusKey}>
            <div ref={ref} className="movie-detail">
                <Hero movie={movie} variant="detail">
                    <p className="movie-detail__director">Direção: {movie.director}</p>
                    <div className="movie-detail__actions">
                        <FocusableButton label="Assistir" iconName="play_arrow" onPress={() => {}} focusKey="detail-watch" />
                        <FocusableButton label="Minha lista" iconName="add" onPress={() => {}} focusKey="detail-list" />
                        <FocusableButton label="Voltar" iconName="arrow_back" onPress={goBack} focusKey="detail-back" />
                    </div>
                </Hero>
                <section ref={castMaskRef} className="movie-detail__cast">
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
    const { ref, focusKey } = useFocusable({
        focusKey: "detail-cast",
        trackChildren: true,
        saveLastFocusedChild: true,
    });

    return (
        <FocusContext.Provider value={focusKey}>
            <div ref={ref} className="movie-detail__cast-track">
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
