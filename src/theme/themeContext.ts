/**
 * Theme context for renderer
 *
 * Provides a way for the renderer to access the current theme without React context.
 * This is needed because the renderer operates outside of React's component tree.
 */

import type { Theme } from './types';
import { defaultTheme } from './defaultTheme';

/**
 * Current theme instance (for renderer use)
 * This is set by ThemeProvider and accessed by the renderer
 */
let currentTheme: Theme = defaultTheme;

/**
 * Set the current theme (called by ThemeProvider)
 *
 * @internal
 * This is called by ThemeProvider to update the theme for the renderer.
 */
export function setRendererTheme(theme: Theme): void {
  currentTheme = theme;
}

/**
 * Get the current theme (for renderer use)
 *
 * @internal
 * Used by the renderer to access the current theme when rendering components.
 */
export function getRendererTheme(): Theme {
  return currentTheme;
}
