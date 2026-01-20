/**
 * className support for style libraries
 * Allows registering class names to style mappings (similar to Tailwind CSS)
 */

import type { ViewStyle, TextStyle } from '../types';

/**
 * Class name to style mapping
 */
export type ClassNameMapping = {
  [className: string]: ViewStyle | TextStyle;
};

/**
 * Class name registry
 */
class ClassNameRegistry {
  private mappings: ClassNameMapping = {};
  private responsivePrefixes: string[] = ['sm', 'md', 'lg', 'xl'];
  private pseudoPrefixes: string[] = ['hover', 'focus', 'disabled', 'active'];

  /**
   * Register class name mappings
   */
  register(mappings: ClassNameMapping): void {
    this.mappings = { ...this.mappings, ...mappings };
  }

  /**
   * Register a single class name
   */
  registerClass(className: string, style: ViewStyle | TextStyle): void {
    this.mappings[className] = style;
  }

  /**
   * Resolve class names to style object
   */
  resolve(classNames: string | string[] | undefined): ViewStyle | TextStyle | undefined {
    if (!classNames) {
      return undefined;
    }

    // Normalize to array
    const classes = Array.isArray(classNames)
      ? classNames
      : classNames.split(/\s+/).filter(Boolean);

    if (classes.length === 0) {
      return undefined;
    }

    // Merge all class styles
    let mergedStyle: ViewStyle | TextStyle = {};

    for (const className of classes) {
      // Handle responsive classes (e.g., "sm:text-red")
      const responsiveMatch = className.match(/^(\w+):(.+)$/);
      if (responsiveMatch) {
        const prefix = responsiveMatch[1];
        const baseClass = responsiveMatch[2];
        if (prefix && baseClass && this.responsivePrefixes.includes(prefix)) {
          // For now, just resolve the base class (responsive handling would need terminal size context)
          const baseStyle = this.mappings[baseClass];
          if (baseStyle) {
            mergedStyle = { ...mergedStyle, ...baseStyle };
          }
          continue;
        }
      }

      // Handle pseudo-classes (e.g., "hover:bg-red")
      const pseudoMatch = className.match(/^(\w+):(.+)$/);
      if (pseudoMatch) {
        const prefix = pseudoMatch[1];
        const baseClass = pseudoMatch[2];
        if (prefix && baseClass && this.pseudoPrefixes.includes(prefix)) {
          // Pseudo-classes are handled at component level (e.g., onFocus, onHover)
          // For now, just resolve the base class
          const baseStyle = this.mappings[baseClass];
          if (baseStyle) {
            mergedStyle = { ...mergedStyle, ...baseStyle };
          }
          continue;
        }
      }

      // Regular class name
      const style = this.mappings[className];
      if (style) {
        mergedStyle = { ...mergedStyle, ...style };
      }
    }

    return Object.keys(mergedStyle).length > 0 ? mergedStyle : undefined;
  }

  /**
   * Clear all registered class names
   */
  clear(): void {
    this.mappings = {};
  }

  /**
   * Get all registered class names
   */
  getAll(): string[] {
    return Object.keys(this.mappings);
  }
}

// Global registry instance
export const classNameRegistry = new ClassNameRegistry();

/**
 * Register class name mappings
 * 
 * @example
 * ```tsx
 * registerClassNames({
 *   'text-red': { color: 'red' },
 *   'bg-blue': { backgroundColor: 'blue' },
 *   'p-2': { padding: 2 },
 * });
 * ```
 */
export function registerClassNames(mappings: ClassNameMapping): void {
  classNameRegistry.register(mappings);
}

/**
 * Register a single class name
 */
export function registerClass(className: string, style: ViewStyle | TextStyle): void {
  classNameRegistry.registerClass(className, style);
}

/**
 * Resolve class names to style object
 * 
 * @example
 * ```tsx
 * const style = resolveClassName('text-red bg-blue p-2');
 * // Returns: { color: 'red', backgroundColor: 'blue', padding: 2 }
 * ```
 */
export function resolveClassName(
  classNames: string | string[] | undefined
): ViewStyle | TextStyle | undefined {
  return classNameRegistry.resolve(classNames);
}

/**
 * Merge className styles with inline style prop
 * Inline style takes precedence over className styles
 */
export function mergeClassNameWithStyle(
  className: string | string[] | undefined,
  inlineStyle?: ViewStyle | TextStyle | (ViewStyle | TextStyle)[]
): ViewStyle | TextStyle | undefined {
  const classNameStyle = resolveClassName(className);
  
  if (!classNameStyle && !inlineStyle) {
    return undefined;
  }
  
  if (!classNameStyle) {
    return Array.isArray(inlineStyle) 
      ? Object.assign({}, ...inlineStyle)
      : inlineStyle;
  }
  
  if (!inlineStyle) {
    return classNameStyle;
  }
  
  // Merge: inline style takes precedence
  const inline = Array.isArray(inlineStyle)
    ? Object.assign({}, ...inlineStyle)
    : inlineStyle;
  
  return { ...classNameStyle, ...inline };
}

/**
 * Create a style library helper for library authors
 */
export function createStyleLibrary(baseClasses?: ClassNameMapping) {
  if (baseClasses) {
    registerClassNames(baseClasses);
  }

  return {
    register: registerClassNames,
    registerClass,
    resolve: resolveClassName,
    clear: classNameRegistry.clear.bind(classNameRegistry),
    getAll: classNameRegistry.getAll.bind(classNameRegistry),
  };
}
