import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation-react";
import { Icon } from "./Icon";
import { classNames } from "../utils/classNames";
import "./NavRail.css";

const items = [
    { key: "inicio", label: "Início", iconName: "home" },
    { key: "filmes", label: "Filmes", iconName: "movie" },
    { key: "seriados", label: "Seriados", iconName: "live_tv" },
    { key: "minha-lista", label: "Minha Lista", iconName: "bookmark" },
];

interface NavRailItemProps {
    itemKey: string;
    label: string;
    iconName: string;
}

function NavRailItem({ itemKey, label, iconName }: NavRailItemProps) {
    const { ref, focused, focusSelf } = useFocusable({ focusKey: `nav-${itemKey}` });

    return (
        <button
            ref={ref}
            type="button"
            className={classNames("nav-rail__item", focused && "is-focused")}
            onFocus={() => focusSelf()}
            onClick={() => focusSelf()}
        >
            <Icon name={iconName} />
            <span className="nav-rail__label">{label}</span>
        </button>
    );
}

interface NavRailProps {
    onFocusChange: (focused: boolean) => void;
}

export function NavRail({ onFocusChange }: NavRailProps) {
    const { ref, focusKey } = useFocusable({
        focusKey: "nav-rail",
        isFocusBoundary: true,
        focusBoundaryDirections: ["up", "down", "left"],
        // Os callbacks do container cobrem todos os botões, sem alternar o
        // estado quando o foco apenas muda de um item do rail para outro.
        onFocus: () => onFocusChange(true),
        onBlur: () => onFocusChange(false),
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
