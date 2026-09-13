import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation-react";
import { Icon } from "./Icon";
import "./NavRail.css";

const items = [
    { key: "inicio", label: "Início", iconName: "home" },
    { key: "filmes", label: "Filmes", iconName: "movie" },
    { key: "seriados", label: "Seriados", iconName: "live_tv" },
    { key: "minha-lista", label: "Minha Lista", iconName: "bookmark" },
];

function NavRailItem({ label, itemKey, iconName }: { label: string; itemKey: string; iconName: string }) {
    const { ref, focused, focusSelf } = useFocusable({ focusKey: `nav-${itemKey}` });

    return (
        <button ref={ref} type="button" className={`nav-rail__item ${focused ? "is-focused" : ""}`.trim()} onFocus={() => focusSelf()} onClick={() => focusSelf()}>
            <Icon name={iconName} />
            <span>{label}</span>
        </button>
    );
}

export function NavRail() {
    const { ref, focusKey } = useFocusable({
        focusKey: "nav-rail",
        isFocusBoundary: true,
        focusBoundaryDirections: ["up", "down", "left"],
    });

    return (
        <FocusContext.Provider value={focusKey}>
            <nav ref={ref} className="nav-rail" aria-label="Navegação principal">
                <span className="nav-rail__brand">SCTV</span>
                {items.map(({ key, label, iconName }) => (
                    <NavRailItem key={key} itemKey={key} label={label} iconName={iconName} />
                ))}
            </nav>
        </FocusContext.Provider>
    );
}
