/**
 * Platform API - React Native compatible platform detection
 * Identifies the platform as 'terminal' with OS-specific details
 */

/**
 * Platform constants
 */
export interface PlatformConstants {
  /** Whether running in terminal */
  isTesting: boolean;
  /** React Native version (N/A for terminal) */
  reactNativeVersion?: {
    major: number;
    minor: number;
    patch: number;
  };
}

/**
 * Platform OS type
 */
export type PlatformOSType = 'terminal' | 'ios' | 'android' | 'windows' | 'macos' | 'web';

/**
 * Platform select specifics type
 */
export interface PlatformSelectSpecifics<T> {
  terminal?: T;
  ios?: T;
  android?: T;
  windows?: T;
  macos?: T;
  web?: T;
  native?: T;
  default?: T;
}

class PlatformModule {
  /**
   * Current platform OS
   * For this library, always 'terminal'
   */
  readonly OS: PlatformOSType = 'terminal';

  /**
   * Platform version
   * Returns Node.js version for terminal
   */
  readonly Version: string = process.version;

  /**
   * Whether this is a TV device (always false for terminal)
   */
  readonly isTV: boolean = false;

  /**
   * Whether this is a Mac Catalyst app (always false for terminal)
   */
  readonly isMacCatalyst: boolean = false;

  /**
   * Whether this is a Vision OS app (always false for terminal)
   */
  readonly isVision: boolean = false;

  /**
   * Platform constants
   */
  readonly constants: PlatformConstants = {
    isTesting: process.env.NODE_ENV === 'test',
  };

  /**
   * Underlying OS (the actual operating system)
   */
  readonly underlyingOS: 'darwin' | 'linux' | 'win32' | string = process.platform;

  /**
   * Whether running on macOS
   */
  readonly isMacOS: boolean = process.platform === 'darwin';

  /**
   * Whether running on Windows
   */
  readonly isWindows: boolean = process.platform === 'win32';

  /**
   * Whether running on Linux
   */
  readonly isLinux: boolean = process.platform === 'linux';

  /**
   * Select value based on platform
   *
   * @param specifics - Object with platform-specific values
   * @returns The value for the current platform
   *
   * @example
   * ```tsx
   * const color = Platform.select({
   *   terminal: 'cyan',
   *   ios: 'blue',
   *   android: 'green',
   *   default: 'gray',
   * });
   *
   * // Terminal-specific behavior
   * const exitKey = Platform.select({
   *   terminal: 'Ctrl+C',
   *   default: 'Close button',
   * });
   * ```
   */
  select<T>(specifics: PlatformSelectSpecifics<T>): T | undefined {
    // Check for terminal-specific value first
    if ('terminal' in specifics && specifics.terminal !== undefined) {
      return specifics.terminal;
    }

    // Check for native (terminal counts as native-like)
    if ('native' in specifics && specifics.native !== undefined) {
      return specifics.native;
    }

    // Fall back to default
    if ('default' in specifics) {
      return specifics.default;
    }

    return undefined;
  }

  /**
   * Check if running on a specific platform
   *
   * @param platform - Platform to check
   * @returns Whether running on that platform
   */
  isPlatform(platform: PlatformOSType): boolean {
    return this.OS === platform;
  }

  /**
   * Get detailed platform info
   */
  getInfo(): {
    os: PlatformOSType;
    underlyingOS: string;
    version: string;
    nodeVersion: string;
    arch: string;
  } {
    return {
      os: this.OS,
      underlyingOS: this.underlyingOS,
      version: this.Version,
      nodeVersion: process.version,
      arch: process.arch,
    };
  }
}

/**
 * Platform singleton instance
 */
export const Platform = new PlatformModule();
