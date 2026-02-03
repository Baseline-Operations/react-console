/**
 * FlatList Component Example
 * Demonstrates the React Native compatible FlatList component
 */

import React, { useState } from 'react';
import { render, View, Text, FlatList, Box } from '../src/index';

interface Item {
  id: string;
  title: string;
  description: string;
}

const DATA: Item[] = [
  { id: '1', title: 'First Item', description: 'This is the first item' },
  { id: '2', title: 'Second Item', description: 'This is the second item' },
  { id: '3', title: 'Third Item', description: 'This is the third item' },
  { id: '4', title: 'Fourth Item', description: 'This is the fourth item' },
  { id: '5', title: 'Fifth Item', description: 'This is the fifth item' },
  { id: '6', title: 'Sixth Item', description: 'This is the sixth item' },
  { id: '7', title: 'Seventh Item', description: 'This is the seventh item' },
  { id: '8', title: 'Eighth Item', description: 'This is the eighth item' },
];

function FlatListExample() {
  const [selectedId] = useState<string | null>(null);

  return (
    <Box style={{ padding: 2 }}>
      <Text style={{ bold: true, marginBottom: 1 }}>FlatList Component Example</Text>

      <FlatList<Item>
        data={DATA}
        keyExtractor={(item) => item.id}
        maxHeight={10}
        renderItem={({ item, index }) => (
          <View
            style={{
              padding: 1,
              backgroundColor: selectedId === item.id ? 'blue' : undefined,
            }}
          >
            <Text style={{ bold: true }}>
              {index + 1}. {item.title}
            </Text>
            <Text style={{ color: 'gray' }}>{item.description}</Text>
          </View>
        )}
        ListHeaderComponent={
          <View style={{ borderBottom: 'single', paddingBottom: 1, marginBottom: 1 }}>
            <Text style={{ color: 'cyan' }}>Available Items:</Text>
          </View>
        }
        ListFooterComponent={
          <View style={{ borderTop: 'single', paddingTop: 1, marginTop: 1 }}>
            <Text style={{ color: 'gray' }}>End of list ({DATA.length} items)</Text>
          </View>
        }
        ItemSeparatorComponent={
          <View style={{ height: 1 }}>
            <Text style={{ color: 'gray' }}>───────────────────</Text>
          </View>
        }
        onEndReached={() => {
          console.log('Reached end of list');
        }}
        onEndReachedThreshold={0.5}
      />

      <Text style={{ marginTop: 2, color: 'cyan' }}>
        Use arrow keys to scroll, maxHeight limits visible items
      </Text>
    </Box>
  );
}

render(<FlatListExample />);
