/**
 * ScrollView Ref Example
 * Demonstrates programmatic scrolling using refs
 */

import React, { useRef, useState } from 'react';
import { render, View, Text, ScrollView, Button, Box } from '../src/index';
import type { ScrollViewRef } from '../src/index';

function ScrollViewRefExample() {
  const scrollRef = useRef<ScrollViewRef>(null);
  const [status, setStatus] = useState('');

  // Generate content items
  const items = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
    content: `This is the content for item number ${i + 1}`,
  }));

  const handleScrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    setStatus('Scrolled to top');
  };

  const handleScrollToMiddle = () => {
    scrollRef.current?.scrollTo({ y: 10, animated: true });
    setStatus('Scrolled to middle (y: 10)');
  };

  const handleScrollToEnd = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
    setStatus('Scrolled to end');
  };

  const handleScrollToOffset = (offset: number) => {
    scrollRef.current?.scrollTo({ y: offset, animated: true });
    setStatus(`Scrolled to offset ${offset}`);
  };

  const handleFlashIndicators = () => {
    scrollRef.current?.flashScrollIndicators();
    setStatus('Flashed scroll indicators');
  };

  return (
    <Box style={{ padding: 2 }}>
      <Text style={{ bold: true, marginBottom: 2 }}>ScrollView Ref Example</Text>

      {/* Control buttons */}
      <View style={{ marginBottom: 2 }}>
        <Text style={{ bold: true, marginBottom: 1 }}>Scroll Controls:</Text>
        <View style={{ flexDirection: 'row', gap: 1, flexWrap: 'wrap' }}>
          <Button onPress={handleScrollToTop}>Top</Button>
          <Button onPress={handleScrollToMiddle}>Middle</Button>
          <Button onPress={handleScrollToEnd}>End</Button>
          <Button onPress={() => handleScrollToOffset(5)}>Offset 5</Button>
          <Button onPress={() => handleScrollToOffset(15)}>Offset 15</Button>
          <Button onPress={handleFlashIndicators}>Flash</Button>
        </View>
      </View>

      {/* ScrollView with ref */}
      <View style={{ border: 'single', marginBottom: 2 }}>
        <ScrollView ref={scrollRef} maxHeight={10} showsVerticalScrollIndicator={true}>
          {items.map((item) => (
            <View key={item.id} style={{ padding: 1, borderBottom: 'single' }}>
              <Text style={{ bold: true }}>{item.title}</Text>
              <Text style={{ color: 'gray' }}>{item.content}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {status && (
        <View style={{ marginBottom: 1 }}>
          <Text style={{ color: 'cyan' }}>Last action: {status}</Text>
        </View>
      )}

      <Text style={{ color: 'gray' }}>
        Use arrow keys to scroll manually, or buttons for programmatic scrolling
      </Text>
    </Box>
  );
}

render(<ScrollViewRefExample />);
