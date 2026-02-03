/**
 * Suspense component - React Suspense boundary for async operations
 * Provides loading states and fallback rendering for async components
 */

import { Suspense as ReactSuspense, type ReactNode } from 'react';
import type { ViewStyle } from '../types';
import { View } from './primitives/View';
import { ActivityIndicator } from './ui/ActivityIndicator';

export interface SuspenseProps {
  children: ReactNode;
  fallback?: ReactNode; // Fallback UI to show while loading
  loadingText?: string; // Simple loading text (if fallback not provided)
  loadingStyle?: ViewStyle; // Style for default loading UI
}

/**
 * Suspense component - React Suspense boundary for async operations
 *
 * Wraps components that use async data fetching or lazy loading.
 * Shows fallback UI while async operations are in progress.
 *
 * @example
 * ```tsx
 * <Suspense fallback={<ActivityIndicator label="Loading..." />}>
 *   <AsyncComponent />
 * </Suspense>
 *
 * <Suspense loadingText="Loading data...">
 *   <LazyComponent />
 * </Suspense>
 * ```
 */
export function Suspense({
  children,
  fallback,
  loadingText = 'Loading...',
  loadingStyle,
}: SuspenseProps) {
  // Default fallback if none provided
  const defaultFallback = (
    <View style={loadingStyle}>
      <ActivityIndicator label={loadingText} />
    </View>
  );

  return <ReactSuspense fallback={fallback || defaultFallback}>{children}</ReactSuspense>;
}
