/**
 * Default section for help display
 */

import { type ReactNode } from 'react';
import { Text } from '../../../components/primitives/Text';
import type { ComponentMetadata } from '../types';

export interface DefaultSectionProps {
  defaultComponent?: ComponentMetadata;
}

/**
 * Default section component
 * Displays default component information
 */
export function DefaultSection({ defaultComponent }: DefaultSectionProps): ReactNode {
  if (!defaultComponent?.description) {
    return null;
  }

  return (
    <>
      <Text>Default:</Text>
      <Text> {defaultComponent.description}</Text>
      <Text></Text>
    </>
  );
}
