/**
 * ErrorBoundary component - Catches errors in child components and displays fallback UI
 * 
 * React error boundaries must be class components. This component catches errors
 * during rendering and displays a fallback UI instead of crashing the entire app.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary fallback={<Text color="red">Something went wrong</Text>}>
 *   <App />
 * </ErrorBoundary>
 * ```
 */

import React, { Component, type ReactNode } from 'react';
import { Text } from './primitives/Text';
import { View } from './primitives/View';
import { reportError, ErrorType } from '../utils/errors';

/**
 * Props for ErrorBoundary component
 */
export interface ErrorBoundaryProps {
  /**
   * Child components to render
   */
  children: ReactNode;
  /**
   * Fallback UI to display when an error occurs
   * If not provided, a default error message will be shown
   */
  fallback?: ReactNode | ((error: Error, errorInfo: React.ErrorInfo) => ReactNode);
  /**
   * Callback called when an error is caught
   */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /**
   * Whether to reset error state when children change
   * Default: true
   */
  resetOnChange?: boolean;
}

/**
 * State for ErrorBoundary component
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * ErrorBoundary component - Catches errors in child components
 * 
 * This is a class component because React error boundaries must be class components.
 * It catches errors during rendering, lifecycle methods, and constructors of child components.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * 
 * // With custom fallback
 * <ErrorBoundary
 *   fallback={<Text color="red">An error occurred</Text>}
 *   onError={(error) => console.error('Caught error:', error)}
 * >
 *   <App />
 * </ErrorBoundary>
 * 
 * // With function fallback
 * <ErrorBoundary
 *   fallback={(error, errorInfo) => (
 *     <View>
 *       <Text color="red" bold>Error: {error.message}</Text>
 *       <Text>Stack: {errorInfo.componentStack}</Text>
 *     </View>
 *   )}
 * >
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Update state when an error is caught
   * This is called during render phase, so side effects are not allowed
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Called after an error has been thrown by a descendant component
   * This is where we can log error information and perform side effects
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Report error to error handling system
    reportError(error, ErrorType.COMPONENT, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Reset error state when children change (if resetOnChange is true)
   */
  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { resetOnChange = true } = this.props;
    
    if (resetOnChange && this.state.hasError && prevProps.children !== this.props.children) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    }
  }

  /**
   * Render fallback UI when error occurs
   */
  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback(this.state.error, this.state.errorInfo!);
        }
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <View style={{ padding: 1, border: 'single' } as any}>
          <Text color="red" bold>⚠ Error</Text>
          <Text>An error occurred while rendering this component.</Text>
          {this.state.error.message && (
            <Text color="yellow" dim>Error: {this.state.error.message}</Text>
          )}
          {process.env.NODE_ENV === 'development' && this.state.errorInfo?.componentStack && (
            <Text color="gray" dim>
              {this.state.errorInfo.componentStack.split('\n').slice(0, 5).join('\n')}
            </Text>
          )}
        </View>
      );
    }

    // Render children normally
    return this.props.children;
  }
}

/**
 * Hook to reset error boundary (useful for programmatic error recovery)
 * 
 * Note: This is a workaround since we can't directly access ErrorBoundary state.
 * Consider using a key prop on ErrorBoundary to force remount instead.
 * 
 * @example
 * ```tsx
 * const [errorKey, setErrorKey] = useState(0);
 * 
 * <ErrorBoundary key={errorKey}>
 *   <App />
 * </ErrorBoundary>
 * 
 * // Reset by changing key
 * setErrorKey(prev => prev + 1);
 * ```
 */
export function useErrorBoundary(): {
  resetErrorBoundary: () => void;
} {
  // This is a placeholder - actual reset should be done via key prop
  return {
    resetErrorBoundary: () => {
      console.warn('useErrorBoundary: Use key prop on ErrorBoundary to reset instead');
    },
  };
}
