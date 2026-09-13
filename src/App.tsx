import { Outlet } from 'react-router-dom';
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation-react';
import { init as initNavigation, type NextFocusResolver } from '@noriginmedia/norigin-spatial-navigation-core';
import { Header } from './components/Header';

initNavigation({ debug: false, visualDebug: false, distanceCalculationMethod: 'corners' });

// O header permanece fixo enquanto a rota rola: a troca de região não depende
// das coordenadas do container da página, que podem estar fora da viewport.
const resolveAppFocus: NextFocusResolver = (direction, currentKey, siblings) => {
  if (direction === 'up' && currentKey !== 'header-nav') {
    return siblings.find((sibling) => sibling.focusKey === 'header-nav') ?? null;
  }
  if (direction === 'down' && currentKey === 'header-nav') {
    return siblings.find((sibling) => sibling.focusKey !== 'header-nav' && sibling.node) ?? null;
  }
  return null;
};

export function App() {
  const { ref, focusKey } = useFocusable({
    focusKey: 'app',
    isFocusBoundary: true,
    nextFocusResolver: resolveAppFocus,
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="app-shell">
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </FocusContext.Provider>
  );
}
