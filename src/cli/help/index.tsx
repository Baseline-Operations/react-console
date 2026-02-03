/**
 * Help system main entry point
 * Provides functions to generate help components and text
 */

import type { ReactNode } from 'react';
import { Box } from '../../components/primitives/Box';
import { extractComponentMetadata } from '../utils/matcher';
import { HelpContent } from './components/HelpContent';
import { buildHelpText } from './text/HelpTextSections';
import type { HelpOptions } from './types';
import type { ParsedArgs } from '../utils/parser';
import type { CommandOption } from '../components/Command';

export type { HelpOptions } from './types';

/**
 * Generate help component from React children
 * Returns a React Console UI component with formatted help text
 * Uses React Console components (Text, Box) for proper rendering
 * Fully TSX-based for better readability and maintainability
 */
export function generateHelpComponent(
  children: ReactNode,
  appName?: string,
  appVersion?: string,
  appDescription?: string,
  options: HelpOptions = {},
  parsedArgs?: ParsedArgs,
  routerOptions?: Record<string, CommandOption>,
  routerNoHelp?: boolean
): ReactNode {
  const metadata = extractComponentMetadata(children, routerNoHelp);

  return (
    <Box style={{ padding: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
      <HelpContent
        metadata={metadata}
        appName={appName}
        appVersion={appVersion}
        appDescription={appDescription}
        options={options}
        parsedArgs={parsedArgs}
        routerOptions={routerOptions}
        routerNoHelp={routerNoHelp}
      />
    </Box>
  );
}

/**
 * Generate help text as string
 * Uses functional/declarative approach - builds text structure declaratively
 * For programmatic use cases where string output is needed
 */
export function generateHelpText(
  children: ReactNode,
  appName?: string,
  appVersion?: string,
  appDescription?: string,
  options: HelpOptions = {},
  parsedArgs?: ParsedArgs,
  routerOptions?: Record<string, CommandOption>,
  routerNoHelp?: boolean
): string {
  const metadata = extractComponentMetadata(children, routerNoHelp);
  return buildHelpText(
    metadata,
    appName,
    appVersion,
    appDescription,
    options,
    parsedArgs,
    routerOptions,
    routerNoHelp
  );
}
