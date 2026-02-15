/**
 * Open a URL in the default browser (cross-platform).
 * Uses Node.js child_process; no external dependency.
 */

import { exec } from 'node:child_process';

/**
 * Open url in the default browser.
 * - macOS: open
 * - Linux: xdg-open
 * - Windows: start
 */
export function openUrl(url: string): void {
  const escaped = url.replace(/"/g, '\\"');
  const cmd =
    process.platform === 'darwin'
      ? `open "${escaped}"`
      : process.platform === 'win32'
        ? `start "" "${escaped}"`
        : `xdg-open "${escaped}"`;
  exec(cmd, (err) => {
    if (err) {
      console.error('[react-console] Failed to open URL:', err.message);
    }
  });
}
