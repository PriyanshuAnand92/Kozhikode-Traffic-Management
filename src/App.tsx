import { Navigate, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { KUTISShell } from './components/layout/KUTISShell';
import { CommandCenter } from './pages/CommandCenter';
import { Measures } from './pages/AIEngine';
import { Forecasting } from './pages/Forecasting';
import { Analytics } from './pages/Analytics';
import { Incidents } from './pages/Incidents';
import { EventTrafficPage } from './pages/EventTrafficPage';
import { SystemAdmin } from './pages/SystemAdmin';
import { appRoutes } from './lib/appRoutes';

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<KUTISShell />}>
          <Route path="/" element={<Navigate to={appRoutes.commandCenter} replace />} />
          <Route path={appRoutes.commandCenter} element={<CommandCenter />} />
          <Route path={appRoutes.measures} element={<Measures />} />
          <Route path={appRoutes.forecasting} element={<Forecasting />} />
          <Route path={appRoutes.analytics} element={<Analytics />} />
          <Route path={appRoutes.incidents} element={<Incidents />} />
          <Route path={appRoutes.events} element={<EventTrafficPage />} />
          <Route path={appRoutes.systemAdmin} element={<SystemAdmin />} />
          <Route path="*" element={<Navigate to={appRoutes.commandCenter} replace />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
