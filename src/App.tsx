import { Outlet } from 'react-router-dom';
import { init as initNavigation } from '@noriginmedia/norigin-spatial-navigation-core';

initNavigation({ debug: false, visualDebug: false, distanceCalculationMethod: 'corners' });

export function App() {
  return (
    <div className="app-shell">
      <Outlet />
    </div>
  );
}
