/**
 * Platform and Dimensions API Example
 * Demonstrates platform detection and terminal dimensions
 */

import React, { useEffect, useState } from 'react';
import { render, View, Text, Box, Platform, Dimensions, useWindowDimensions } from '../src/index';

function PlatformDimensionsExample() {
  const windowDims = useWindowDimensions();
  const [resizeCount, setResizeCount] = useState(0);

  // Listen for dimension changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setResizeCount((c) => c + 1);
      console.log(`Resized to ${window.width}x${window.height}`);
    });

    return () => subscription.remove();
  }, []);

  // Platform.select example
  const platformMessage = Platform.select({
    terminal: 'Running in terminal environment',
    ios: 'Running on iOS',
    android: 'Running on Android',
    default: 'Running on unknown platform',
  });

  const platformInfo = Platform.getInfo();

  return (
    <Box style={{ padding: 2 }}>
      <Text style={{ bold: true, marginBottom: 2 }}>Platform & Dimensions API Example</Text>

      {/* Platform Information */}
      <View style={{ marginBottom: 2 }}>
        <Text style={{ bold: true, color: 'cyan' }}>Platform API:</Text>
        <View style={{ paddingLeft: 2 }}>
          <Text>OS: {Platform.OS}</Text>
          <Text>Version: {Platform.Version}</Text>
          <Text>Underlying OS: {Platform.underlyingOS}</Text>
          <Text>Is macOS: {Platform.isMacOS ? 'Yes' : 'No'}</Text>
          <Text>Is Windows: {Platform.isWindows ? 'Yes' : 'No'}</Text>
          <Text>Is Linux: {Platform.isLinux ? 'Yes' : 'No'}</Text>
          <Text>Is TV: {Platform.isTV ? 'Yes' : 'No'}</Text>
        </View>
      </View>

      {/* Platform.select */}
      <View style={{ marginBottom: 2 }}>
        <Text style={{ bold: true, color: 'cyan' }}>Platform.select():</Text>
        <View style={{ paddingLeft: 2 }}>
          <Text style={{ color: 'green' }}>{platformMessage}</Text>
        </View>
      </View>

      {/* Platform.getInfo() */}
      <View style={{ marginBottom: 2 }}>
        <Text style={{ bold: true, color: 'cyan' }}>Platform.getInfo():</Text>
        <View style={{ paddingLeft: 2 }}>
          <Text>Arch: {platformInfo.arch}</Text>
          <Text>Node: {platformInfo.nodeVersion}</Text>
        </View>
      </View>

      {/* Dimensions */}
      <View style={{ marginBottom: 2 }}>
        <Text style={{ bold: true, color: 'cyan' }}>Dimensions API:</Text>
        <View style={{ paddingLeft: 2 }}>
          <Text>Width: {windowDims.width} columns</Text>
          <Text>Height: {windowDims.height} rows</Text>
          <Text>Scale: {windowDims.scale}</Text>
          <Text>Font Scale: {windowDims.fontScale}</Text>
        </View>
      </View>

      {/* Resize counter */}
      <View style={{ marginBottom: 2 }}>
        <Text style={{ bold: true, color: 'cyan' }}>Resize Events:</Text>
        <View style={{ paddingLeft: 2 }}>
          <Text>Resize count: {resizeCount}</Text>
          <Text style={{ color: 'gray' }}>(Try resizing your terminal)</Text>
        </View>
      </View>

      <Text style={{ marginTop: 1, color: 'gray', italic: true }}>
        Resize terminal to see dimension changes
      </Text>
    </Box>
  );
}

render(<PlatformDimensionsExample />);
