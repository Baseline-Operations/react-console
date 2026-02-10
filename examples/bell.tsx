/**
 * Bell API Example - Terminal audio feedback with customizable tones
 */

import React, { useState } from 'react';
import {
  render,
  View,
  Text,
  Button,
  ScrollView,
  Bell,
  useBell,
  StyleSheet,
  useTerminalDimensions,
} from '../src/index';

// Register patterns
Bell.registerPattern('mario', [
  { frequency: 659, duration: 150 },
  { frequency: 659, duration: 150, delay: 150 },
  { frequency: 659, duration: 150, delay: 150 },
  { frequency: 523, duration: 150, delay: 150 },
  { frequency: 659, duration: 150, delay: 100 },
  { frequency: 784, duration: 300, delay: 150 },
  { frequency: 392, duration: 300, delay: 300 },
  { frequency: 523, duration: 200, delay: 300 },
  { frequency: 392, duration: 200, delay: 150 },
  { frequency: 330, duration: 200, delay: 150 },
  { frequency: 440, duration: 150, delay: 150 },
  { frequency: 494, duration: 150, delay: 100 },
  { frequency: 466, duration: 100, delay: 100 },
  { frequency: 440, duration: 200, delay: 100 },
]);

Bell.registerPattern('twinkle', [
  { frequency: 262, duration: 300 },
  { frequency: 262, duration: 300, delay: 50 },
  { frequency: 392, duration: 300, delay: 50 },
  { frequency: 392, duration: 300, delay: 50 },
  { frequency: 440, duration: 300, delay: 50 },
  { frequency: 440, duration: 300, delay: 50 },
  { frequency: 392, duration: 500, delay: 50 },
]);

Bell.registerPattern('imperialMarch', [
  { frequency: 440, duration: 500, volume: 0.6 },
  { frequency: 440, duration: 500, delay: 100 },
  { frequency: 440, duration: 500, delay: 100 },
  { frequency: 349, duration: 350, delay: 100 },
  { frequency: 523, duration: 150, delay: 0 },
  { frequency: 440, duration: 500, delay: 100 },
  { frequency: 349, duration: 350, delay: 100 },
  { frequency: 523, duration: 150, delay: 0 },
  { frequency: 440, duration: 1000, delay: 100 },
]);

// Stereo patterns
Bell.registerPattern('pingPong', [
  { frequency: 800, duration: 100, pan: -1 },
  { frequency: 800, duration: 100, pan: 1, delay: 150 },
  { frequency: 800, duration: 100, pan: -1, delay: 150 },
  { frequency: 800, duration: 100, pan: 1, delay: 150 },
  { frequency: 1000, duration: 200, pan: 0, delay: 150 },
]);

Bell.registerPattern('stereoSiren', [
  { frequency: 400, duration: 150, pan: -1 },
  { frequency: 600, duration: 150, pan: 0, delay: 50 },
  { frequency: 800, duration: 150, pan: 1, delay: 50 },
  { frequency: 600, duration: 150, pan: 0, delay: 50 },
  { frequency: 400, duration: 150, pan: -1, delay: 50 },
]);

Bell.registerPattern('spaceship', [
  { frequency: 200, duration: 100, pan: -1, volume: 0.2 },
  { frequency: 350, duration: 100, pan: -0.5, volume: 0.5, delay: 30 },
  { frequency: 450, duration: 100, pan: 0, volume: 0.7, delay: 30 },
  { frequency: 350, duration: 100, pan: 0.5, volume: 0.5, delay: 30 },
  { frequency: 200, duration: 100, pan: 1, volume: 0.2, delay: 30 },
]);

Bell.registerPattern('laserBattle', [
  { frequency: 1500, duration: 50, pan: -1, waveform: 'sawtooth', volume: 0.4 },
  { frequency: 800, duration: 80, pan: -1, waveform: 'sawtooth', volume: 0.3, delay: 0 },
  { frequency: 1800, duration: 50, pan: 1, waveform: 'square', volume: 0.4, delay: 150 },
  { frequency: 600, duration: 80, pan: 1, waveform: 'square', volume: 0.3, delay: 0 },
]);

const styles = StyleSheet.create({
  container: {
    padding: 1,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: 1,
    flexWrap: 'wrap',
    marginBottom: 1,
  },
  label: {
    color: 'yellow',
    bold: true,
  },
  labelMagenta: {
    color: 'magenta',
    bold: true,
  },
});

function BellExample() {
  const [enabled, setEnabled] = useState(Bell.isEnabled());
  const [lastPlayed, setLastPlayed] = useState<string>('');
  const [isTonePlaying, setIsTonePlaying] = useState(false);
  const bell = useBell();
  const dims = useTerminalDimensions();

  const play = (name: string, fn: () => void) => {
    setLastPlayed(name);
    fn();
  };

  return (
    <View style={styles.container}>
      <Text style={{ bold: true }}>Bell API Example</Text>
      <Text>
        {'Status: '}
        <Text style={{ color: enabled ? 'green' : 'red', bold: true }}>
          {enabled ? 'ON' : 'OFF'}
        </Text>
        {' | Playing: '}
        <Text style={{ color: 'cyan', bold: true }}>{lastPlayed || '-'}</Text>
      </Text>

      <View style={styles.row}>
        <Button
          onClick={() => {
            Bell.setEnabled(!enabled);
            setEnabled(!enabled);
          }}
        >
          {enabled ? 'Disable' : 'Enable'}
        </Button>
        <Button
          onClick={() => {
            Bell.cancel();
            bell.stopTone();
            setIsTonePlaying(false);
            setLastPlayed('');
          }}
        >
          Stop
        </Button>
      </View>

      <ScrollView
        maxHeight={Math.max(5, dims.rows - 5)}
        showsVerticalScrollIndicator
      >
        <Text style={styles.label}>Sounds:</Text>
        <View style={styles.row}>
          <Button onClick={() => play('ding', () => bell.ding())}>Ding</Button>
          <Button onClick={() => play('bell', () => bell.bell())}>Bell</Button>
          <Button onClick={() => play('success', () => bell.success())}>Success</Button>
          <Button onClick={() => play('error', () => bell.error())}>Error</Button>
          <Button onClick={() => play('warning', () => bell.warning())}>Warning</Button>
          <Button onClick={() => play('alert', () => bell.alert())}>Alert</Button>
          <Button onClick={() => play('complete', () => bell.complete())}>Complete</Button>
        </View>

        <Text style={styles.label}>Effects:</Text>
        <View style={styles.row}>
          <Button onClick={() => play('coin', () => bell.coin())}>Coin</Button>
          <Button onClick={() => play('levelUp', () => bell.levelUp())}>LvlUp</Button>
          <Button onClick={() => play('powerUp', () => bell.powerUp())}>PwrUp</Button>
          <Button onClick={() => play('phone', () => bell.phone())}>Phone</Button>
          <Button onClick={() => play('chime', () => bell.chime())}>Chime</Button>
        </View>

        <Text style={styles.label}>Waveforms:</Text>
        <View style={styles.row}>
          <Button
            onClick={() => play('sine', () => bell.ring({ frequency: 800, waveform: 'sine' }))}
          >
            Sine
          </Button>
          <Button
            onClick={() => play('square', () => bell.ring({ frequency: 800, waveform: 'square' }))}
          >
            Square
          </Button>
          <Button
            onClick={() => play('saw', () => bell.ring({ frequency: 800, waveform: 'sawtooth' }))}
          >
            Saw
          </Button>
          <Button
            onClick={() => play('tri', () => bell.ring({ frequency: 800, waveform: 'triangle' }))}
          >
            Tri
          </Button>
        </View>

        <Text style={styles.labelMagenta}>Stereo:</Text>
        <View style={styles.row}>
          <Button onClick={() => play('left', () => bell.ring({ frequency: 600, pan: -1 }))}>
            Left
          </Button>
          <Button onClick={() => play('center', () => bell.ring({ frequency: 800 }))}>
            Center
          </Button>
          <Button onClick={() => play('right', () => bell.ring({ frequency: 1000, pan: 1 }))}>
            Right
          </Button>
          <Button onClick={() => play('pingPong', () => bell.playPattern('pingPong'))}>
            PingPong
          </Button>
          <Button onClick={() => play('siren', () => bell.playPattern('stereoSiren'))}>
            Siren
          </Button>
          <Button onClick={() => play('spaceship', () => bell.playPattern('spaceship'))}>
            Ship
          </Button>
          <Button onClick={() => play('lasers', () => bell.playPattern('laserBattle'))}>
            Lasers
          </Button>
        </View>

        <Text style={styles.label}>Continuous:</Text>
        <View style={styles.row}>
          {!isTonePlaying ? (
            <>
              <Button
                onClick={() => {
                  setLastPlayed('440Hz');
                  setIsTonePlaying(true);
                  bell.startTone({ frequency: 440 });
                }}
              >
                440Hz
              </Button>
              <Button
                onClick={() => {
                  setLastPlayed('Left');
                  setIsTonePlaying(true);
                  bell.startTone({ frequency: 440, pan: -1 });
                }}
              >
                Left
              </Button>
              <Button
                onClick={() => {
                  setLastPlayed('Right');
                  setIsTonePlaying(true);
                  bell.startTone({ frequency: 440, pan: 1 });
                }}
              >
                Right
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                bell.stopTone();
                setIsTonePlaying(false);
                setLastPlayed('');
              }}
            >
              Stop Tone
            </Button>
          )}
        </View>

        <Text style={styles.label}>Songs:</Text>
        <View style={styles.row}>
          <Button onClick={() => play('Mario', () => bell.playPattern('mario'))}>Mario</Button>
          <Button onClick={() => play('Imperial', () => bell.playPattern('imperialMarch'))}>
            Imperial
          </Button>
          <Button onClick={() => play('Twinkle', () => bell.playPattern('twinkle'))}>
            Twinkle
          </Button>
        </View>

        <Text style={styles.label}>Beeps:</Text>
        <View style={styles.row}>
          <Button onClick={() => play('x1', () => bell.beep(1))}>x1</Button>
          <Button onClick={() => play('x3', () => bell.beep(3))}>x3</Button>
          <Button onClick={() => play('slow', () => bell.beep({ count: 3, interval: 300 }))}>
            Slow
          </Button>
          <Button onClick={() => play('fast', () => bell.beep({ count: 5, interval: 80 }))}>
            Fast
          </Button>
        </View>

        <Text style={{ color: 'gray', dim: true }}>
          {bell.getConfig().sampleRate}Hz, {bell.getConfig().bitDepth}bit,{' '}
          {bell.getConfig().channels}ch | {bell.getPatternNames().length} patterns
        </Text>
      </ScrollView>
    </View>
  );
}

render(<BellExample />);
