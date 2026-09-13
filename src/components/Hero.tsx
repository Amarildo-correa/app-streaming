import { useRef, type ReactNode } from "react";
import { HeroCardPanel } from "./HeroCardPanel";
import { classNames } from "../utils/classNames";
import { useHeroContentFlip } from "../hooks/useHeroContentFlip";
import { useHeroCardTransition } from "../hooks/useHeroCardTransition";
import { useHeroSlideTrack } from "../hooks/useHeroSlideTrack";
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
    const heroRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const transition = useHeroCardTransition(movie);
    useHeroSlideTrack(trackRef, transition);

    if (!movie) return <div ref={heroRef} className={className} />;

    const isDetail = variant === "detail";

    return (
        <div ref={heroRef} className={className}>
            <div ref={trackRef} className="hero-slide-track">
                {transition ? (
                    transition.direction === "right" ? (
                        <>
                            <HeroCardPanel movie={transition.from} isDetail={false} />
                            <HeroCardPanel movie={movie} isDetail={false} contentRef={contentRef} />
                        </>
                    ) : (
                        <>
                            <HeroCardPanel movie={movie} isDetail={false} contentRef={contentRef} />
                            <HeroCardPanel movie={transition.from} isDetail={false} />
                        </>
                    )
                ) : (
                    <HeroCardPanel movie={movie} isDetail={isDetail} contentRef={contentRef}>
                        {children}
                    </HeroCardPanel>
                )}
            </div>
        </div>
    );
}
