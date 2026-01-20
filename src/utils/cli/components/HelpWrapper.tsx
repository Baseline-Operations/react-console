/**
 * HelpWrapper - Wrapper component that handles auto-exit for help display
 * Internal component used by CommandRouter
 */

import { useEffect, type ReactNode } from 'react';
import { exit } from '../../../renderer/render';
import { Box } from '../../../components/primitives/Box';

export interface HelpWrapperProps {
  help: ReactNode;
  autoExit?: boolean;
  exitCode?: number;
}

/**
 * HelpWrapper component
 * Wraps help content and handles auto-exit after rendering
 * Internal component - not exported for external use
 */
export function HelpWrapper({ help, autoExit = true, exitCode = 0 }: HelpWrapperProps): ReactNode {
  useEffect(() => {
    if (autoExit && typeof process !== 'undefined') {
      // Use setTimeout to ensure help is fully rendered before exiting
      // This allows React Console to flush the output buffer
      // Use a small delay to ensure the render completes and output is flushed
      const timer = setTimeout(() => {
        exit(exitCode);
      }, 50); // Small delay to ensure rendering completes
      
      return () => {
        clearTimeout(timer);
      };
    }
    return undefined; // Return undefined if autoExit is false
  }, [autoExit, exitCode]);
  
  // Wrap help in a Box to ensure proper rendering
  return <Box>{help}</Box>;
}

// Set displayName for component identification
HelpWrapper.displayName = 'HelpWrapper';
