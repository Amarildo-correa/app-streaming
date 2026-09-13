import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { init as initNavigation } from '@noriginmedia/norigin-spatial-navigation-core';

let navigationInitialized = false;

export function App() {
  useEffect(() => {
    if (navigationInitialized) return;
    initNavigation({ debug: false, visualDebug: false, distanceCalculationMethod: 'corners' });
    navigationInitialized = true;
  }, []);

  return (
    <div className="app-shell">
      <Outlet />
    </div>
  );
}
