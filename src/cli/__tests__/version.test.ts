/**
 * Tests for CLI version utilities
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { isVersionRequested, getAppVersion } from '../utils/version';

describe('isVersionRequested', () => {
  it('should detect --version flag', () => {
    expect(isVersionRequested({ command: [], options: { version: true }, params: [] })).toBe(true);
    expect(isVersionRequested({ command: [], options: { version: false }, params: [] })).toBe(
      false
    );
  });

  it('should detect -v flag', () => {
    expect(isVersionRequested({ command: [], options: { v: true }, params: [] })).toBe(true);
    expect(isVersionRequested({ command: [], options: { v: false }, params: [] })).toBe(false);
  });

  it('should return false for other options', () => {
    expect(isVersionRequested({ command: [], options: { help: true }, params: [] })).toBe(false);
    expect(isVersionRequested({ command: [], options: { verbose: true }, params: [] })).toBe(false);
    expect(isVersionRequested({ command: [], options: {}, params: [] })).toBe(false);
  });

  it('should handle both flags', () => {
    expect(
      isVersionRequested({ command: [], options: { version: true, v: true }, params: [] })
    ).toBe(true);
  });
});

describe('getAppVersion', () => {
  interface GlobalWithAppMetadata {
    __react_console_cli_app__?: {
      version?: string;
      name?: string;
    };
  }
  const originalGlobal = global as unknown as GlobalWithAppMetadata;

  beforeEach(() => {
    // Clear global app metadata
    if (originalGlobal.__react_console_cli_app__) {
      delete originalGlobal.__react_console_cli_app__;
    }
  });

  afterEach(() => {
    // Restore original state
    if (originalGlobal.__react_console_cli_app__) {
      delete originalGlobal.__react_console_cli_app__;
    }
  });

  it('should get version from global app metadata', () => {
    originalGlobal.__react_console_cli_app__ = {
      version: '1.2.3',
    };

    expect(getAppVersion()).toBe('1.2.3');
  });

  it('should return undefined when not set', () => {
    expect(getAppVersion()).toBeUndefined();
  });

  it('should return undefined when metadata exists but no version', () => {
    originalGlobal.__react_console_cli_app__ = {
      name: 'test-app',
    };

    expect(getAppVersion()).toBeUndefined();
  });
});
