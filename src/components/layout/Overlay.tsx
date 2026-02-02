/**
 * Overlay component - layered rendering (like modals, popups, etc.)
 */

import type { ReactNode } from 'react';
import type { LayoutProps, StyleProps, ViewStyle } from '../../types';
import { createConsoleNode, mergeClassNameAndStyle } from '../utils';

/**
 * Props for the Overlay component
 *
 * Provides modal/popup functionality with layering and backdrop support.
 * Overlays render on top of other content with configurable z-index.
 *
 * @example
 * ```tsx
 * <Overlay zIndex={2000} backdrop={true} backdropColor="black">
 *   <Text>Modal Content</Text>
 * </Overlay>
 * ```
 */
export interface OverlayProps extends LayoutProps, StyleProps {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[]; // CSS-like style (similar to React Native)
  zIndex?: number; // Z-index for layering (higher = on top, default: 1000)
  backdrop?: boolean; // Show backdrop behind overlay (default: false)
  backdropColor?: string; // Backdrop color (default: terminal default)
}

/**
 * Overlay component - Layered rendering for modals and popups
 *
 * Provides modal/popup functionality with layering support. Overlays render
 * on top of other content with configurable z-index and optional backdrop.
 * Supports focus trapping (focus remains within overlay when open).
 *
 * @param props - Overlay component props
 * @returns React element representing an overlay container
 *
 * @example
 * ```tsx
 * <Overlay zIndex={2000} backdrop={true}>
 *   <Text>Modal Content</Text>
 *   <Button onClick={() => closeModal()}>Close</Button>
 * </Overlay>
 * ```
 */
export function Overlay({
  children,
  zIndex = 1000,
  backdrop = false,
  backdropColor,
  className,
  style,
  ...props
}: OverlayProps) {
  // Merge className with style prop and legacy props
  const mergedStyle = mergeClassNameAndStyle(className, style, props);

  return createConsoleNode('overlay', {
    zIndex,
    backdrop,
    backdropColor,
    style: mergedStyle as ViewStyle,
    layout: mergedStyle as LayoutProps,
    styles: mergedStyle,
    children,
  });
}
