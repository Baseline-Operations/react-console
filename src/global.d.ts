/**
 * Global type definitions
 */

declare global {
  // CLI App metadata
  var __react_console_cli_app__:
    | {
        name: string;
        version?: string;
        description?: string;
        exitCode?: number;
        interactive?: boolean;
      }
    | undefined;
}

export {};
