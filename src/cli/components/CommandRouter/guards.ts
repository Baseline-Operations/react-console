/**
 * Route guard and redirect logic for CommandRouter
 * Functions for handling route guards and redirects
 */

import type { ParsedArgs } from '../../utils/parser';
import type { ComponentMetadata } from '../../utils/matcher';

/**
 * Guard result type
 */
export type GuardResult =
  | { type: 'allowed' }
  | { type: 'blocked' }
  | { type: 'redirect'; path: string };

/**
 * Check route guards and handle redirects
 *
 * @param matchedMetadata - Matched component metadata
 * @param matchResult - Result from matchComponent
 * @param parsedArgs - Parsed command-line arguments
 * @returns Guard result (allowed, blocked, or redirect)
 */
export function checkRouteGuards(
  matchedMetadata: ComponentMetadata | null,
  matchResult: { isDefault: boolean; route?: string },
  parsedArgs: ParsedArgs
): GuardResult | null {
  if (!matchedMetadata || matchResult.isDefault) {
    return null;
  }

  // Check redirect first (simpler than guard)
  if (matchedMetadata.redirect) {
    return { type: 'redirect', path: matchedMetadata.redirect };
  }

  // Check guard if route has one
  if (matchedMetadata.guard && matchedMetadata.type === 'route' && matchedMetadata.path) {
    const guardResult = matchedMetadata.guard(
      undefined, // from route (could track previous route)
      matchedMetadata.path,
      parsedArgs,
      matchedMetadata
    );

    if (guardResult === false) {
      return { type: 'blocked' };
    } else if (typeof guardResult === 'string') {
      return { type: 'redirect', path: guardResult };
    }
  }

  return { type: 'allowed' };
}
