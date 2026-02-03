/**
 * Clipboard API - React Native compatible clipboard access
 * Provides copy/paste functionality in terminal context
 *
 * Uses platform-specific commands:
 * - macOS: pbcopy/pbpaste
 * - Linux: xclip or xsel
 * - Windows: clip / PowerShell Get-Clipboard
 */

import { exec, execSync } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Clipboard content type
 */
export interface ClipboardContent {
  /** Text content */
  text?: string;
  /** HTML content (not supported in terminal) */
  html?: string;
}

/**
 * Platform type
 */
type Platform = 'darwin' | 'linux' | 'win32' | 'unknown';

/**
 * Get current platform
 */
function getPlatform(): Platform {
  const platform = process.platform;
  if (platform === 'darwin' || platform === 'linux' || platform === 'win32') {
    return platform;
  }
  return 'unknown';
}

/**
 * Get copy command for current platform
 */
function getCopyCommand(platform: Platform): string {
  switch (platform) {
    case 'darwin':
      return 'pbcopy';
    case 'linux':
      // Try xclip first, fall back to xsel
      return 'xclip -selection clipboard';
    case 'win32':
      return 'clip';
    default:
      return '';
  }
}

/**
 * Get paste command for current platform
 */
function getPasteCommand(platform: Platform): string {
  switch (platform) {
    case 'darwin':
      return 'pbpaste';
    case 'linux':
      return 'xclip -selection clipboard -o';
    case 'win32':
      return 'powershell.exe -command "Get-Clipboard"';
    default:
      return '';
  }
}

class ClipboardModule {
  private _platform: Platform;
  private _copyCmd: string;
  private _pasteCmd: string;

  constructor() {
    this._platform = getPlatform();
    this._copyCmd = getCopyCommand(this._platform);
    this._pasteCmd = getPasteCommand(this._platform);
  }

  /**
   * Get text from clipboard
   * @returns Promise resolving to clipboard text content
   *
   * @example
   * ```tsx
   * const text = await Clipboard.getString();
   * console.log('Clipboard contains:', text);
   * ```
   */
  async getString(): Promise<string> {
    if (!this._pasteCmd) {
      console.warn('Clipboard: paste not supported on this platform');
      return '';
    }

    try {
      const { stdout } = await execAsync(this._pasteCmd);
      return stdout.trim();
    } catch (error) {
      console.error('Clipboard: failed to get string', error);
      return '';
    }
  }

  /**
   * Get text from clipboard (synchronous)
   * @returns Clipboard text content
   */
  getStringSync(): string {
    if (!this._pasteCmd) {
      return '';
    }

    try {
      const result = execSync(this._pasteCmd, { encoding: 'utf8' });
      return result.trim();
    } catch {
      return '';
    }
  }

  /**
   * Set text to clipboard
   * @param text - Text to copy to clipboard
   *
   * @example
   * ```tsx
   * await Clipboard.setString('Hello, World!');
   * ```
   */
  async setString(text: string): Promise<void> {
    if (!this._copyCmd) {
      console.warn('Clipboard: copy not supported on this platform');
      return;
    }

    try {
      await execAsync(`echo "${text.replace(/"/g, '\\"')}" | ${this._copyCmd}`);
    } catch (error) {
      console.error('Clipboard: failed to set string', error);
    }
  }

  /**
   * Set text to clipboard (synchronous)
   * @param text - Text to copy
   */
  setStringSync(text: string): void {
    if (!this._copyCmd) {
      return;
    }

    try {
      execSync(`echo "${text.replace(/"/g, '\\"')}" | ${this._copyCmd}`);
    } catch {
      // Silently fail
    }
  }

  /**
   * Check if clipboard has text content
   * @returns Promise resolving to boolean
   */
  async hasString(): Promise<boolean> {
    const content = await this.getString();
    return content.length > 0;
  }

  /**
   * Check if clipboard has text (synchronous)
   */
  hasStringSync(): boolean {
    return this.getStringSync().length > 0;
  }

  /**
   * Check if clipboard has URL
   * React Native compatible (returns false in terminal)
   */
  async hasURL(): Promise<boolean> {
    const text = await this.getString();
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if clipboard has number
   * React Native compatible
   */
  async hasNumber(): Promise<boolean> {
    const text = await this.getString();
    return !isNaN(Number(text));
  }

  /**
   * Check if clipboard has web URL
   * React Native compatible
   */
  async hasWebURL(): Promise<boolean> {
    const text = await this.getString();
    try {
      const url = new URL(text);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Get image from clipboard (not supported in terminal)
   * React Native compatible stub
   */
  async getImage(): Promise<null> {
    // Terminal doesn't support image clipboard
    return null;
  }

  /**
   * Get content types available
   * React Native compatible
   */
  async getContentTypes(): Promise<string[]> {
    const hasText = await this.hasString();
    if (hasText) {
      return ['text/plain'];
    }
    return [];
  }
}

/**
 * Clipboard singleton instance
 */
export const Clipboard = new ClipboardModule();

/**
 * Hook: useClipboard
 * React hook for clipboard access
 *
 * @example
 * ```tsx
 * const [clipboardText, setClipboardText] = useClipboard();
 *
 * // Read clipboard on mount
 * useEffect(() => {
 *   Clipboard.getString().then(setClipboardText);
 * }, []);
 *
 * // Copy to clipboard
 * const handleCopy = () => setClipboardText('Copied text!');
 * ```
 */
export function useClipboard(): [string, (text: string) => Promise<void>] {
  // This would be implemented with useState/useEffect in React
  // Placeholder implementation
  return [
    '',
    async (text: string) => {
      await Clipboard.setString(text);
    },
  ];
}
