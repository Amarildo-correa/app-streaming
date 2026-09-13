import { Outlet } from "react-router-dom";
import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation-react";
import { init as initNavigation, type NextFocusResolver } from "@noriginmedia/norigin-spatial-navigation-core";
import { NavRail } from "./components/NavRail";

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
    const { ref, focusKey } = useFocusable({
        focusKey: "app",
        isFocusBoundary: true,
        nextFocusResolver: resolveAppFocus,
    });

    return (
        <FocusContext.Provider value={focusKey}>
            <div ref={ref} className="app-shell">
                <NavRail />
                <main className="app-content">
                    <Outlet />
                </main>
            </div>
        </FocusContext.Provider>
    );
}
