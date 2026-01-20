/**
 * Terminal mocking utilities for testing
 * 
 * Provides utilities to mock terminal dimensions, capabilities, and events
 * for unit and integration testing.
 */

/**
 * Mock terminal dimensions
 * 
 * Sets up mock terminal dimensions for testing.
 * Can be used to simulate different terminal sizes.
 * 
 * @param columns - Number of columns (default: 80)
 * @param rows - Number of rows (default: 24)
 * 
 * @example
 * ```ts
 * beforeEach(() => {
 *   mockTerminalDimensions(120, 40);
 * });
 * ```
 */
export function mockTerminalDimensions(columns: number = 80, rows: number = 24): void {
  // Mock process.stdout.columns and rows
  Object.defineProperty(process.stdout, 'columns', {
    value: columns,
    writable: true,
    configurable: true,
  });

  Object.defineProperty(process.stdout, 'rows', {
    value: rows,
    writable: true,
    configurable: true,
  });

  Object.defineProperty(process.stdout, 'isTTY', {
    value: true,
    writable: true,
    configurable: true,
  });
}

/**
 * Mock terminal color support
 * 
 * Sets up mock color support for testing.
 * 
 * @param supportsColor - Whether terminal supports colors (default: true)
 * 
 * @example
 * ```ts
 * beforeEach(() => {
 *   mockColorSupport(true);
 * });
 * ```
 */
export function mockColorSupport(supportsColor: boolean = true): void {
  if (supportsColor) {
    process.env.FORCE_COLOR = '1';
  } else {
    process.env.FORCE_COLOR = '0';
  }
}

/**
 * Mock terminal mouse support
 * 
 * Sets up mock mouse support for testing.
 * 
 * @param supportsMouse - Whether terminal supports mouse (default: true)
 * 
 * @example
 * ```ts
 * beforeEach(() => {
 *   mockMouseSupport(true);
 * });
 * ```
 */
export function mockMouseSupport(supportsMouse: boolean = true): void {
  if (supportsMouse) {
    process.env.TERM = 'xterm-256color';
  } else {
    process.env.TERM = 'dumb';
  }
}

/**
 * Reset terminal mocks
 * 
 * Resets all terminal mocks to default values.
 * 
 * @example
 * ```ts
 * afterEach(() => {
 *   resetTerminalMocks();
 * });
 * ```
 */
export function resetTerminalMocks(): void {
  mockTerminalDimensions(80, 24);
  mockColorSupport(true);
  mockMouseSupport(true);
}
