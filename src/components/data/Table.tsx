/**
 * Table component - Display tabular data with headers, rows, and styling
 *
 * Note: This is a simplified version. For full table rendering, the component
 * needs custom renderer support or should build the table structure as children.
 */

import type { ReactNode } from 'react';
import type { ComponentEventHandlers, StyleProps, ViewStyle } from '../../types';
import { createConsoleNode, mergeClassNameAndStyle } from '../utils';

export interface TableColumn<T = unknown> {
  key: string;
  header?: string | ReactNode;
  accessor?: (row: T) => string | number | ReactNode;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: unknown, row: T, index: number) => ReactNode;
}

export interface TableProps<T = unknown> extends ComponentEventHandlers, StyleProps {
  data: T[];
  columns: TableColumn<T>[];
  style?: ViewStyle | ViewStyle[]; // CSS-like style (similar to React Native)
  header?: boolean;
  footer?: ReactNode;
  border?: 'single' | 'double' | 'thick' | 'dashed' | 'dotted' | false;
  zebra?: boolean;
  sortable?: boolean;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (columnKey: string, direction: 'asc' | 'desc') => void;
  maxHeight?: number;
  emptyMessage?: string;
  children?: ReactNode; // For custom row rendering
}

/**
 * Table component - Display tabular data
 *
 * Renders a table with headers, rows, and optional sorting, borders, and zebra striping.
 *
 * @param props - Table component props
 * @returns React element representing a table
 *
 * @example
 * ```tsx
 * const data = [
 *   { id: 1, name: 'John', age: 30 },
 *   { id: 2, name: 'Jane', age: 25 },
 * ];
 *
 * const columns = [
 *   { key: 'name', header: 'Name', accessor: (row) => row.name },
 *   { key: 'age', header: 'Age', accessor: (row) => row.age, align: 'right' },
 * ];
 *
 * <Table data={data} columns={columns} border="single" />
 * ```
 */
export function Table<T = unknown>({
  data,
  columns,
  header = true,
  footer,
  border = 'single',
  zebra = false,
  sortable = false,
  sortBy,
  sortDirection = 'asc',
  onSort,
  maxHeight,
  emptyMessage = 'No data',
  children,
  className,
  style: tableStyle,
  ...styleProps
}: TableProps<T>): ReturnType<typeof createConsoleNode> {
  // Merge className with style prop and legacy style props
  const mergedStyle = mergeClassNameAndStyle(className, tableStyle, styleProps) as ViewStyle;

  // Store table data and config in node properties for renderer to use
  // The actual table rendering will be done in a custom renderer function
  return createConsoleNode('box', {
    style: {
      ...mergedStyle,
      border: border || undefined,
    } as ViewStyle,
    children: children || undefined,
    // Store table-specific data in node properties for renderer
    // Note: Custom renderer support needed for full table rendering
    tableData: data as unknown,
    tableColumns: columns as unknown,
    tableHeader: header,
    tableFooter: footer,
    tableBorder: border,
    tableZebra: zebra,
    tableSortable: sortable,
    tableSortBy: sortBy,
    tableSortDirection: sortDirection,
    tableMaxHeight: maxHeight,
    tableEmptyMessage: emptyMessage,
    tableOnSort: onSort as unknown,
  });
}
