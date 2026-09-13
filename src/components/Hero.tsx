import { useContext, type ReactNode } from "react";
import { HeroCardPanel } from "./HeroCardPanel";
import { classNames } from "../utils/classNames";
import { useHeroContentFlip } from "../hooks/useHeroContentFlip";
import { useHeroFocusFade } from "../hooks/useHeroFocusFade";
import { NavRailFocusContext } from "../contexts/NavRailFocusContext";
import type { Movie } from "../data/movies";
import "./Hero.css";

interface HeroProps {
    movie: Movie | null;
    /**
     * `home` fixa o hero no topo enquanto os carrosséis rolam; `detail` deixa a
     * mesma estrutura crescer com o conteúdo extra da rota de detalhe.
     */
    variant: "home" | "detail";
    children?: ReactNode;
}

export function Hero({ movie, variant, children }: HeroProps) {
    const className = classNames("hero", variant === "home" && "hero--home");
    const contentRef = useHeroContentFlip<HTMLDivElement>();
    const isNavRailFocused = useContext(NavRailFocusContext);
    const { trackRef, displayedMovie } = useHeroFocusFade(movie, isNavRailFocused);

    if (!displayedMovie) return <div className={className} />;

    const isDetail = variant === "detail";

    return (
        <div className={className}>
            <div ref={trackRef} className="hero-slide-track">
                <HeroCardPanel movie={displayedMovie} isDetail={isDetail} contentRef={contentRef}>
                    {children}
                </HeroCardPanel>
            </div>
        </div>
    );
}
