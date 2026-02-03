/**
 * Ref interfaces for component imperative handles
 * React Native compatible ref APIs for terminal components
 */

/**
 * TextInput ref interface (React Native compatible)
 * Allows imperative control of text input
 */
export interface TextInputRef {
  /** Focus the input */
  focus(): void;
  /** Remove focus from the input */
  blur(): void;
  /** Clear the input value */
  clear(): void;
  /** Check if the input is focused */
  isFocused(): boolean;
  /** Set native props (limited support in terminal) */
  setNativeProps?(props: Record<string, unknown>): void;
}

/**
 * ScrollView ref interface (React Native compatible)
 * Allows imperative control of scroll view
 */
export interface ScrollViewRef {
  /** Scroll to a specific position */
  scrollTo(options: { x?: number; y?: number; animated?: boolean }): void;
  /** Scroll to the end of the content */
  scrollToEnd(options?: { animated?: boolean }): void;
  /** Flash the scroll indicators briefly */
  flashScrollIndicators(): void;
  /** Get scroll responder (for advanced usage) */
  getScrollResponder?(): unknown;
  /** Get inner view ref */
  getInnerViewRef?(): unknown;
  /** Get inner view node */
  getInnerViewNode?(): unknown;
  /** Get scroll node */
  getScrollableNode?(): unknown;
  /** Set native props (limited support in terminal) */
  setNativeProps?(props: Record<string, unknown>): void;
}

/**
 * FlatList ref interface (React Native compatible)
 * Allows imperative control of flat list
 */
export interface FlatListRef<T = unknown> {
  /** Scroll to a specific index */
  scrollToIndex(params: {
    index: number;
    animated?: boolean;
    viewOffset?: number;
    viewPosition?: number;
  }): void;
  /** Scroll to a specific item */
  scrollToItem(params: {
    item: T;
    animated?: boolean;
    viewOffset?: number;
    viewPosition?: number;
  }): void;
  /** Scroll to a specific offset */
  scrollToOffset(params: { offset: number; animated?: boolean }): void;
  /** Scroll to the end */
  scrollToEnd(params?: { animated?: boolean }): void;
  /** Record that user has interacted (for viewability) */
  recordInteraction(): void;
  /** Flash the scroll indicators briefly */
  flashScrollIndicators(): void;
  /** Get native scroll ref */
  getNativeScrollRef?(): ScrollViewRef | null;
  /** Get scrollable node */
  getScrollableNode?(): unknown;
  /** Get scroll responder */
  getScrollResponder?(): unknown;
  /** Set native props (limited support in terminal) */
  setNativeProps?(props: Record<string, unknown>): void;
}

/**
 * SectionList ref interface (React Native compatible)
 * Similar to FlatList ref
 * @template ItemT - The type of items in the section list (for future use)
 */
export interface SectionListRef<ItemT = unknown> {
  /** @internal Type marker for the generic parameter */
  readonly __itemType?: ItemT;
  /** Scroll to a specific location */
  scrollToLocation(params: {
    sectionIndex: number;
    itemIndex: number;
    animated?: boolean;
    viewOffset?: number;
    viewPosition?: number;
  }): void;
  /** Record interaction */
  recordInteraction(): void;
  /** Flash indicators */
  flashScrollIndicators(): void;
  /** Get native scroll ref */
  getNativeScrollRef?(): ScrollViewRef | null;
  /** Get scrollable node */
  getScrollableNode?(): unknown;
}

/**
 * View ref interface (React Native compatible)
 */
export interface ViewRef {
  /** Measure the view layout */
  measure(
    callback: (
      x: number,
      y: number,
      width: number,
      height: number,
      pageX: number,
      pageY: number
    ) => void
  ): void;
  /** Measure view layout in window */
  measureInWindow(callback: (x: number, y: number, width: number, height: number) => void): void;
  /** Measure layout relative to ancestor */
  measureLayout(
    relativeToNativeNode: unknown,
    onSuccess: (left: number, top: number, width: number, height: number) => void,
    onFail?: () => void
  ): void;
  /** Focus the view */
  focus(): void;
  /** Blur the view */
  blur(): void;
  /** Set native props (limited support in terminal) */
  setNativeProps?(props: Record<string, unknown>): void;
}

/**
 * Pressable ref interface (React Native compatible)
 */
export interface PressableRef extends ViewRef {
  /** Type brand for Pressable (inherits all View methods) */
  readonly __pressableRef?: true;
}

/**
 * Button ref interface (React Native compatible)
 */
export interface ButtonRef {
  /** Focus the button */
  focus(): void;
  /** Blur the button */
  blur(): void;
}

/**
 * Create a TextInput ref object
 * @param node - The underlying node/element
 */
export function createTextInputRef(node: {
  focus?: () => void;
  blur?: () => void;
  setValue?: (value: string) => void;
  getValue?: () => string;
  focused?: boolean;
}): TextInputRef {
  return {
    focus() {
      node.focus?.();
    },
    blur() {
      node.blur?.();
    },
    clear() {
      node.setValue?.('');
    },
    isFocused() {
      return node.focused ?? false;
    },
  };
}

/**
 * Create a ScrollView ref object
 * @param node - The underlying node/element
 */
export function createScrollViewRef(node: {
  scrollTo?: (options: { x?: number; y?: number }) => void;
  scrollTop?: number;
  setScrollTop?: (value: number) => void;
  contentHeight?: number;
  height?: number;
}): ScrollViewRef {
  return {
    scrollTo({ x, y, animated: _animated }) {
      if (node.scrollTo) {
        node.scrollTo({ x, y });
      } else if (node.setScrollTop && y !== undefined) {
        node.setScrollTop(y);
      }
    },
    scrollToEnd({ animated: _animated } = {}) {
      const contentHeight = node.contentHeight ?? 0;
      const viewHeight = node.height ?? 0;
      const maxScroll = Math.max(0, contentHeight - viewHeight);
      if (node.setScrollTop) {
        node.setScrollTop(maxScroll);
      }
    },
    flashScrollIndicators() {
      // Terminal doesn't support flashing indicators
      // Could implement a brief visual feedback in the future
    },
  };
}

/**
 * Create a FlatList ref object
 * @param node - The underlying node/element
 * @param data - The list data
 */
export function createFlatListRef<T>(
  node: {
    scrollTo?: (options: { x?: number; y?: number }) => void;
    scrollTop?: number;
    setScrollTop?: (value: number) => void;
    contentHeight?: number;
    height?: number;
  },
  data: T[]
): FlatListRef<T> {
  const scrollViewRef = createScrollViewRef(node);

  return {
    scrollToIndex({ index, animated, viewOffset = 0, viewPosition: _viewPosition = 0 }) {
      // Simple implementation: assume each item is 1 line
      const offset = Math.max(0, index + viewOffset);
      scrollViewRef.scrollTo({ y: offset, animated });
    },
    scrollToItem({ item, animated, viewOffset = 0, viewPosition = 0 }) {
      const index = data.indexOf(item);
      if (index >= 0) {
        this.scrollToIndex({ index, animated, viewOffset, viewPosition });
      }
    },
    scrollToOffset({ offset, animated }) {
      scrollViewRef.scrollTo({ y: offset, animated });
    },
    scrollToEnd(params) {
      scrollViewRef.scrollToEnd(params);
    },
    recordInteraction() {
      // Could be used for analytics or viewability tracking
    },
    flashScrollIndicators() {
      scrollViewRef.flashScrollIndicators();
    },
  };
}
