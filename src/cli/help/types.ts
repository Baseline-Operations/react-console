/**
 * Help system types and interfaces
 */

import type { ComponentMetadata } from '../utils/matcher';

/**
 * Help generation options
 */
export interface HelpOptions {
  /** Include command aliases in help */
  showAliases?: boolean;
  /** Include paths in help */
  showPaths?: boolean;
  /** Maximum depth for nested commands */
  maxDepth?: number;
  /** Indentation for nested items */
  indent?: number;
}

export type { ComponentMetadata };
