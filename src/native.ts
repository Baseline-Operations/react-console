/**
 * Native addon loader — required at startup; no fallback.
 * Throws with a clear message if the addon cannot be loaded.
 */

import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const ADDON_REQUIRED_MSG =
  '@baseline-operations/react-console requires the native addon. ' +
  'Run "npm run build:native" in the package root, or install a prebuild for your platform.';

function getPackageRoot(): string {
  const dir =
    typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));
  let current = path.resolve(dir);
  for (let i = 0; i < 5; i++) {
    if (
      existsSync(path.join(current, 'package.json')) &&
      existsSync(path.join(current, 'native'))
    ) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  throw new Error(`Package root (directory with package.json and native/) not found from ${dir}`);
}

function loadAddon(): { getVersion: () => string } {
  const req =
    typeof import.meta !== 'undefined' && import.meta.url
      ? createRequire(import.meta.url)
      : createRequire(__filename);
  const packageRoot = getPackageRoot();
  const addonPath = path.join(packageRoot, 'native', 'prebuilds', 'react_console_native.node');
  try {
    const loaded = req(addonPath) as { getVersion: () => string };
    if (typeof loaded?.getVersion !== 'function') {
      throw new Error(ADDON_REQUIRED_MSG + ' (addon missing getVersion)');
    }
    return loaded;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(
      ADDON_REQUIRED_MSG +
        ' Load error: ' +
        msg +
        (msg.includes('prebuilds') ? '' : ' Path: ' + addonPath)
    );
  }
}

let addon: { getVersion: () => string } | null = null;
let loadError: Error | null = null;

function getAddon(): { getVersion: () => string } {
  if (addon) return addon;
  if (loadError) throw loadError;
  try {
    addon = loadAddon();
    return addon;
  } catch (e) {
    loadError = e instanceof Error ? e : new Error(String(e));
    throw loadError;
  }
}

/**
 * Returns the native addon version. Loads the addon on first call; throws if load fails.
 */
export function getNativeVersion(): string {
  return getAddon().getVersion();
}
