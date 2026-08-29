import { createBrowserRouter } from 'react-router-dom';
import { IntakeScreen } from './screens/IntakeScreen';
import { BriefConfirmScreen } from './screens/BriefConfirmScreen';
import { MapScreen } from './screens/MapScreen';
import { OutreachScreen } from './screens/OutreachScreen';
import { DashboardScreen } from './screens/DashboardScreen';

export const router = createBrowserRouter([
  { path: '/', element: <IntakeScreen /> },
  { path: '/briefs/:briefId/confirm', element: <BriefConfirmScreen /> },
  { path: '/briefs/:briefId/map', element: <MapScreen /> },
  { path: '/briefs/:briefId/results/:resultId', element: <OutreachScreen /> },
  { path: '/dashboard', element: <DashboardScreen /> },
]);
