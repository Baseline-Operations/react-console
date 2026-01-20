/**
 * Router exports
 * Convenient exports for router functionality (alias for CLI router)
 * 
 * @example
 * ```tsx
 * import { Router, Route, Default } from 'react-console/router';
 * 
 * function App() {
 *   return (
 *     <Router>
 *       <Default><HomeComponent /></Default>
 *       <Route path="/settings"><SettingsComponent /></Route>
 *     </Router>
 *   );
 * }
 * ```
 */

// Router components (alias for CLI router)
export { Router, CommandRouter } from './components/cli/CommandRouter';
export type { CommandRouterProps as RouterProps } from './components/cli/CommandRouter';
export { Route } from './components/cli/Route';
export type { RouteProps, RouteParam, RouteGuardFunction } from './components/cli/Route';
export { Default } from './components/cli/Default';
export type { DefaultProps } from './components/cli/Default';

// Router hooks
export {
  useRoute,
  useRouteParams,
  usePath,
  useNavigate,
  useDefault,
} from './hooks/cli';

// Router utilities
export {
  extractPathParams,
  matchRoutePath,
} from './utils/cli/parser';
