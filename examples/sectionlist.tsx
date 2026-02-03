/**
 * SectionList Component Example
 * Demonstrates the React Native compatible SectionList component
 */

import React from 'react';
import { render, View, Text, SectionList, Box } from '../src/index';

interface FoodItem {
  name: string;
  price: number;
}

interface SectionData {
  title: string;
  data: FoodItem[];
}

const MENU_DATA: SectionData[] = [
  {
    title: 'Appetizers',
    data: [
      { name: 'Spring Rolls', price: 6.99 },
      { name: 'Soup of the Day', price: 4.99 },
      { name: 'Garden Salad', price: 5.99 },
    ],
  },
  {
    title: 'Main Courses',
    data: [
      { name: 'Grilled Salmon', price: 18.99 },
      { name: 'Beef Steak', price: 24.99 },
      { name: 'Pasta Primavera', price: 14.99 },
      { name: 'Chicken Parmesan', price: 16.99 },
    ],
  },
  {
    title: 'Desserts',
    data: [
      { name: 'Chocolate Cake', price: 7.99 },
      { name: 'Ice Cream', price: 5.99 },
      { name: 'Cheesecake', price: 8.99 },
    ],
  },
  {
    title: 'Beverages',
    data: [
      { name: 'Coffee', price: 2.99 },
      { name: 'Tea', price: 2.49 },
      { name: 'Soft Drinks', price: 1.99 },
    ],
  },
];

function SectionListExample() {
  return (
    <Box style={{ padding: 2 }}>
      <Text style={{ bold: true, marginBottom: 1 }}>Restaurant Menu (SectionList Example)</Text>

      <SectionList<FoodItem, SectionData>
        sections={MENU_DATA}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        maxHeight={15}
        renderSectionHeader={({ section }) => (
          <View style={{ backgroundColor: 'blue', padding: 1 }}>
            <Text style={{ bold: true, color: 'white' }}>▸ {section.title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', paddingLeft: 2, paddingTop: 1 }}>
            <Text style={{ flex: 1 }}>{item.name}</Text>
            <Text style={{ color: 'green' }}>${item.price.toFixed(2)}</Text>
          </View>
        )}
        renderSectionFooter={({ section }) => (
          <View style={{ paddingLeft: 2, paddingBottom: 1 }}>
            <Text style={{ color: 'gray', italic: true }}>({section.data.length} items)</Text>
          </View>
        )}
        SectionSeparatorComponent={<View style={{ height: 1 }} />}
        ListHeaderComponent={
          <View style={{ borderBottom: 'double', paddingBottom: 1, marginBottom: 1 }}>
            <Text style={{ color: 'cyan', bold: true }}>═══════ TODAY&apos;S MENU ═══════</Text>
          </View>
        }
        ListFooterComponent={
          <View style={{ borderTop: 'single', paddingTop: 1, marginTop: 1 }}>
            <Text style={{ color: 'gray' }}>* Prices subject to change</Text>
          </View>
        }
      />

      <Text style={{ marginTop: 2, color: 'cyan' }}>Scroll to see all sections</Text>
    </Box>
  );
}

render(<SectionListExample />);
