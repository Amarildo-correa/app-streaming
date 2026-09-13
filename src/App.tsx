import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation-react";
import { init as initNavigation, type NextFocusResolver } from "@noriginmedia/norigin-spatial-navigation-core";
import { NavRail } from "./components/NavRail";
import { NavRailFocusContext } from "./contexts/NavRailFocusContext";

initNavigation({ debug: false, visualDebug: false, distanceCalculationMethod: "corners" });

// O rail permanece fixo à esquerda enquanto o conteúdo rola: a troca de região não
// depende das coordenadas do container da página, que podem estar fora da viewport.
const resolveAppFocus: NextFocusResolver = (direction, currentKey, siblings) => {
    if (direction === "left" && currentKey !== "nav-rail") {
        return siblings.find((sibling) => sibling.focusKey === "nav-rail") ?? null;
    }
    if (direction === "right" && currentKey === "nav-rail") {
        return siblings.find((sibling) => sibling.focusKey !== "nav-rail" && sibling.node) ?? null;
    }
    return null;
};

export function App() {
    const [isNavRailFocused, setIsNavRailFocused] = useState(false);
    const { ref, focusKey } = useFocusable({
        focusKey: "app",
        isFocusBoundary: true,
        nextFocusResolver: resolveAppFocus,
    });

    return (
        <FocusContext.Provider value={focusKey}>
            <NavRailFocusContext.Provider value={isNavRailFocused}>
                <div ref={ref} className="app-shell">
                    <NavRail onFocusChange={setIsNavRailFocused} />
                    <main className="app-content">
                        <Outlet />
                    </main>
                </div>
            </NavRailFocusContext.Provider>
        </FocusContext.Provider>
    );
}
