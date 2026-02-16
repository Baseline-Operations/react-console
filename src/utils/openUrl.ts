/**
 * Open a URL in the default browser (cross-platform).
 * Uses Node.js child_process.spawn with argument arrays to avoid shell-escaping issues.
 * No external dependency.
 */

import { spawn } from 'node:child_process';

/**
 * Open url in the default browser.
 * - macOS: open
 * - Linux: xdg-open
 * - Windows: cmd /d /s /c start "" "<url>"
 */
export function openUrl(url: string): void {
  let command: string;
  let args: string[];

  if (process.platform === 'darwin') {
    command = 'open';
    args = [url];
  } else if (process.platform === 'win32') {
    command = 'cmd';
    args = ['/d', '/s', '/c', 'start', '', url];
  } else {
    command = 'xdg-open';
    args = [url];
  }

  const child = spawn(command, args, {
    stdio: 'ignore',
    shell: false,
  });

  child.on('error', (err) => {
    console.error('[react-console] Failed to open URL:', err.message);
  });
}
