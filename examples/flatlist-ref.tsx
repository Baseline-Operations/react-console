/**
 * FlatList Ref Example
 * Demonstrates programmatic list control using refs
 */

import React, { useRef, useState } from 'react';
import { render, View, Text, FlatList, Button, Box, TextInput } from '../src/index';
import type { FlatListRef } from '../src/index';

interface Item {
  id: string;
  name: string;
  category: string;
}

const DATA: Item[] = Array.from({ length: 25 }, (_, i) => ({
  id: `item-${i + 1}`,
  name: `Item ${i + 1}`,
  category: i % 3 === 0 ? 'Category A' : i % 3 === 1 ? 'Category B' : 'Category C',
}));

function FlatListRefExample() {
  const listRef = useRef<FlatListRef<Item>>(null);
  const [status, setStatus] = useState('');
  const [indexInput, setIndexInput] = useState('0');

  const handleScrollToIndex = () => {
    const index = parseInt(indexInput, 10);
    if (!isNaN(index) && index >= 0 && index < DATA.length) {
      listRef.current?.scrollToIndex({ index, animated: true });
      setStatus(`Scrolled to index ${index}`);
    } else {
      setStatus(`Invalid index: ${indexInput}`);
    }
  };

  const handleScrollToOffset = (offset: number) => {
    listRef.current?.scrollToOffset({ offset, animated: true });
    setStatus(`Scrolled to offset ${offset}`);
  };

  const handleScrollToEnd = () => {
    listRef.current?.scrollToEnd({ animated: true });
    setStatus('Scrolled to end');
  };

  const handleScrollToItem = (item: Item) => {
    listRef.current?.scrollToItem({ item, animated: true });
    setStatus(`Scrolled to ${item.name}`);
  };

  const handleRecordInteraction = () => {
    listRef.current?.recordInteraction();
    setStatus('Recorded interaction');
  };

  const handleFlashIndicators = () => {
    listRef.current?.flashScrollIndicators();
    setStatus('Flashed scroll indicators');
  };

  return (
    <Box style={{ padding: 2 }}>
      <Text style={{ bold: true, marginBottom: 2 }}>FlatList Ref Example</Text>

      {/* Index input and scroll controls */}
      <View style={{ marginBottom: 2 }}>
        <Text style={{ bold: true, marginBottom: 1 }}>Scroll to Index:</Text>
        <View style={{ flexDirection: 'row', gap: 1, alignItems: 'center' }}>
          <TextInput
            value={indexInput}
            onChangeText={setIndexInput}
            keyboardType="numeric"
            style={{ width: 8, border: 'single', padding: 1 }}
            placeholder="0"
          />
          <Button onPress={handleScrollToIndex}>Go</Button>
          <Text style={{ color: 'gray' }}>(0-{DATA.length - 1})</Text>
        </View>
      </View>

      {/* Quick scroll buttons */}
      <View style={{ marginBottom: 2 }}>
        <Text style={{ bold: true, marginBottom: 1 }}>Quick Actions:</Text>
        <View style={{ flexDirection: 'row', gap: 1, flexWrap: 'wrap' }}>
          <Button onPress={() => handleScrollToOffset(0)}>Top</Button>
          <Button onPress={() => handleScrollToOffset(10)}>Offset 10</Button>
          <Button onPress={handleScrollToEnd}>End</Button>
          <Button onPress={() => handleScrollToItem(DATA[12]!)}>Item 13</Button>
          <Button onPress={handleRecordInteraction}>Record</Button>
          <Button onPress={handleFlashIndicators}>Flash</Button>
        </View>
      </View>

      {/* FlatList with ref */}
      <View style={{ border: 'single', marginBottom: 2 }}>
        <FlatList<Item>
          ref={listRef}
          data={DATA}
          maxHeight={8}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View
              style={{
                padding: 1,
                flexDirection: 'row',
                borderBottom: 'single',
              }}
            >
              <Text style={{ width: 4, color: 'gray' }}>{index}.</Text>
              <Text style={{ flex: 1 }}>{item.name}</Text>
              <Text style={{ color: 'cyan' }}>{item.category}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={true}
        />
      </View>

      {status && (
        <View style={{ marginBottom: 1 }}>
          <Text style={{ color: 'green' }}>Last action: {status}</Text>
        </View>
      )}

      <Text style={{ color: 'gray' }}>
        Enter an index (0-{DATA.length - 1}) and press Go, or use quick action buttons
      </Text>
    </Box>
  );
}

render(<FlatListRefExample />);
