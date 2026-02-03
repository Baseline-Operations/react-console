/**
 * Router exports
 * Convenient exports for router functionality (alias for CLI router)
 *
 * @example
 * ```tsx
 * import { Router, Route, Default } from '@baseline-operations/react-console/router';
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
export { Router, CommandRouter } from './cli/components/CommandRouter';
export type { CommandRouterProps as RouterProps } from './cli/components/CommandRouter';
export { Route } from './cli/components/Route';
export type { RouteProps, RouteParam, RouteGuardFunction } from './cli/components/Route';
export { Default } from './cli/components/Default';
export type { DefaultProps } from './cli/components/Default';

// Router hooks
export { useRoute, useRouteParams, usePath, useNavigate, useDefault } from './cli/hooks';

// Router utilities
export { extractPathParams, matchRoutePath } from './cli/utils/parser';
