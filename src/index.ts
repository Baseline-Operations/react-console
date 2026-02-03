/**
 * React Console - Main entry point
 * React 19+ TypeScript library for building console/terminal applications using JSX
 */

// Renderer - integrated into Node class
import { Node } from './nodes/base/Node';
export const render = Node.render.bind(Node);
export const unmount = Node.unmount.bind(Node);
export const exit = Node.exit.bind(Node);

// Components - Primitives
export { Text } from './components/primitives/Text';
export type { TextProps } from './components/primitives/Text';
export { Box } from './components/primitives/Box';
export type { BoxProps } from './components/primitives/Box';
export { View } from './components/primitives/View';
export type { ViewProps } from './components/primitives/View';
export { ScrollView } from './components/layout/ScrollView';
export type { ScrollViewProps } from './components/layout/ScrollView';
export { LineBreak } from './components/primitives/LineBreak';
// Legacy support (deprecated - use LineBreak instead)
export { Newline } from './components/primitives/Newline';

// Components - Interactive
export { TextInput, Input } from './components/interactive/TextInput';
export type { TextInputProps, InputProps } from './components/interactive/TextInput';
export { Button } from './components/interactive/Button';
export type { ButtonProps } from './components/interactive/Button';
export { Pressable } from './components/interactive/Pressable';
export type { PressableProps } from './components/interactive/Pressable';
export { Focusable } from './components/interactive/Focusable';
export type { FocusableProps } from './components/interactive/Focusable';
export { Switch } from './components/interactive/Switch';
export type { SwitchProps, SwitchChangeEvent } from './components/interactive/Switch';
export { Prompt } from './components/interactive/Prompt';
export type { PromptProps } from './components/interactive/Prompt';

// Selection components
export { Radio } from './components/selection/Radio';
export type { RadioProps, RadioOption } from './components/selection/Radio';
export { Checkbox } from './components/selection/Checkbox';
export type { CheckboxProps, CheckboxOption } from './components/selection/Checkbox';
export { Dropdown } from './components/selection/Dropdown';
export type { DropdownProps, DropdownOption } from './components/selection/Dropdown';
export { List } from './components/selection/List';
export type { ListProps, ListOption } from './components/selection/List';

// Selection components also available via 'react-console/selection'
// See src/selection.ts for exports

// Layout components are available via 'react-console/layout'
// See src/layout.ts for exports

// Components - Data
export { Table } from './components/data/Table';
export type { TableProps, TableColumn } from './components/data/Table';
export { FlatList } from './components/data/FlatList';
export type {
  FlatListProps,
  ListRenderItemInfo,
  ViewToken,
  ViewabilityConfig,
  ScrollEvent,
} from './components/data/FlatList';

export { SectionList } from './components/data/SectionList';
export type {
  SectionListProps,
  Section,
  DefaultSectionT,
  SectionListRenderItemInfo,
  SectionListRenderSectionInfo,
} from './components/data/SectionList';

// Components - UI
export { ActivityIndicator, Spinner } from './components/ui/ActivityIndicator';
export type {
  ActivityIndicatorProps,
  SpinnerProps,
  SpinnerStyle,
} from './components/ui/ActivityIndicator';
export { ProgressBar } from './components/ui/ProgressBar';
export type { ProgressBarProps } from './components/ui/ProgressBar';

// Components - Error Handling
export { ErrorBoundary, useErrorBoundary } from './components/ErrorBoundary';
export type { ErrorBoundaryProps } from './components/ErrorBoundary';

// Components - Suspense
export { Suspense } from './components/Suspense';
export type { SuspenseProps } from './components/Suspense';

// Components - Form
export { Form } from './components/Form';
export type {
  FormProps,
  FormFieldError,
  FormValidationResult,
  FormValidator,
} from './components/Form';

// Animation components and utilities are available via 'react-console/animations'
// See src/animations.ts for exports

// CLI components and utilities are available via 'react-console/cli' or 'react-console/router'
// See src/cli.ts and src/router.ts for exports

// Utilities - Debug
export {
  debug,
  debugLabeled,
  isDebugEnabled,
  setDebugMode,
  isDebugMode,
  debugLog,
  debugError,
  inspectComponentTree,
  performanceProfiler,
} from './utils/debug';

// Utilities - Errors (enhanced)
export { ErrorMessages, deprecationWarning } from './utils/errors';

// Utilities - Extensibility
export {
  componentRegistry,
  pluginAPI,
  registerComponent,
  registerPlugin,
  unregisterPlugin,
} from './utils/extensibility';
export type { CustomRenderer, ComponentRegistryEntry, PluginConfig } from './utils/extensibility';

// Types - Guards (enhanced)
export {
  isStringArray,
  isNumberArray,
  isArrayValue,
  isPrimitiveValue,
  isInputNode,
  isButtonNode,
  isSelectionNode,
  isMultiSelectNode,
  isInteractiveNode,
  isLayoutNode,
  isClickableNode,
  isSelectOption,
  isSelectOptionArray,
  hasOptions,
  isTextNode,
  isBoxNode,
  hasValue,
  isDisabledNode,
  isFocusedNode,
  hasChildren,
  isViewStyle,
  isTextStyle,
} from './types/guards';

// Utilities - Formatting (text manipulation)
export {
  padText,
  wrapTextLines,
  formatNumber,
  formatPercentage,
  formatDuration,
  formatFileSize,
  repeat,
  createProgressBar,
} from './utils/formatting';
// Note: truncateText is exported from './utils/measure' (ANSI-aware version)

// Utilities - Console
export {
  clearScreen,
  clearToEndOfScreen,
  clearToBeginningOfScreen,
  clearLine,
  clearToEndOfLine,
  clearToBeginningOfLine,
  moveCursor,
  moveCursorUp,
  moveCursorDown,
  moveCursorRight,
  moveCursorLeft,
  saveCursor,
  restoreCursor,
  hideCursor,
  showCursor,
  scrollUp,
  scrollDown,
  ScreenBuffer,
} from './utils/console';

// Utilities - Input Validator
export { InputValidator, ValidationRules } from './utils/inputValidator';
export type { ValidationRule, ValidationRuleConfig } from './utils/inputValidator';

// Utilities - Date Formatting
export {
  formatDate,
  formatRelativeTime,
  formatDateHuman,
  formatTime,
  parseDate,
  startOfDay,
  endOfDay,
  isToday,
  isPast,
  isFuture,
} from './utils/dateFormatting';

// Types - Guards (enhanced) - additional guards
export {
  isConsoleNode,
  isColor,
  assertIsType,
  assertIsConsoleNode,
  assertIsArray,
} from './types/guards';

// Build Configuration (if build.config.ts exists)
// Note: build.config.ts may not exist yet - commented out to avoid errors
// export {
//   defaultBuildConfig,
//   mergeBuildConfig,
//   validateBuildConfig,
// } from '../build.config';
// export type { BuildConfig } from '../build.config';

// Error Handlers - Class-based error handling patterns
export {
  BaseErrorHandler,
  ConsoleErrorHandler,
  SilentErrorHandler,
  FileErrorHandler,
  CompositeErrorHandler,
  withErrorHandler,
  createErrorHandlerWrapper,
  setClassBasedErrorHandler,
} from './utils/errorHandlers';

// Utilities - Memoization and Performance
export {
  memoizeStyle,
  memoizeResponsiveSize,
  clearMemoizationCache,
  getCacheStats,
} from './utils/memoization';

// Utilities - Debouncing
export { debounce, debounceImmediate, throttle } from './utils/debounce';

// Utilities - State-based styling (React Native Pressable-style)
export {
  resolveStateStyle,
  createStatefulStyle,
  createDefaultInteractionState,
  isStatefulStyle,
} from './utils/stateStyles';
export type { InteractionState, StateStyle, StateStyleProps } from './utils/stateStyles';

// Utilities - Refs (React Native compatible imperative handles)
export { createTextInputRef, createScrollViewRef, createFlatListRef } from './utils/refs';
export type {
  TextInputRef,
  ScrollViewRef,
  FlatListRef,
  SectionListRef,
  ViewRef,
  PressableRef,
  ButtonRef,
} from './utils/refs';

// Renderer - Batching (for advanced usage)
export {
  scheduleBatchedUpdate,
  flushBatchedUpdates,
  flushBatchedUpdatesSync,
  clearBatchedUpdates,
  hasBatchedUpdates,
  getBatchedUpdatesCount,
} from './renderer/batching';

// Types
export type {
  Color,
  StyleProps,
  LayoutProps,
  ConsoleNode,
  TerminalDimensions,
  KeyPress,
  InputEvent,
  KeyboardEvent,
  MouseEvent,
  RenderMode,
  ComponentEventHandlers,
  InputType,
} from './types';

// Utilities (for advanced usage)
export { getTerminalDimensions, supportsColor, enterRawMode, exitRawMode } from './utils/terminal';
export { supportsMouse, enableMouseTracking, disableMouseTracking } from './utils/mouse';
export { applyStyles, stripAnsiCodes, getVisibleLength } from './renderer/ansi';
export { measureText, wrapText, truncateText, decodeHtmlEntities } from './utils/measure';
export { resolveSize, resolveWidth, resolveHeight } from './utils/responsive';
export type { ResponsiveSize } from './types';

// Validation utilities (generic, type-safe)
export {
  validateNumber,
  validateString,
  composeValidators,
  type ValidationResult,
  type Validator,
  type NumberConstraints,
  type StringConstraints,
} from './utils/validation';

// Error handling utilities
export {
  reportError,
  setErrorHandler,
  getErrorHandler,
  withErrorHandling,
  checkTerminalSupport,
  safeGetTerminalDimensions,
  ErrorType,
  type ErrorHandler,
} from './utils/errors';

// Global terminal object (similar to `window` in browsers)
export { terminal, updateTerminalDimensions } from './utils/globalTerminal';
export type { GlobalTerminal } from './utils/globalTerminal';

// Storage system is available via 'react-console/storage'
// See src/storage.ts for exports

// Advanced hooks are available via 'react-console/hooks'
// See src/hooks.ts for exports

// Theme system is available via 'react-console/theme'
// See src/theme.ts for exports

// Focus and component management utilities
export { focusComponent, enableComponent, disableComponent } from './renderer/utils/navigation';

// Layout debugging utilities
export {
  getLayoutDebugInfo,
  formatLayoutDebugInfo,
  printLayoutDebugInfo,
  getAllComponentBounds,
  getVisualLayoutInspector,
  getVisualGridOverlay,
  getVisualFlexboxOverlay,
  checkLayoutWarnings,
  formatLayoutWarnings,
  printLayoutWarnings,
  type LayoutDebugInfo,
  type LayoutWarning,
} from './utils/layoutDebug';

// StyleSheet (React Native–like API for terminal styles)
export { StyleSheet } from './utils/StyleSheet';

// className support for style libraries
export {
  registerClassNames,
  registerClass,
  resolveClassName,
  mergeClassNameWithStyle,
  createStyleLibrary,
  classNameRegistry,
} from './utils/className';

// React Native compatible APIs are available via 'react-console/apis'
// See src/apis.ts for exports
// Also re-exported here for convenience:
export {
  AppState,
  Keyboard,
  BackHandler,
  Clipboard,
  Alert,
  Bell,
  Dimensions,
  Platform,
  useAppState,
  useBackHandler,
  useClipboard,
  useBell,
  useWindowDimensions,
} from './apis';
export type {
  AppStateStatus,
  NativeEventSubscription,
  KeyboardEvent as KeyboardAPIEvent,
  AlertButton,
  AlertOptions,
} from './apis';

// Multi-Buffer Rendering System
// Advanced cell-based rendering with z-index layering and efficient diff updates
export {
  BufferRenderer,
  CellBuffer,
  CompositeBuffer,
  DisplayBuffer,
  Layer,
  LayerManager,
  ANSIGenerator,
  getBufferRenderer,
  resetBufferRenderer,
  type Cell,
  type CellRenderContext,
  type BoundingBox as BufferBoundingBox,
  type CellDiff,
  type LayerInfo,
  type BufferRenderOptions,
} from './buffer';
