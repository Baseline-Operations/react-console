/**
 * FlatList component - Performant list rendering (React Native compatible)
 * Terminal equivalent of React Native's FlatList component
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import type { StyleProps, ViewStyle } from '../../types';
import { createConsoleNode, mergeClassNameAndStyle } from '../utils';

/**
 * Info about the visible items in the list
 */
export interface ViewToken<T = unknown> {
  item: T;
  key: string;
  index: number | null;
  isViewable: boolean;
}

/**
 * Viewability config for determining which items are visible
 */
export interface ViewabilityConfig {
  /** Minimum percentage of item that must be visible (0-100) */
  viewAreaCoveragePercentThreshold?: number;
  /** Minimum percentage of item viewport that must be covered (0-100) */
  itemVisiblePercentThreshold?: number;
  /** Time to wait before firing viewability callbacks */
  waitForInteraction?: boolean;
  /** Minimum time item must be visible (ms) */
  minimumViewTime?: number;
}

/**
 * Scroll event data
 */
export interface ScrollEvent {
  nativeEvent: {
    contentOffset: { x: number; y: number };
    contentSize: { width: number; height: number };
    layoutMeasurement: { width: number; height: number };
  };
}

/**
 * List render item info
 */
export interface ListRenderItemInfo<T> {
  item: T;
  index: number;
  separators: {
    highlight: () => void;
    unhighlight: () => void;
    updateProps: (select: 'leading' | 'trailing', newProps: Record<string, unknown>) => void;
  };
}

/**
 * Props for the FlatList component (React Native compatible)
 */
export interface FlatListProps<T> extends StyleProps {
  /** Array of data to render */
  data: T[] | null | undefined;
  /** Render function for each item */
  renderItem: (info: ListRenderItemInfo<T>) => ReactNode;
  /** Extract key from item (defaults to item.key or index) */
  keyExtractor?: (item: T, index: number) => string;

  // List header and footer
  /** Component to render at the top of the list */
  ListHeaderComponent?: ReactNode | (() => ReactNode);
  /** Component to render at the bottom of the list */
  ListFooterComponent?: ReactNode | (() => ReactNode);
  /** Component to render when the list is empty */
  ListEmptyComponent?: ReactNode | (() => ReactNode);
  /** Component to render between items */
  ItemSeparatorComponent?: ReactNode | (() => ReactNode);

  // Scroll behavior
  /** Render list horizontally (default: false) */
  horizontal?: boolean;
  /** Invert scroll direction (for chat-like interfaces) */
  inverted?: boolean;
  /** Number of items to render initially */
  initialNumToRender?: number;
  /** Maximum number of items to render */
  maxToRenderPerBatch?: number;
  /** Window size multiplier for rendered items */
  windowSize?: number;
  /** Scroll to end when content size changes */
  maintainVisibleContentPosition?: {
    minIndexForVisible: number;
    autoscrollToTopThreshold?: number;
  };

  // Interaction
  /** Called when end of list is reached */
  onEndReached?: (info: { distanceFromEnd: number }) => void;
  /** How far from end before calling onEndReached (0-1) */
  onEndReachedThreshold?: number;
  /** Called when list is refreshed (pull to refresh) */
  onRefresh?: () => void;
  /** Whether the list is currently refreshing */
  refreshing?: boolean;
  /** Called on scroll */
  onScroll?: (event: ScrollEvent) => void;
  /** Called when scroll begins */
  onScrollBeginDrag?: (event: ScrollEvent) => void;
  /** Called when scroll ends */
  onScrollEndDrag?: (event: ScrollEvent) => void;
  /** Called when viewable items change */
  onViewableItemsChanged?: (info: {
    viewableItems: ViewToken<T>[];
    changed: ViewToken<T>[];
  }) => void;
  /** Viewability config */
  viewabilityConfig?: ViewabilityConfig;

  // Layout
  /** Fixed height of items (improves performance) */
  getItemLayout?: (
    data: T[] | null | undefined,
    index: number
  ) => {
    length: number;
    offset: number;
    index: number;
  };
  /** Number of columns (for grid layout) */
  numColumns?: number;
  /** Style for each column container (when numColumns > 1) */
  columnWrapperStyle?: ViewStyle;

  // Focus behavior
  /** Tab order */
  tabIndex?: number;
  /** Auto focus on mount */
  autoFocus?: boolean;
  /** Called when focus received */
  onFocus?: () => void;
  /** Called when focus lost */
  onBlur?: () => void;

  // Styling
  /** Content container style */
  contentContainerStyle?: ViewStyle;
  /** CSS-like style */
  style?: ViewStyle | ViewStyle[];
  /** Class names */
  className?: string | string[];

  // Terminal specific
  /** Maximum visible height (in lines) */
  maxHeight?: number;
  /** Show scroll indicators */
  showsVerticalScrollIndicator?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  /** Keyboard navigation enabled */
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
  /** Extra data to trigger re-render */
  extraData?: unknown;
}

// Default values
const DEFAULT_INITIAL_NUM_TO_RENDER = 10;
const DEFAULT_MAX_HEIGHT = 10;
const DEFAULT_END_REACHED_THRESHOLD = 0.5;

/**
 * FlatList component - Performant scrollable list
 *
 * Renders a scrollable list of data. Similar to React Native's FlatList,
 * it virtualizes items for performance when dealing with large lists.
 *
 * @param props - FlatList component props
 * @returns React element representing a scrollable list
 *
 * @example
 * ```tsx
 * const data = [
 *   { id: '1', title: 'Item 1' },
 *   { id: '2', title: 'Item 2' },
 *   { id: '3', title: 'Item 3' },
 * ];
 *
 * <FlatList
 *   data={data}
 *   renderItem={({ item }) => <Text>{item.title}</Text>}
 *   keyExtractor={(item) => item.id}
 *   maxHeight={5}
 * />
 *
 * // With header and footer
 * <FlatList
 *   data={data}
 *   renderItem={({ item }) => <Text>{item.title}</Text>}
 *   ListHeaderComponent={<Text bold>My List</Text>}
 *   ListFooterComponent={<Text dim>End of list</Text>}
 *   ListEmptyComponent={<Text>No items</Text>}
 * />
 * ```
 */
export function FlatList<T>({
  data,
  renderItem,
  keyExtractor,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
  ItemSeparatorComponent,
  horizontal = false,
  inverted = false,
  initialNumToRender: _initialNumToRender = DEFAULT_INITIAL_NUM_TO_RENDER,
  maxToRenderPerBatch: _maxToRenderPerBatch,
  windowSize: _windowSize = 21,
  maintainVisibleContentPosition: _maintainVisibleContentPosition,
  onEndReached,
  onEndReachedThreshold = DEFAULT_END_REACHED_THRESHOLD,
  onRefresh: _onRefresh,
  refreshing = false,
  onScroll,
  onScrollBeginDrag: _onScrollBeginDrag,
  onScrollEndDrag: _onScrollEndDrag,
  onViewableItemsChanged: _onViewableItemsChanged,
  viewabilityConfig: _viewabilityConfig,
  getItemLayout: _getItemLayout,
  numColumns: _numColumns = 1,
  columnWrapperStyle: _columnWrapperStyle,
  tabIndex,
  autoFocus,
  onFocus,
  onBlur,
  contentContainerStyle,
  className,
  style,
  maxHeight = DEFAULT_MAX_HEIGHT,
  showsVerticalScrollIndicator = true,
  showsHorizontalScrollIndicator = false,
  keyboardShouldPersistTaps,
  extraData: _extraData,
  ...styleProps
}: FlatListProps<T>): ReturnType<typeof createConsoleNode> {
  // State for scroll position
  const [scrollTop, setScrollTop] = useState(0);

  // Track if end reached callback has been fired
  const endReachedCalled = useRef(false);

  // Ensure data is an array
  const items = data ?? [];
  const isEmpty = items.length === 0;

  // Default key extractor
  const getKey = useCallback(
    (item: T, index: number): string => {
      if (keyExtractor) {
        return keyExtractor(item, index);
      }
      // Try to get key from item
      if (item && typeof item === 'object' && 'key' in item) {
        return String((item as { key: unknown }).key);
      }
      if (item && typeof item === 'object' && 'id' in item) {
        return String((item as { id: unknown }).id);
      }
      return String(index);
    },
    [keyExtractor]
  );

  // Calculate visible range
  const visibleCount = maxHeight;
  const startIndex = Math.max(0, scrollTop);
  const endIndex = Math.min(items.length, startIndex + visibleCount);

  // Apply inverted if needed
  const orderedItems = inverted ? [...items].reverse() : items;

  // Create separators object for renderItem
  const createSeparators = useCallback(
    (_index: number) => ({
      highlight: () => {},
      unhighlight: () => {},
      updateProps: (_select: 'leading' | 'trailing', _newProps: Record<string, unknown>) => {},
    }),
    []
  );

  // Handle scroll
  const handleScroll = useCallback(
    (newScrollTop: number) => {
      setScrollTop(newScrollTop);

      // Fire onScroll callback
      if (onScroll) {
        onScroll({
          nativeEvent: {
            contentOffset: { x: 0, y: newScrollTop },
            contentSize: { width: 0, height: items.length },
            layoutMeasurement: { width: 0, height: maxHeight },
          },
        });
      }

      // Check if we reached the end
      const distanceFromEnd = items.length - (newScrollTop + maxHeight);
      const threshold = Math.floor(items.length * onEndReachedThreshold);

      if (distanceFromEnd <= threshold && !endReachedCalled.current && onEndReached) {
        endReachedCalled.current = true;
        onEndReached({ distanceFromEnd });
      }
    },
    [items.length, maxHeight, onEndReachedThreshold, onEndReached, onScroll]
  );

  // Reset end reached flag when data changes
  useEffect(() => {
    endReachedCalled.current = false;
  }, [data]);

  // Merge styles
  const mergedStyle = mergeClassNameAndStyle(className, style, styleProps);

  // Build children
  const children: ReturnType<typeof createConsoleNode>[] = [];

  // Add header
  if (ListHeaderComponent) {
    const header =
      typeof ListHeaderComponent === 'function' ? ListHeaderComponent() : ListHeaderComponent;
    children.push(
      createConsoleNode('box', {
        children: header,
        key: '__header__',
      })
    );
  }

  // Add refreshing indicator
  if (refreshing) {
    children.push(
      createConsoleNode('text', {
        content: '⟳ Refreshing...',
        style: { color: 'cyan' },
        key: '__refreshing__',
      })
    );
  }

  // Add empty component or items
  if (isEmpty) {
    if (ListEmptyComponent) {
      const empty =
        typeof ListEmptyComponent === 'function' ? ListEmptyComponent() : ListEmptyComponent;
      children.push(
        createConsoleNode('box', {
          children: empty,
          key: '__empty__',
        })
      );
    }
  } else {
    // Render visible items
    const visibleItems = orderedItems.slice(startIndex, endIndex);

    visibleItems.forEach((item, visibleIndex) => {
      const actualIndex = inverted
        ? items.length - 1 - (startIndex + visibleIndex)
        : startIndex + visibleIndex;
      const key = getKey(item, actualIndex);

      // Render item
      const rendered = renderItem({
        item,
        index: actualIndex,
        separators: createSeparators(actualIndex),
      });

      children.push(
        createConsoleNode('box', {
          children: rendered,
          key,
        })
      );

      // Add separator between items
      if (ItemSeparatorComponent && visibleIndex < visibleItems.length - 1) {
        const separator =
          typeof ItemSeparatorComponent === 'function'
            ? ItemSeparatorComponent()
            : ItemSeparatorComponent;
        children.push(
          createConsoleNode('box', {
            children: separator,
            key: `__separator_${key}__`,
          })
        );
      }
    });
  }

  // Add footer
  if (ListFooterComponent) {
    const footer =
      typeof ListFooterComponent === 'function' ? ListFooterComponent() : ListFooterComponent;
    children.push(
      createConsoleNode('box', {
        children: footer,
        key: '__footer__',
      })
    );
  }

  return createConsoleNode('scrollview', {
    style: mergedStyle as ViewStyle,
    maxHeight,
    contentContainerStyle,
    horizontal,
    showsVerticalScrollIndicator,
    showsHorizontalScrollIndicator,
    scrollTop,
    onScroll: handleScroll,
    tabIndex,
    autoFocus,
    onFocus,
    onBlur,
    keyboardScrollEnabled: keyboardShouldPersistTaps !== 'never',
    children,
  });
}
