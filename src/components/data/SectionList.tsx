/**
 * SectionList Component - React Native compatible sectioned list
 * Renders grouped data with section headers/footers
 */

import { createConsoleNode } from '../utils';
import type { ReactNode } from 'react';
import type { StyleProps } from '../../types';
import type { ViewStyle } from '../../types/styles';

/**
 * Default section type when no custom section data provided
 */
export interface DefaultSectionT {
  [key: string]: unknown;
}

/**
 * Section data structure
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Section<ItemT, _SectionT = DefaultSectionT> {
  /** Array of items in this section */
  data: ItemT[];
  /** Optional key for this section */
  key?: string;
  /** Additional section data */
  title?: string;
  /** Allow additional properties */
  [key: string]: unknown;
}

/**
 * Info passed to renderItem
 */
export interface SectionListRenderItemInfo<ItemT, SectionT = DefaultSectionT> {
  item: ItemT;
  index: number;
  section: Section<ItemT, SectionT>;
  separators: {
    highlight: () => void;
    unhighlight: () => void;
    updateProps: (select: 'leading' | 'trailing', newProps: object) => void;
  };
}

/**
 * Info passed to section header/footer render functions
 */
export interface SectionListRenderSectionInfo<ItemT, SectionT = DefaultSectionT> {
  section: Section<ItemT, SectionT>;
}

/**
 * SectionList Props - React Native compatible
 */
export interface SectionListProps<ItemT, SectionT = DefaultSectionT> extends StyleProps {
  /**
   * Array of sections, each with a data array
   * @required
   */
  sections: ReadonlyArray<Section<ItemT, SectionT>>;

  /**
   * Render function for each item
   * @required
   */
  renderItem: (info: SectionListRenderItemInfo<ItemT, SectionT>) => ReactNode;

  /**
   * Extract a unique key for each item
   */
  keyExtractor?: (item: ItemT, index: number) => string;

  // Section rendering
  /**
   * Render function for section headers
   */
  renderSectionHeader?: (info: SectionListRenderSectionInfo<ItemT, SectionT>) => ReactNode;

  /**
   * Render function for section footers
   */
  renderSectionFooter?: (info: SectionListRenderSectionInfo<ItemT, SectionT>) => ReactNode;

  // Structure components
  /**
   * Component to render at the top of the list
   */
  ListHeaderComponent?: ReactNode | (() => ReactNode);

  /**
   * Component to render at the bottom of the list
   */
  ListFooterComponent?: ReactNode | (() => ReactNode);

  /**
   * Component to render when list is empty
   */
  ListEmptyComponent?: ReactNode | (() => ReactNode);

  /**
   * Component to render between items within a section
   */
  ItemSeparatorComponent?: ReactNode | (() => ReactNode);

  /**
   * Component to render between sections
   */
  SectionSeparatorComponent?: ReactNode | (() => ReactNode);

  // Layout
  /**
   * Render items horizontally
   */
  horizontal?: boolean;

  /**
   * Reverse the order of items
   */
  inverted?: boolean;

  /**
   * Keep section headers stuck to the top when scrolling
   */
  stickySectionHeadersEnabled?: boolean;

  // Scroll behavior
  /**
   * Maximum visible height (enables scrolling)
   */
  maxHeight?: number;

  /**
   * Show vertical scroll indicator
   */
  showsVerticalScrollIndicator?: boolean;

  /**
   * Show horizontal scroll indicator
   */
  showsHorizontalScrollIndicator?: boolean;

  // Refresh
  /**
   * Whether currently refreshing
   */
  refreshing?: boolean;

  /**
   * Called when pull-to-refresh triggered
   */
  onRefresh?: () => void;

  // Scroll events
  /**
   * Called when scroll position changes
   */
  onScroll?: (event: { nativeEvent: { contentOffset: { x: number; y: number } } }) => void;

  /**
   * Called when end of list reached
   */
  onEndReached?: (info: { distanceFromEnd: number }) => void;

  /**
   * How far from end to trigger onEndReached (0-1)
   */
  onEndReachedThreshold?: number;

  // Terminal-specific
  /**
   * Allow keyboard selection of items
   */
  selectable?: boolean;

  /**
   * Currently selected section index
   */
  selectedSectionIndex?: number;

  /**
   * Currently selected item index within section
   */
  selectedItemIndex?: number;

  /**
   * Called when item is selected
   */
  onSelect?: (item: ItemT, itemIndex: number, sectionIndex: number) => void;

  /**
   * Style for selected item
   */
  selectedStyle?: ViewStyle;

  // Styling
  style?: ViewStyle | ViewStyle[];
  contentContainerStyle?: ViewStyle;
  className?: string | string[];
}

/**
 * SectionList Component
 *
 * Renders sectioned data with headers, footers, and separators.
 * Similar to React Native's SectionList but optimized for terminal.
 *
 * @example
 * ```tsx
 * const DATA = [
 *   {
 *     title: 'Main Dishes',
 *     data: ['Pizza', 'Burger', 'Pasta'],
 *   },
 *   {
 *     title: 'Desserts',
 *     data: ['Ice Cream', 'Cake'],
 *   },
 * ];
 *
 * <SectionList
 *   sections={DATA}
 *   keyExtractor={(item, index) => item + index}
 *   renderItem={({ item }) => <Text>{item}</Text>}
 *   renderSectionHeader={({ section }) => (
 *     <Text style={{ bold: true }}>{section.title}</Text>
 *   )}
 * />
 * ```
 */
export function SectionList<ItemT, SectionT = DefaultSectionT>({
  sections,
  renderItem,
  keyExtractor,
  renderSectionHeader,
  renderSectionFooter,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
  ItemSeparatorComponent,
  SectionSeparatorComponent,
  horizontal = false,
  inverted = false,
  stickySectionHeadersEnabled: _stickySectionHeadersEnabled = false,
  maxHeight,
  showsVerticalScrollIndicator = true,
  showsHorizontalScrollIndicator = false,
  refreshing: _refreshing = false,
  onRefresh: _onRefresh,
  onScroll,
  onEndReached: _onEndReached,
  onEndReachedThreshold: _onEndReachedThreshold = 0.5,
  selectable = false,
  selectedSectionIndex,
  selectedItemIndex,
  onSelect,
  selectedStyle,
  style,
  contentContainerStyle,
  className,
  ...otherProps
}: SectionListProps<ItemT, SectionT>): ReturnType<typeof createConsoleNode> {
  // Create separators helper (for item separators)
  const createSeparators = () => ({
    highlight: () => {},
    unhighlight: () => {},
    updateProps: (_select: 'leading' | 'trailing', _newProps: object) => {},
  });

  // Render a component that could be ReactNode or function
  const renderComponent = (component: ReactNode | (() => ReactNode) | undefined): ReactNode => {
    if (component === undefined || component === null) return null;
    if (typeof component === 'function') return component();
    return component;
  };

  // Check if all sections are empty
  const isEmpty = sections.length === 0 || sections.every((section) => section.data.length === 0);

  // Build children array
  const children: ReactNode[] = [];

  // List header
  const header = renderComponent(ListHeaderComponent);
  if (header) {
    children.push(createConsoleNode('box', { key: '__header__', children: header }));
  }

  // Empty component
  if (isEmpty) {
    const emptyComponent = renderComponent(ListEmptyComponent);
    if (emptyComponent) {
      children.push(createConsoleNode('box', { key: '__empty__', children: emptyComponent }));
    }
  } else {
    // Render sections
    const sectionsToRender = inverted ? [...sections].reverse() : sections;

    sectionsToRender.forEach((section, sectionIndex) => {
      const actualSectionIndex = inverted ? sections.length - 1 - sectionIndex : sectionIndex;
      const sectionKey = section.key ?? `section-${actualSectionIndex}`;

      // Section separator (between sections, not before first)
      if (sectionIndex > 0 && SectionSeparatorComponent) {
        const separator = renderComponent(SectionSeparatorComponent);
        if (separator) {
          children.push(
            createConsoleNode('box', { key: `${sectionKey}-separator-before`, children: separator })
          );
        }
      }

      // Section header
      if (renderSectionHeader) {
        const headerNode = renderSectionHeader({ section });
        if (headerNode) {
          children.push(
            createConsoleNode('box', {
              key: `${sectionKey}-header`,
              children: headerNode,
            })
          );
        }
      }

      // Section items
      const itemsToRender = inverted ? [...section.data].reverse() : section.data;

      itemsToRender.forEach((item, itemIndex) => {
        const actualItemIndex = inverted ? section.data.length - 1 - itemIndex : itemIndex;
        const itemKey = keyExtractor
          ? keyExtractor(item, actualItemIndex)
          : `${sectionKey}-item-${actualItemIndex}`;

        // Item separator (between items, not before first)
        if (itemIndex > 0 && ItemSeparatorComponent) {
          const separator = renderComponent(ItemSeparatorComponent);
          if (separator) {
            children.push(
              createConsoleNode('box', { key: `${itemKey}-separator`, children: separator })
            );
          }
        }

        // Determine if this item is selected
        const isSelected =
          selectable &&
          selectedSectionIndex === actualSectionIndex &&
          selectedItemIndex === actualItemIndex;

        // Item
        const itemNode = renderItem({
          item,
          index: actualItemIndex,
          section,
          separators: createSeparators(),
        });

        const itemStyle = isSelected && selectedStyle ? selectedStyle : undefined;

        children.push(
          createConsoleNode('box', {
            key: itemKey,
            style: itemStyle,
            tabIndex: selectable ? 0 : undefined,
            onPress:
              selectable && onSelect
                ? () => onSelect(item, actualItemIndex, actualSectionIndex)
                : undefined,
            children: itemNode,
          })
        );
      });

      // Section footer
      if (renderSectionFooter) {
        const footerNode = renderSectionFooter({ section });
        if (footerNode) {
          children.push(
            createConsoleNode('box', { key: `${sectionKey}-footer`, children: footerNode })
          );
        }
      }
    });
  }

  // List footer
  const footer = renderComponent(ListFooterComponent);
  if (footer) {
    children.push(createConsoleNode('box', { key: '__footer__', children: footer }));
  }

  // Flatten style array if needed
  const flattenStyle = (s: ViewStyle | ViewStyle[] | undefined): ViewStyle | undefined => {
    if (!s) return undefined;
    if (Array.isArray(s)) return Object.assign({}, ...s);
    return s;
  };

  // If maxHeight is specified, wrap in scrollview
  if (maxHeight !== undefined) {
    return createConsoleNode('scrollview', {
      ...otherProps,
      style: flattenStyle(style),
      contentContainerStyle,
      className,
      horizontal,
      maxHeight,
      showsVerticalScrollIndicator,
      showsHorizontalScrollIndicator,
      onScroll,
      children,
    });
  }

  // Otherwise, just a box with flex layout
  const baseStyle: ViewStyle = { flexDirection: horizontal ? 'row' : 'column' };
  const flatStyle = flattenStyle(style);
  const mergedStyle: ViewStyle = {
    ...baseStyle,
    ...flatStyle,
    ...contentContainerStyle,
  };

  return createConsoleNode('box', {
    ...otherProps,
    style: mergedStyle,
    className,
    children,
  });
}
