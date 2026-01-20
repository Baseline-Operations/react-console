/**
 * E2E tests for example applications
 * Tests that examples render correctly and produce expected output
 */

import { describe, it, expect } from 'vitest';
import { render, Text, View, Input, Button } from '../../index';

describe('Example Applications E2E', () => {
  describe('Basic rendering', () => {
    it('should render simple text component', () => {
      function App() {
        return <Text>Hello World</Text>;
      }

      const output = render(<App />, { mode: 'static' });
      expect(output).toContain('Hello World');
    });

    it('should render nested components', () => {
      function App() {
        return (
          <View>
            <Text>Parent</Text>
            <View>
              <Text>Child</Text>
            </View>
          </View>
        );
      }

      const output = render(<App />, { mode: 'static' });
      expect(output).toContain('Parent');
      expect(output).toContain('Child');
    });
  });

  describe('Styling', () => {
    it('should apply text styles', () => {
      function App() {
        return <Text style={{ color: 'red', bold: true }}>Styled Text</Text>;
      }

      const output = render(<App />, { mode: 'static' });
      expect(output).toContain('Styled Text');
      // Check for ANSI codes
      expect(output).toMatch(/\x1b\[/);
    });

    it('should apply layout styles', () => {
      function App() {
        return (
          <View style={{ padding: 2, border: 'single' }}>
            <Text>Padded and bordered</Text>
          </View>
        );
      }

      const output = render(<App />, { mode: 'static' });
      expect(output).toContain('Padded and bordered');
    });
  });

  describe('Interactive components', () => {
    it('should render input component', () => {
      function App() {
        return <Input placeholder="Enter text" />;
      }

      const output = render(<App />, { mode: 'static' });
      expect(output.length).toBeGreaterThan(0);
    });

    it('should render button component', () => {
      function App() {
        return <Button onClick={() => {}}>Click me</Button>;
      }

      const output = render(<App />, { mode: 'static' });
      expect(output).toContain('Click me');
    });
  });

  describe('Layout systems', () => {
    it('should render flexbox layout', () => {
      function App() {
        return (
          <View style={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
            <Text>Item 1</Text>
            <Text>Item 2</Text>
          </View>
        );
      }

      const output = render(<App />, { mode: 'static' });
      expect(output).toContain('Item 1');
      expect(output).toContain('Item 2');
    });

    it('should render grid layout', () => {
      function App() {
        return (
          <View style={{ display: 'grid', gridTemplateColumns: [1, 1], gap: 1 }}>
            <Text>Cell 1</Text>
            <Text>Cell 2</Text>
          </View>
        );
      }

      const output = render(<App />, { mode: 'static' });
      expect(output.length).toBeGreaterThan(0);
    });
  });
});
