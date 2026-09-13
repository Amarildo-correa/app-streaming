import type { ReactNode, Ref } from "react";
import { MovieBadges } from "./MovieBadges";
import { applyPicsumFallback } from "../utils/picsum";
import type { Movie } from "../data/movies";

interface HeroCardPanelProps {
    movie: Movie;
    isDetail: boolean;
    contentRef?: Ref<HTMLDivElement>;
    children?: ReactNode;
}

/**
 * Um "cartão" completo do Hero (coluna de conteúdo + imagem de fundo). Na
 * Home, a troca de foco entre cards renderiza dois painéis lado a lado
 * (`hero-slide-track`) para o efeito de empurrar como os Stories do
 * Instagram — por isso o painel em si não conhece a rota, só o filme.
 */
export function HeroCardPanel({ movie, isDetail, contentRef, children }: HeroCardPanelProps) {
    return (
        <div className="hero-panel">
            <div className="hero__content-column">
                <div ref={contentRef} className="hero__content">
                    <h1 className="display-title">{movie.title}</h1>
                    <MovieBadges movie={movie} compact={isDetail} includeGenres={isDetail} />
                    <p className="synopsis">{movie.synopsis}</p>
                    {children}
                </div>
            </div>
            <div className="hero__backdrop-column">
                <img
                    className="backdrop-image"
                    src={movie.backdropUrl}
                    width={1280}
                    height={720}
                    loading={isDetail ? "lazy" : "eager"}
                    alt=""
                    onError={(event) => applyPicsumFallback(event, `${movie.slug}-${isDetail ? "detail" : "hero"}-fallback`, 1280, 720)}
                />
            </div>
            <div className="hero__gradient" />
        </div>
    );
}
