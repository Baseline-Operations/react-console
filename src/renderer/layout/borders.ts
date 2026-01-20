/**
 * Border rendering utilities
 */

import type { ConsoleNode, ViewStyle } from '../../types';
import type { OutputBuffer } from '../output';
import { applyStyles } from '../ansi';

/**
 * Get border information from node style
 */
export function getBorderInfo(
  _node: ConsoleNode,
  style: ViewStyle | undefined
): {
  show: { top: boolean; right: boolean; bottom: boolean; left: boolean };
  width: { top: number; right: number; bottom: number; left: number };
  style: ViewStyle['borderStyle'];
  color: ViewStyle['borderColor'];
} {
  const border = style?.border;
  const borderWidth = style?.borderWidth;
  const borderStyle = style?.borderStyle || 'single';
  const borderColor = style?.borderColor;

  // Determine which borders to show
  let show = { top: false, right: false, bottom: false, left: false };
  
  if (border === true) {
    show = { top: true, right: true, bottom: true, left: true };
  } else if (typeof border === 'object') {
    show = {
      top: border.top ?? false,
      right: border.right ?? false,
      bottom: border.bottom ?? false,
      left: border.left ?? false,
    };
  }

  // Determine border width
  let width = { top: 0, right: 0, bottom: 0, left: 0 };
  
  if (borderWidth) {
    if (typeof borderWidth === 'number') {
      width = { top: borderWidth, right: borderWidth, bottom: borderWidth, left: borderWidth };
    } else {
      width = {
        top: borderWidth.top ?? 0,
        right: borderWidth.right ?? 0,
        bottom: borderWidth.bottom ?? 0,
        left: borderWidth.left ?? 0,
      };
    }
  } else if (show.top || show.right || show.bottom || show.left) {
    // Default width is 1 if border is enabled but width not specified
    width = { top: 1, right: 1, bottom: 1, left: 1 };
  }

  return { show, width, style: borderStyle, color: borderColor };
}

/**
 * Get border characters based on style
 */
export function getBorderChars(style: ViewStyle['borderStyle'] = 'single'): {
  horizontal: string;
  vertical: string;
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
  // T-junction characters for better corner handling
  topT: string;
  bottomT: string;
  leftT: string;
  rightT: string;
  // Cross junction
  cross: string;
} {
  switch (style) {
    case 'double':
      return {
        horizontal: '═',
        vertical: '║',
        topLeft: '╔',
        topRight: '╗',
        bottomLeft: '╚',
        bottomRight: '╝',
        topT: '╦',
        bottomT: '╩',
        leftT: '╠',
        rightT: '╣',
        cross: '╬',
      };
    case 'thick':
      return {
        horizontal: '━',
        vertical: '┃',
        topLeft: '┏',
        topRight: '┓',
        bottomLeft: '┗',
        bottomRight: '┛',
        topT: '┳',
        bottomT: '┻',
        leftT: '┣',
        rightT: '┫',
        cross: '╋',
      };
    case 'dashed':
      return {
        horizontal: '┄',
        vertical: '┊',
        topLeft: '┌',
        topRight: '┐',
        bottomLeft: '└',
        bottomRight: '┘',
        topT: '┬',
        bottomT: '┴',
        leftT: '├',
        rightT: '┤',
        cross: '┼',
      };
    case 'dotted':
      return {
        horizontal: '┈',
        vertical: '┊',
        topLeft: '┌',
        topRight: '┐',
        bottomLeft: '└',
        bottomRight: '┘',
        topT: '┬',
        bottomT: '┴',
        leftT: '├',
        rightT: '┤',
        cross: '┼',
      };
    case 'single':
    default:
      return {
        horizontal: '─',
        vertical: '│',
        topLeft: '┌',
        topRight: '┐',
        bottomLeft: '└',
        bottomRight: '┘',
        topT: '┬',
        bottomT: '┴',
        leftT: '├',
        rightT: '┤',
        cross: '┼',
      };
  }
}

/**
 * Get corner character based on adjacent borders
 * This improves corner handling when borders meet
 */
export function getCornerChar(
  chars: ReturnType<typeof getBorderChars>,
  hasTop: boolean,
  hasRight: boolean,
  hasBottom: boolean,
  hasLeft: boolean,
  borderRadius?: number
): string {
  // Border radius support (limited - uses rounded corners if available)
  if (borderRadius && borderRadius > 0) {
    // For small radius, use standard corners
    // For larger radius, could use different characters, but terminal support is limited
    // For now, just use standard corners
  }

  // Determine corner character based on adjacent borders
  const top = hasTop;
  const right = hasRight;
  const bottom = hasBottom;
  const left = hasLeft;

  // Count adjacent borders
  const adjacentCount = [top, right, bottom, left].filter(Boolean).length;

  if (adjacentCount === 0) {
    return ' '; // No borders
  } else if (adjacentCount === 1) {
    // Single border - use appropriate end character
    if (top) return chars.bottomLeft;
    if (right) return chars.topLeft;
    if (bottom) return chars.topLeft;
    if (left) return chars.topRight;
  } else if (adjacentCount === 2) {
    // Two borders meeting
    if (top && right) return chars.topLeft;
    if (top && bottom) return chars.leftT;
    if (top && left) return chars.topRight;
    if (right && bottom) return chars.bottomLeft;
    if (right && left) return chars.topT;
    if (bottom && left) return chars.bottomRight;
  } else if (adjacentCount === 3) {
    // Three borders meeting - use T-junction
    if (!top) return chars.topT;
    if (!right) return chars.rightT;
    if (!bottom) return chars.bottomT;
    if (!left) return chars.leftT;
  } else {
    // All four borders - use cross junction
    return chars.cross;
  }

  // Default fallback
  return chars.topLeft;
}

/**
 * Render a border line (top or bottom) with improved corner handling
 */
export function renderBorderLine(
  buffer: OutputBuffer,
  x: number,
  y: number,
  width: number,
  side: 'top' | 'bottom',
  style: ViewStyle | undefined,
  adjacentBorders?: { top?: boolean; right?: boolean; bottom?: boolean; left?: boolean }
): void {
  const borderInfo = getBorderInfo({ type: 'box', style } as ConsoleNode, style);
  const chars = getBorderChars(borderInfo.style);
  const borderColor = borderInfo.color;
  const borderRadius = style?.borderRadius;
  
  // Check for existing characters at corners (for nested borders)
  const checkChar = (checkX: number, checkY: number): string => {
    if (buffer.lines[checkY] && buffer.lines[checkY]![checkX]) {
      return buffer.lines[checkY]![checkX]!;
    }
    return ' ';
  };
  
  let leftCorner: string;
  let rightCorner: string;
  
  if (side === 'top') {
    // Check for adjacent borders or existing characters
    const hasLeft = borderInfo.show.left || adjacentBorders?.left || false;
    const hasRight = borderInfo.show.right || adjacentBorders?.right || false;
    const hasTop = adjacentBorders?.top || false;
    const hasBottom = borderInfo.show.bottom || false;
    
    // Check if corners already have border characters (nested borders)
    const leftChar = checkChar(x, y);
    const rightChar = checkChar(x + width - 1, y);
    const isLeftCorner = leftChar !== ' ' && leftChar !== chars.horizontal;
    const isRightCorner = rightChar !== ' ' && rightChar !== chars.horizontal;
    
    if (isLeftCorner) {
      leftCorner = leftChar; // Preserve existing corner
    } else {
      leftCorner = getCornerChar(chars, hasTop, hasRight, hasBottom, hasLeft, borderRadius);
    }
    
    if (isRightCorner) {
      rightCorner = rightChar; // Preserve existing corner
    } else {
      rightCorner = getCornerChar(chars, hasTop, hasRight, hasBottom, hasLeft, borderRadius);
    }
    
    // If left corner is a T-junction, use appropriate character
    if (hasLeft && !isLeftCorner) {
      leftCorner = chars.leftT;
    } else if (!hasLeft && !isLeftCorner) {
      leftCorner = chars.topLeft;
    }
    
    // If right corner is a T-junction, use appropriate character
    if (hasRight && !isRightCorner) {
      rightCorner = chars.rightT;
    } else if (!hasRight && !isRightCorner) {
      rightCorner = chars.topRight;
    }
  } else {
    // Bottom border
    const hasLeft = borderInfo.show.left || adjacentBorders?.left || false;
    const hasRight = borderInfo.show.right || adjacentBorders?.right || false;
    const hasTop = borderInfo.show.top || false;
    const hasBottom = adjacentBorders?.bottom || false;
    
    // Check if corners already have border characters (nested borders)
    const leftChar = checkChar(x, y);
    const rightChar = checkChar(x + width - 1, y);
    const isLeftCorner = leftChar !== ' ' && leftChar !== chars.horizontal;
    const isRightCorner = rightChar !== ' ' && rightChar !== chars.horizontal;
    
    if (isLeftCorner) {
      leftCorner = leftChar; // Preserve existing corner
    } else {
      leftCorner = getCornerChar(chars, hasTop, hasRight, hasBottom, hasLeft, borderRadius);
    }
    
    if (isRightCorner) {
      rightCorner = rightChar; // Preserve existing corner
    } else {
      rightCorner = getCornerChar(chars, hasTop, hasRight, hasBottom, hasLeft, borderRadius);
    }
    
    // If left corner is a T-junction, use appropriate character
    if (hasLeft && !isLeftCorner) {
      leftCorner = chars.leftT;
    } else if (!hasLeft && !isLeftCorner) {
      leftCorner = chars.bottomLeft;
    }
    
    // If right corner is a T-junction, use appropriate character
    if (hasRight && !isRightCorner) {
      rightCorner = chars.rightT;
    } else if (!hasRight && !isRightCorner) {
      rightCorner = chars.bottomRight;
    }
  }
  
  const line = leftCorner + chars.horizontal.repeat(Math.max(0, width - 2)) + rightCorner;

  // Apply border color if specified
  let styledLine = line;
  if (borderColor) {
    styledLine = applyStyles(line, { color: borderColor });
  }

  while (buffer.lines.length <= y) {
    buffer.lines.push('');
  }
  const currentLine = buffer.lines[y] || '';
  buffer.lines[y] = currentLine.padEnd(x) + styledLine;
}

/**
 * Render a border character (left or right side) with improved corner handling
 */
export function renderBorderChar(
  buffer: OutputBuffer,
  x: number,
  y: number,
  _side: 'left' | 'right',
  style: ViewStyle | undefined,
  adjacentBorders?: { top?: boolean; right?: boolean; bottom?: boolean; left?: boolean }
): void {
  const borderInfo = getBorderInfo({ type: 'box', style } as ConsoleNode, style);
  const chars = getBorderChars(borderInfo.style);
  const borderColor = borderInfo.color;
  
  // Check for existing character (for nested borders)
  const checkChar = (checkX: number, checkY: number): string => {
    if (buffer.lines[checkY] && buffer.lines[checkY]![checkX]) {
      return buffer.lines[checkY]![checkX]!;
    }
    return ' ';
  };
  
  const existingChar = checkChar(x, y);
  const isCorner = existingChar !== ' ' && existingChar !== chars.vertical && existingChar !== chars.horizontal;
  
  let char = chars.vertical;
  
  // If there's an existing corner or junction, preserve it
  if (isCorner) {
    char = existingChar;
  } else {
    // Check if this is a T-junction
    const hasTop = borderInfo.show.top || adjacentBorders?.top || false;
    const hasBottom = borderInfo.show.bottom || adjacentBorders?.bottom || false;
    
    if (hasTop && hasBottom) {
      // Both top and bottom borders - use vertical line
      char = chars.vertical;
    } else if (hasTop) {
      // Only top border - could be bottom T
      char = chars.bottomT;
    } else if (hasBottom) {
      // Only bottom border - could be top T
      char = chars.topT;
    }
    // Otherwise use standard vertical line
  }
  
  let styledChar = char;
  
  // Apply border color if specified
  if (borderColor) {
    styledChar = applyStyles(char, { color: borderColor });
  }

  while (buffer.lines.length <= y) {
    buffer.lines.push('');
  }
  const currentLine = buffer.lines[y] || '';
  const before = currentLine.slice(0, x);
  const after = currentLine.slice(x + 1);
  buffer.lines[y] = before + styledChar + after;
}
