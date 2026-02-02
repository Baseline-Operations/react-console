/**
 * Unit tests for StyleSheet API
 */

import { describe, it, expect } from 'vitest';
import { StyleSheet } from '../../utils/StyleSheet';
import type { ViewStyle, TextStyle } from '../../types';

describe('StyleSheet', () => {
  describe('create', () => {
    it('should return styles object as-is', () => {
      const styles = {
        container: { padding: 2 } as ViewStyle,
        text: { color: 'red' } as TextStyle,
      };
      const result = StyleSheet.create(styles);
      expect(result).toBe(styles);
      expect(result.container).toBe(styles.container);
      expect(result.text).toBe(styles.text);
    });

    it('should preserve style properties', () => {
      const styles = StyleSheet.create({
        box: { padding: 2, border: 'single', backgroundColor: 'blue' } as ViewStyle,
        heading: { color: 'cyan', bold: true, underline: true } as TextStyle,
      });

      expect(styles.box.padding).toBe(2);
      expect(styles.box.border).toBe('single');
      expect(styles.box.backgroundColor).toBe('blue');
      expect(styles.heading.color).toBe('cyan');
      expect(styles.heading.bold).toBe(true);
      expect(styles.heading.underline).toBe(true);
    });

    it('should handle empty stylesheet', () => {
      const styles = StyleSheet.create({});
      expect(styles).toEqual({});
    });
  });

  describe('flatten', () => {
    it('should return null for empty array', () => {
      const result = StyleSheet.flatten([]);
      expect(result).toBeNull();
    });

    it('should return null for array with only falsy values', () => {
      const result = StyleSheet.flatten([false, null, undefined]);
      expect(result).toBeNull();
    });

    it('should return single style as-is', () => {
      const style = { color: 'red' } as TextStyle;
      const result = StyleSheet.flatten([style]);
      expect(result).toBe(style);
    });

    it('should merge multiple styles', () => {
      const base = { color: 'red', bold: true } as TextStyle;
      const override = { color: 'blue' } as TextStyle;
      const result = StyleSheet.flatten([base, override]);

      expect(result).toEqual({ color: 'blue', bold: true });
    });

    it('should filter out falsy values', () => {
      const base = { color: 'red' } as TextStyle;
      const override = { bold: true } as TextStyle;
      const result = StyleSheet.flatten([base, false, null, override, undefined]);

      expect(result).toEqual({ color: 'red', bold: true });
    });

    it('should merge ViewStyle properties', () => {
      const base = { padding: 1, border: 'single' } as ViewStyle;
      const override = { padding: 2, backgroundColor: 'blue' } as ViewStyle;
      const result = StyleSheet.flatten([base, override]);

      expect(result).toEqual({
        padding: 2,
        border: 'single',
        backgroundColor: 'blue',
      });
    });

    it('should handle later styles overriding earlier ones', () => {
      const style1 = { color: 'red', bold: true } as TextStyle;
      const style2 = { color: 'green' } as TextStyle;
      const style3 = { bold: false, underline: true } as TextStyle;
      const result = StyleSheet.flatten([style1, style2, style3]);

      expect(result).toEqual({
        color: 'green',
        bold: false,
        underline: true,
      });
    });

    it('should handle mixed ViewStyle and TextStyle', () => {
      const viewStyle = { padding: 2 } as ViewStyle;
      const textStyle = { color: 'red' } as TextStyle;
      const result = StyleSheet.flatten([viewStyle, textStyle]);

      expect(result).toEqual({
        padding: 2,
        color: 'red',
      });
    });
  });

  describe('compose', () => {
    it('should be an alias for flatten', () => {
      const style1 = { color: 'red' } as TextStyle;
      const style2 = { bold: true } as TextStyle;
      const flattenResult = StyleSheet.flatten([style1, style2]);
      const composeResult = StyleSheet.compose(style1, style2);

      expect(composeResult).toEqual(flattenResult);
    });

    it('should handle variadic arguments', () => {
      const base = { color: 'red' } as TextStyle;
      const variant = { bold: true } as TextStyle;
      const override = { color: 'blue' } as TextStyle;
      const result = StyleSheet.compose(base, variant, override);

      expect(result).toEqual({ color: 'blue', bold: true });
    });

    it('should filter out falsy values', () => {
      const base = { color: 'red' } as TextStyle;
      const conditional = false;
      const override = { bold: true } as TextStyle;
      const result = StyleSheet.compose(base, conditional, override);

      expect(result).toEqual({ color: 'red', bold: true });
    });

    it('should return null for all falsy values', () => {
      const result = StyleSheet.compose(false, null, undefined);
      expect(result).toBeNull();
    });
  });
});
