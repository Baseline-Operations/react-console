/**
 * Text transform, inline styling (nested Text), Link, and Code components
 */

import React from 'react';
import { render, Text, View, Link, Code, LineBreak } from '../src/index';

function App() {
  return (
    <View padding={1}>
      <Text color="cyan" bold>
        Text transform
      </Text>
      <Text textTransform="uppercase">uppercase text</Text>
      <Text textTransform="lowercase">LOWERCASE TEXT</Text>
      <Text textTransform="capitalize">capitalize each word</Text>

      <LineBreak />
      <Text color="cyan" bold>
        Inline styling (nested Text)
      </Text>
      <Text>
        Normal text with{' '}
        <Text bold color="yellow">
          bold yellow
        </Text>{' '}
        and{' '}
        <Text dim underline>
          dim underline
        </Text>{' '}
        inline.
      </Text>

      <LineBreak />
      <Text color="cyan" bold>
        Link (opens in default browser)
      </Text>
      <Text dim>
        Tab to focus a link, then press Enter to open (works in all terminals, including macOS
        Terminal).
      </Text>
      <Text>
        Open <Link href="https://github.com">GitHub</Link> or{' '}
        <Link href="https://example.com" color="green" underline>
          Example
        </Link>
        .
      </Text>

      <LineBreak />
      <Text color="cyan" bold>
        Code (inline and block)
      </Text>
      <Text>
        Run <Code>npm install</Code> then <Code>npm run build</Code>.
      </Text>
      <Code block>{`const x = 1;
console.log(x);`}</Code>
      <Text>
        File: <Code backgroundColor="blue">src/index.ts</Code>
      </Text>

      <LineBreak />
      <Text dim>Press Ctrl+C to exit.</Text>
    </View>
  );
}

render(<App />);
