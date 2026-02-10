/**
 * Bell API - Terminal audio feedback
 * Provides bell/beep sounds for terminal applications
 *
 * Uses the speaker package to play audio directly, bypassing
 * terminal bell limitations.
 */

import { debug } from '../utils/debug';
import { createRequire } from 'module';

// Store Speaker in globalThis to survive ESM/CJS dual loading
const SPEAKER_KEY = '__reactConsoleSpeaker__';
const SPEAKER_LOADED_KEY = '__reactConsoleSpeakerLoaded__';
const BELL_CONFIG_KEY = '__reactConsoleBellConfig__';
const CONTINUOUS_SPEAKER_KEY = '__reactConsoleContinuousSpeaker__';
const ACTIVE_SPEAKERS_KEY = '__reactConsoleActiveSpeakers__';
const FALLBACK_TIMEOUTS_KEY = '__reactConsoleFallbackTimeouts__';

// Counter for generating unique audio IDs
let audioIdCounter = 0;

/**
 * Generate a unique audio event ID
 */
function generateAudioId(): string {
  return `audio_${++audioIdCounter}_${Date.now()}`;
}

/**
 * Get the active speakers map
 */
function getActiveSpeakers(): Map<string, { speaker: unknown; stopped: boolean }> {
  if (!(globalThis as Record<string, unknown>)[ACTIVE_SPEAKERS_KEY]) {
    (globalThis as Record<string, unknown>)[ACTIVE_SPEAKERS_KEY] = new Map();
  }
  return (globalThis as Record<string, unknown>)[ACTIVE_SPEAKERS_KEY] as Map<
    string,
    { speaker: unknown; stopped: boolean }
  >;
}

/**
 * Get the fallback timeouts map (for terminal bell fallback)
 */
function getFallbackTimeouts(): Map<string, NodeJS.Timeout[]> {
  if (!(globalThis as Record<string, unknown>)[FALLBACK_TIMEOUTS_KEY]) {
    (globalThis as Record<string, unknown>)[FALLBACK_TIMEOUTS_KEY] = new Map();
  }
  return (globalThis as Record<string, unknown>)[FALLBACK_TIMEOUTS_KEY] as Map<
    string,
    NodeJS.Timeout[]
  >;
}

/**
 * Register fallback timeouts for an audio ID
 */
function registerFallbackTimeouts(audioId: string, timeouts: NodeJS.Timeout[]): void {
  const map = getFallbackTimeouts();
  map.set(audioId, timeouts);
}

/**
 * Clear and remove fallback timeouts for an audio ID
 */
function clearFallbackTimeouts(audioId?: string): void {
  const map = getFallbackTimeouts();
  if (audioId) {
    const timeouts = map.get(audioId);
    if (timeouts) {
      timeouts.forEach((t) => clearTimeout(t));
      map.delete(audioId);
    }
  } else {
    // Clear all
    for (const timeouts of map.values()) {
      timeouts.forEach((t) => clearTimeout(t));
    }
    map.clear();
  }
}

/**
 * Waveform types for tone generation
 */
export type WaveformType = 'sine' | 'square' | 'sawtooth' | 'triangle';

/**
 * Audio configuration options
 */
export interface BellAudioConfig {
  /** Sample rate in Hz (default: 44100, options: 22050, 44100, 48000) */
  sampleRate?: 22050 | 44100 | 48000;
  /** Bit depth (default: 16, options: 8, 16) */
  bitDepth?: 8 | 16;
  /** Number of channels (default: 2 for stereo, 1 for mono) */
  channels?: 1 | 2;
  /** Default waveform type (default: 'sine') */
  waveform?: WaveformType;
  /** Default volume 0-1 (default: 0.5) */
  defaultVolume?: number;
  /** Fade duration in ms to prevent clicks (default: 10) */
  fadeDuration?: number;
}

/**
 * Pan position for stereo audio
 * -1 = full left, 0 = center (both), 1 = full right
 */
export type PanPosition = number;

function getAudioConfig(): Required<BellAudioConfig> {
  const stored = (globalThis as Record<string, unknown>)[BELL_CONFIG_KEY] as
    | BellAudioConfig
    | undefined;
  return {
    sampleRate: stored?.sampleRate ?? 44100,
    bitDepth: stored?.bitDepth ?? 16,
    channels: stored?.channels ?? 2, // Default to stereo
    waveform: stored?.waveform ?? 'sine',
    defaultVolume: stored?.defaultVolume ?? 0.5,
    fadeDuration: stored?.fadeDuration ?? 10,
  };
}

/**
 * Stop audio by ID, or all audio if no ID specified
 */
function stopActiveSpeaker(audioId?: string): void {
  try {
    const speakers = getActiveSpeakers();
    if (!speakers) return;

    const stopSpeaker = (entry: { speaker: unknown; stopped: boolean }) => {
      if (entry.stopped) return;
      entry.stopped = true;

      const speaker = entry.speaker as {
        end?: () => void;
        destroy?: (err?: Error) => void;
        close?: () => void;
        removeAllListeners?: () => void;
        cork?: () => void;
        destroyed?: boolean;
        writable?: boolean;
      };

      if (!speaker) return;

      try {
        // Remove listeners first to avoid error callbacks
        if (typeof speaker.removeAllListeners === 'function') {
          speaker.removeAllListeners();
        }
      } catch {
        /* ignore */
      }

      try {
        // Cork to stop accepting data
        if (typeof speaker.cork === 'function') {
          speaker.cork();
        }
      } catch {
        /* ignore */
      }

      try {
        // Try destroy first (most forceful)
        if (typeof speaker.destroy === 'function' && !speaker.destroyed) {
          speaker.destroy();
          return; // destroy handles cleanup
        }
      } catch {
        /* ignore */
      }

      try {
        // Fallback to close
        if (typeof speaker.close === 'function') {
          speaker.close();
          return;
        }
      } catch {
        /* ignore */
      }

      try {
        // Last resort: end
        if (typeof speaker.end === 'function' && speaker.writable !== false) {
          speaker.end();
        }
      } catch {
        /* ignore */
      }
    };

    if (audioId) {
      // Stop specific audio
      const entry = speakers.get(audioId);
      if (entry) {
        stopSpeaker(entry);
        speakers.delete(audioId);
      }
      // Also clear any fallback timeouts for this audio ID
      clearFallbackTimeouts(audioId);
    } else {
      // Stop all audio - collect entries first to avoid mutation during iteration
      const entries = Array.from(speakers.entries());
      speakers.clear();
      for (const [, entry] of entries) {
        stopSpeaker(entry);
      }
      // Also clear all fallback timeouts
      clearFallbackTimeouts();
    }
  } catch {
    // Ignore all errors during stop - we don't want stop to crash
  }
}

/**
 * Register an active speaker with an ID
 */
function registerActiveSpeaker(audioId: string, speaker: { end: () => void }): void {
  const speakers = getActiveSpeakers();
  speakers.set(audioId, { speaker, stopped: false });
}

/**
 * Check if a specific audio is still active (not stopped)
 */
function isAudioActive(audioId: string): boolean {
  const speakers = getActiveSpeakers();
  const entry = speakers.get(audioId);
  return entry ? !entry.stopped : false;
}

/**
 * Remove an audio entry (called when playback completes naturally)
 */
function unregisterActiveSpeaker(audioId: string): void {
  const speakers = getActiveSpeakers();
  speakers.delete(audioId);
}

function getSpeaker(): typeof import('@mastra/node-speaker') | null {
  // Check if we've already tried to load
  if ((globalThis as Record<string, unknown>)[SPEAKER_LOADED_KEY]) {
    return (globalThis as Record<string, unknown>)[SPEAKER_KEY] as
      | typeof import('@mastra/node-speaker')
      | null;
  }

  // Mark as loaded (even if it fails)
  (globalThis as Record<string, unknown>)[SPEAKER_LOADED_KEY] = true;

  try {
    // Use createRequire for ESM compatibility
    const require = createRequire(import.meta.url);
    const SpeakerModule = require('@mastra/node-speaker');
    (globalThis as Record<string, unknown>)[SPEAKER_KEY] = SpeakerModule;
    debug('[Bell] Speaker module loaded successfully');
    return SpeakerModule;
  } catch (e) {
    // Speaker not available, will fall back to terminal bell
    debug('[Bell] Speaker module not available, will use terminal bell', { error: String(e) });
    (globalThis as Record<string, unknown>)[SPEAKER_KEY] = null;
    return null;
  }
}

/**
 * Check if the speaker module is available for audio playback.
 * When speaker is available, Bell.ts plays audio directly, so terminal bell
 * sequences should not be written by DisplayBuffer.
 */
export function isSpeakerAvailable(): boolean {
  return getSpeaker() !== null;
}

/**
 * Generate waveform sample at time t
 */
function generateWaveformSample(
  waveform: WaveformType,
  frequency: number,
  t: number,
  volume: number
): number {
  const period = 1 / frequency;
  const phase = (t % period) / period; // 0 to 1 within each cycle

  let sample: number;
  switch (waveform) {
    case 'square':
      sample = phase < 0.5 ? 1 : -1;
      break;
    case 'sawtooth':
      sample = 2 * phase - 1;
      break;
    case 'triangle':
      sample = phase < 0.5 ? 4 * phase - 1 : 3 - 4 * phase;
      break;
    case 'sine':
    default:
      sample = Math.sin(2 * Math.PI * frequency * t);
      break;
  }

  return sample * volume;
}

/**
 * Generate a tone buffer using PCM audio
 * @param pan - Pan position: -1 = left, 0 = center, 1 = right (only for stereo)
 */
function generateToneBuffer(
  frequency: number = 800,
  durationMs: number = 100,
  volume?: number,
  waveform?: WaveformType,
  pan: number = 0
): Buffer {
  const config = getAudioConfig();
  const sampleRate = config.sampleRate;
  const bitDepth = config.bitDepth;
  const channels = config.channels;
  const wave = waveform ?? config.waveform;
  // Clamp volume to valid range [0, 1] to prevent PCM overflow
  const vol = Math.max(0, Math.min(1, volume ?? config.defaultVolume));
  const fadeDuration = config.fadeDuration;

  // Ensure minimum duration to prevent buffer underflow
  const actualDuration = Math.max(durationMs, 20);
  const samples = Math.floor((sampleRate * actualDuration) / 1000);
  const bytesPerSample = bitDepth === 16 ? 2 : 1;
  const buffer = Buffer.alloc(samples * bytesPerSample * channels);

  const fadesamples = Math.floor((sampleRate * fadeDuration) / 1000);
  const maxValue = bitDepth === 16 ? 32767 : 127;

  // Calculate left/right volume for stereo panning
  // pan: -1 = full left, 0 = center, 1 = full right
  const clampedPan = Math.max(-1, Math.min(1, pan));
  const leftVol = channels === 2 ? Math.cos(((clampedPan + 1) * Math.PI) / 4) : 1;
  const rightVol = channels === 2 ? Math.sin(((clampedPan + 1) * Math.PI) / 4) : 1;

  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    const sample = generateWaveformSample(wave, frequency, t, vol);

    // Apply fade in/out to avoid clicks
    let amplitude = 1;
    if (i < fadesamples) {
      amplitude = i / fadesamples;
    } else if (i > samples - fadesamples) {
      amplitude = (samples - i) / fadesamples;
    }

    const baseSample = sample * amplitude;

    if (channels === 2) {
      // Stereo: apply pan
      const leftValue = Math.floor(baseSample * leftVol * maxValue);
      const rightValue = Math.floor(baseSample * rightVol * maxValue);

      if (bitDepth === 16) {
        buffer.writeInt16LE(leftValue, i * 4);
        buffer.writeInt16LE(rightValue, i * 4 + 2);
      } else {
        buffer.writeUInt8(leftValue + 128, i * 2);
        buffer.writeUInt8(rightValue + 128, i * 2 + 1);
      }
    } else {
      // Mono
      const value = Math.floor(baseSample * maxValue);
      if (bitDepth === 16) {
        buffer.writeInt16LE(value, i * 2);
      } else {
        buffer.writeUInt8(value + 128, i);
      }
    }
  }

  return buffer;
}

/**
 * Generate silence buffer for delays
 */
function generateSilenceBuffer(durationMs: number): Buffer {
  const config = getAudioConfig();
  const samples = Math.floor((config.sampleRate * durationMs) / 1000);
  const bytesPerSample = config.bitDepth === 16 ? 2 : 1;
  return Buffer.alloc(samples * bytesPerSample * config.channels);
}

/**
 * Generate trailing silence to prevent audio artifacts at end of playback
 */
function generateTrailingSilence(): Buffer {
  const config = getAudioConfig();
  // 100ms of silence for clean ending
  const samples = Math.floor((config.sampleRate * 100) / 1000);
  const bytesPerSample = config.bitDepth === 16 ? 2 : 1;
  return Buffer.alloc(samples * bytesPerSample * config.channels);
}

/**
 * Create a speaker instance with current config
 */
function createSpeaker(): InstanceType<typeof import('@mastra/node-speaker')> | null {
  const Speaker = getSpeaker();
  if (!Speaker) return null;

  const config = getAudioConfig();
  return new Speaker({
    channels: config.channels,
    bitDepth: config.bitDepth,
    sampleRate: config.sampleRate,
  });
}

/**
 * Play a beep sound using the speaker package
 * Uses chunked writing for interruptible playback
 * @returns Audio event ID for stopping this specific audio
 */
function playBeepWithSpeaker(
  frequency: number = 800,
  durationMs: number = 150,
  volume?: number,
  waveform?: WaveformType,
  pan: number = 0
): string {
  const audioId = generateAudioId();

  const speaker = createSpeaker();

  if (!speaker) {
    debug('[Bell] No Speaker available, using terminal bell');
    process.stdout.write('\u0007');
    return audioId;
  }

  // Register this speaker for cancellation
  registerActiveSpeaker(audioId, speaker);

  try {
    const config = getAudioConfig();
    const buffer = generateToneBuffer(frequency, durationMs, volume, waveform, pan);
    const trailingSilence = generateTrailingSilence();

    debug('[Bell] Writing audio buffer', {
      audioId,
      bufferSize: buffer.length,
      frequency,
      durationMs,
      volume: volume ?? config.defaultVolume,
      waveform: waveform ?? config.waveform,
      pan,
      time: Date.now(),
    });

    // Combine all buffers
    const combinedBuffer = Buffer.concat([buffer, trailingSilence]);

    speaker.on('error', (err: Error) => {
      debug('[Bell] Speaker error during beep playback', { audioId, error: String(err) });
    });

    speaker.on('close', () => {
      unregisterActiveSpeaker(audioId);
    });

    // Write in chunks so playback can be interrupted
    const chunkDurationMs = 50; // 50ms chunks for responsive stopping
    const bytesPerMs = (config.sampleRate * (config.bitDepth / 8) * config.channels) / 1000;
    const chunkSize = Math.floor(bytesPerMs * chunkDurationMs);
    let offset = 0;

    const writeNextChunk = () => {
      // Check if we've been stopped
      if (!isAudioActive(audioId)) {
        try {
          speaker.end();
        } catch {
          /* ignore */
        }
        return;
      }

      if (offset >= combinedBuffer.length) {
        // All data written
        speaker.end();
        return;
      }

      const end = Math.min(offset + chunkSize, combinedBuffer.length);
      const chunk = combinedBuffer.subarray(offset, end);
      offset = end;

      speaker.write(chunk, () => {
        // Schedule next chunk
        setImmediate(writeNextChunk);
      });
    };

    writeNextChunk();
  } catch (err) {
    debug('[Bell] Speaker error, falling back to terminal bell', { error: String(err) });
    unregisterActiveSpeaker(audioId);
    process.stdout.write('\u0007');
  }

  return audioId;
}

/**
 * Play a sequence of tones with the speaker package
 * Uses chunked writing for interruptible playback
 * @returns Audio event ID for stopping this specific audio
 */
function playSequenceWithSpeaker(tones: BellTone[]): string {
  const audioId = generateAudioId();

  const speaker = createSpeaker();

  if (!speaker) {
    debug('[Bell] No Speaker available, using terminal bells for sequence');
    const timeoutIds: NodeJS.Timeout[] = [];
    let totalDelay = 0;
    tones.forEach((tone, index) => {
      const delay = index === 0 ? 0 : (tone.delay ?? 50);
      totalDelay += delay;
      const timeoutId = setTimeout(() => {
        process.stdout.write('\u0007');
      }, totalDelay);
      timeoutIds.push(timeoutId);
      totalDelay += tone.duration ?? 150;
    });
    // Track these timeouts so they can be cancelled
    registerFallbackTimeouts(audioId, timeoutIds);
    // Clean up after the last timeout completes
    const cleanupTimeout = setTimeout(() => {
      clearFallbackTimeouts(audioId);
    }, totalDelay + 100);
    timeoutIds.push(cleanupTimeout);
    return audioId;
  }

  // Register this speaker for cancellation
  registerActiveSpeaker(audioId, speaker);

  try {
    const config = getAudioConfig();

    debug('[Bell] Playing sequence', { audioId, toneCount: tones.length, time: Date.now() });

    // Pre-generate all buffers to avoid gaps
    const buffers: Buffer[] = [];

    tones.forEach((tone, index) => {
      // Add delay before this tone (except for the first one)
      if (index > 0) {
        const delay = tone.delay ?? 50;
        if (delay > 0) {
          buffers.push(generateSilenceBuffer(delay));
        }
      }

      // Generate the tone
      const frequency = tone.frequency ?? 800;
      const duration = tone.duration ?? 150;
      const volume = tone.volume ?? config.defaultVolume;
      const waveform = tone.waveform ?? config.waveform;
      const pan = tone.pan ?? 0;
      buffers.push(generateToneBuffer(frequency, duration, volume, waveform, pan));
    });

    // Add trailing silence
    buffers.push(generateTrailingSilence());

    // Combine all buffers into one
    const totalLength = buffers.reduce((sum, buf) => sum + buf.length, 0);
    const combinedBuffer = Buffer.concat(buffers, totalLength);

    speaker.on('error', (err: Error) => {
      debug('[Bell] Speaker error during sequence playback', { audioId, error: String(err) });
    });

    speaker.on('close', () => {
      unregisterActiveSpeaker(audioId);
    });

    // Write in chunks so playback can be interrupted
    const chunkDurationMs = 50; // 50ms chunks for responsive stopping
    const bytesPerMs = (config.sampleRate * (config.bitDepth / 8) * config.channels) / 1000;
    const chunkSize = Math.floor(bytesPerMs * chunkDurationMs);
    let offset = 0;

    const writeNextChunk = () => {
      // Check if we've been stopped
      if (!isAudioActive(audioId)) {
        try {
          speaker.end();
        } catch {
          /* ignore */
        }
        return;
      }

      if (offset >= combinedBuffer.length) {
        // All data written
        speaker.end();
        return;
      }

      const end = Math.min(offset + chunkSize, combinedBuffer.length);
      const chunk = combinedBuffer.subarray(offset, end);
      offset = end;

      speaker.write(chunk, () => {
        // Schedule next chunk
        setImmediate(writeNextChunk);
      });
    };

    writeNextChunk();
  } catch (err) {
    debug('[Bell] Speaker error playing sequence', { error: String(err) });
    unregisterActiveSpeaker(audioId);
    process.stdout.write('\u0007');
  }

  return audioId;
}

// Global key for storing render callback to avoid circular imports
const BELL_RENDER_KEY = '__reactConsoleBellRender__';

/**
 * Set the render callback (called by renderer during initialization)
 */
export function setBellRenderCallback(callback: () => void): void {
  (globalThis as Record<string, unknown>)[BELL_RENDER_KEY] = callback;
}

/**
 * A single tone in a bell sequence
 */
export interface BellTone {
  /** Frequency in Hz (default: 800) */
  frequency?: number;
  /** Duration in ms (default: 150) */
  duration?: number;
  /** Volume from 0 to 1 (default: 0.5) */
  volume?: number;
  /** Delay in ms BEFORE this tone plays (ignored for first tone, default: 50) */
  delay?: number;
  /** Waveform type (default: from config, typically 'sine') */
  waveform?: WaveformType;
  /** Pan position: -1 = left, 0 = center (default), 1 = right */
  pan?: PanPosition;
}

/**
 * Bell pattern for repeated beeps (legacy API)
 */
export interface BellPattern {
  /** Number of beeps */
  count: number;
  /** Delay between beeps in ms (default: 100) */
  interval?: number;
}

/**
 * Bell options for single ring
 */
export interface BellOptions {
  /** Use visual bell instead of audible (if terminal supports it) */
  visual?: boolean;
  /** Frequency in Hz (default: 800) */
  frequency?: number;
  /** Duration in ms (default: 150) */
  duration?: number;
  /** Volume from 0 to 1 (default: 0.5) */
  volume?: number;
  /** Waveform type (default: from config, typically 'sine') */
  waveform?: WaveformType;
  /** Pan position: -1 = left, 0 = center (default), 1 = right */
  pan?: PanPosition;
}

// All bell state in globalThis to ensure sharing across ESM and CJS module loads
const BELL_STATE_KEY = '__reactConsoleBellState__';

interface BellState {
  enabled: boolean;
  pendingBells: number;
  bellsWaitingForDsr: number;
}

function getBellState(): BellState {
  if (!(globalThis as Record<string, unknown>)[BELL_STATE_KEY]) {
    (globalThis as Record<string, unknown>)[BELL_STATE_KEY] = {
      enabled: true,
      pendingBells: 0,
      bellsWaitingForDsr: 0,
    };
  }
  return (globalThis as Record<string, unknown>)[BELL_STATE_KEY] as BellState;
}

// Key for storing flushSync callback to avoid circular imports
const BELL_FLUSH_SYNC_KEY = '__reactConsoleBellFlushSync__';

/**
 * Set the flushSync callback (called by renderer during initialization)
 */
export function setBellFlushSyncCallback(callback: () => void): void {
  (globalThis as Record<string, unknown>)[BELL_FLUSH_SYNC_KEY] = callback;
}

/**
 * Called when a DSR response is received - triggers any pending bells
 */
export function onDsrResponse(): void {
  const state = getBellState();
  if (state.bellsWaitingForDsr > 0) {
    debug('[Bell.onDsrResponse] DSR received, bells waiting', {
      count: state.bellsWaitingForDsr,
      time: Date.now(),
    });
    const count = state.bellsWaitingForDsr;
    state.bellsWaitingForDsr = 0;
    state.pendingBells = (state.pendingBells || 0) + count;

    const flushSyncCallback = (globalThis as Record<string, unknown>)[BELL_FLUSH_SYNC_KEY] as
      | (() => void)
      | null;
    if (flushSyncCallback) {
      flushSyncCallback();
    }

    const renderCallback = (globalThis as Record<string, unknown>)[BELL_RENDER_KEY] as
      | (() => void)
      | null;
    if (renderCallback) {
      renderCallback();
    }
  }
}

/**
 * Get and clear pending bells (called by renderer)
 */
export function consumePendingBells(): number {
  const state = getBellState();
  const count = state.pendingBells || 0;
  state.pendingBells = 0;
  return count;
}

// Pattern registry for custom patterns
const PATTERN_REGISTRY_KEY = '__reactConsoleBellPatterns__';

function getPatternRegistry(): Map<string, BellTone[]> {
  if (!(globalThis as Record<string, unknown>)[PATTERN_REGISTRY_KEY]) {
    const registry = new Map<string, BellTone[]>();

    // Register default patterns
    registry.set('ding', [{ frequency: 1200, duration: 80, volume: 0.4 }]);

    registry.set('bell', [
      { frequency: 800, duration: 150, volume: 0.5 },
      { frequency: 800, duration: 100, volume: 0.3, delay: 100 },
    ]);

    registry.set('success', [
      { frequency: 600, duration: 100 },
      { frequency: 800, duration: 150, delay: 50 },
    ]);

    registry.set('error', [
      { frequency: 400, duration: 150 },
      { frequency: 300, duration: 200, delay: 50 },
    ]);

    registry.set('warning', [
      { frequency: 600, duration: 100 },
      { frequency: 400, duration: 100, delay: 50 },
      { frequency: 600, duration: 100, delay: 50 },
    ]);

    registry.set('alert', [
      { frequency: 880, duration: 100 },
      { frequency: 880, duration: 100, delay: 80 },
      { frequency: 880, duration: 100, delay: 80 },
    ]);

    registry.set('notification', [{ frequency: 1200, duration: 80, volume: 0.3 }]);

    registry.set('phone', [
      // Simulated phone ring - two-tone pattern repeated
      { frequency: 440, duration: 100 },
      { frequency: 480, duration: 100, delay: 0 },
      { frequency: 440, duration: 100, delay: 200 },
      { frequency: 480, duration: 100, delay: 0 },
      { frequency: 440, duration: 100, delay: 200 },
      { frequency: 480, duration: 100, delay: 0 },
    ]);

    registry.set('chime', [
      { frequency: 659, duration: 150 }, // E5
      { frequency: 523, duration: 150, delay: 50 }, // C5
      { frequency: 587, duration: 150, delay: 50 }, // D5
      { frequency: 392, duration: 300, delay: 50 }, // G4
    ]);

    registry.set('doorbell', [
      { frequency: 659, duration: 400 }, // E5
      { frequency: 523, duration: 600, delay: 50 }, // C5
    ]);

    registry.set('complete', [
      { frequency: 523, duration: 100 }, // C5
      { frequency: 659, duration: 100, delay: 50 }, // E5
      { frequency: 784, duration: 100, delay: 50 }, // G5
      { frequency: 1047, duration: 200, delay: 50 }, // C6
    ]);

    registry.set('levelUp', [
      { frequency: 392, duration: 80 }, // G4
      { frequency: 440, duration: 80, delay: 30 }, // A4
      { frequency: 494, duration: 80, delay: 30 }, // B4
      { frequency: 523, duration: 80, delay: 30 }, // C5
      { frequency: 587, duration: 80, delay: 30 }, // D5
      { frequency: 659, duration: 80, delay: 30 }, // E5
      { frequency: 784, duration: 150, delay: 30 }, // G5
    ]);

    registry.set('powerUp', [
      { frequency: 200, duration: 50 },
      { frequency: 300, duration: 50, delay: 20 },
      { frequency: 400, duration: 50, delay: 20 },
      { frequency: 500, duration: 50, delay: 20 },
      { frequency: 600, duration: 50, delay: 20 },
      { frequency: 800, duration: 100, delay: 20 },
    ]);

    registry.set('powerDown', [
      { frequency: 800, duration: 50 },
      { frequency: 600, duration: 50, delay: 20 },
      { frequency: 500, duration: 50, delay: 20 },
      { frequency: 400, duration: 50, delay: 20 },
      { frequency: 300, duration: 50, delay: 20 },
      { frequency: 200, duration: 100, delay: 20 },
    ]);

    registry.set('coin', [
      { frequency: 988, duration: 80 }, // B5
      { frequency: 1319, duration: 300, delay: 30 }, // E6
    ]);

    registry.set('blip', [{ frequency: 1000, duration: 30, volume: 0.3 }]);

    (globalThis as Record<string, unknown>)[PATTERN_REGISTRY_KEY] = registry;
  }
  return (globalThis as Record<string, unknown>)[PATTERN_REGISTRY_KEY] as Map<string, BellTone[]>;
}

class BellModule {
  /**
   * Configure audio settings for bell sounds
   *
   * @example
   * ```tsx
   * // High quality audio
   * Bell.configure({ sampleRate: 48000, bitDepth: 16 });
   *
   * // Retro 8-bit sound
   * Bell.configure({ bitDepth: 8, waveform: 'square' });
   *
   * // Change default waveform
   * Bell.configure({ waveform: 'triangle', defaultVolume: 0.3 });
   * ```
   */
  configure(config: BellAudioConfig): void {
    const current = getAudioConfig();
    (globalThis as Record<string, unknown>)[BELL_CONFIG_KEY] = {
      ...current,
      ...config,
    };
    debug('[Bell.configure] Updated config', { config });
  }

  /**
   * Get current audio configuration
   */
  getConfig(): Required<BellAudioConfig> {
    return getAudioConfig();
  }

  /**
   * Start a continuous tone that plays until stopped
   *
   * @example
   * ```tsx
   * // Start a 440Hz tone
   * Bell.startTone({ frequency: 440 });
   *
   * // Later, stop it
   * Bell.stopTone();
   *
   * // Square wave alarm
   * Bell.startTone({ frequency: 880, waveform: 'square', volume: 0.3 });
   *
   * // Pan to left speaker
   * Bell.startTone({ frequency: 440, pan: -1 });
   * ```
   */
  startTone(options?: Omit<BellOptions, 'visual' | 'duration'>): void {
    const state = getBellState();
    if (!state.enabled) return;

    // Stop any existing continuous tone (but not other audio like beeps/sequences)
    this.stopTone();

    const Speaker = getSpeaker();
    if (!Speaker) {
      debug('[Bell.startTone] No Speaker available');
      return;
    }

    const config = getAudioConfig();
    const frequency = options?.frequency ?? 800;
    const volume = options?.volume ?? config.defaultVolume;
    const waveform = options?.waveform ?? config.waveform;
    const pan = options?.pan ?? 0;

    try {
      const speaker = new Speaker({
        channels: config.channels,
        bitDepth: config.bitDepth,
        sampleRate: config.sampleRate,
      });

      // Store speaker reference for stopping later
      (globalThis as Record<string, unknown>)[CONTINUOUS_SPEAKER_KEY] = speaker;

      debug('[Bell.startTone] Starting continuous tone', { frequency, volume, waveform, pan });

      // Generate and write chunks continuously with back-pressure handling
      const writeChunk = () => {
        const currentSpeaker = (globalThis as Record<string, unknown>)[CONTINUOUS_SPEAKER_KEY];
        if (currentSpeaker !== speaker) {
          return; // Speaker was stopped or replaced
        }
        // Generate 100ms of audio at a time
        const buffer = generateToneBuffer(frequency, 100, volume, waveform, pan);
        const canContinue = speaker.write(buffer);
        if (canContinue) {
          // Buffer has space, schedule next chunk slightly early to prevent gaps
          setTimeout(writeChunk, 80);
        } else {
          // Back-pressure: wait for drain event before writing more
          speaker.once('drain', () => {
            // Re-check if still active after drain
            if ((globalThis as Record<string, unknown>)[CONTINUOUS_SPEAKER_KEY] === speaker) {
              writeChunk();
            }
          });
        }
      };

      writeChunk();
    } catch (err) {
      debug('[Bell.startTone] Error', { error: String(err) });
    }
  }

  /**
   * Stop a continuous tone started with startTone()
   */
  stopTone(): void {
    const speaker = (globalThis as Record<string, unknown>)[CONTINUOUS_SPEAKER_KEY] as
      | { end: () => void; write: (buf: Buffer) => void }
      | undefined;
    if (speaker) {
      debug('[Bell.stopTone] Stopping continuous tone');
      // Clear reference first to stop the write loop
      (globalThis as Record<string, unknown>)[CONTINUOUS_SPEAKER_KEY] = undefined;

      try {
        // Write trailing silence before ending for clean cutoff
        speaker.write(generateTrailingSilence());
        speaker.end();
      } catch {
        // Ignore errors on end
      }
    }
  }

  /**
   * Ring the bell once with optional tone customization
   *
   * @example
   * ```tsx
   * // Simple beep with defaults (800Hz, 150ms)
   * Bell.ring();
   *
   * // Custom tone
   * Bell.ring({ frequency: 440, duration: 200, volume: 0.3 });
   *
   * // Square wave beep
   * Bell.ring({ frequency: 800, waveform: 'square' });
   *
   * // Pan to left speaker
   * Bell.ring({ frequency: 800, pan: -1 });
   *
   * // Visual bell (if terminal supports it)
   * Bell.ring({ visual: true });
   * ```
   */
  ring(options?: BellOptions): string | undefined {
    const state = getBellState();
    debug('[Bell.ring] Called', { time: Date.now(), enabled: state.enabled, options });
    if (!state.enabled) return undefined;

    if (options?.visual) {
      // Visual bell - flash the screen (reverse video briefly)
      process.stdout.write('\x1b[?5h');
      setTimeout(() => {
        process.stdout.write('\x1b[?5l');
      }, 100);
      return undefined;
    } else {
      const config = getAudioConfig();
      const frequency = options?.frequency ?? 800;
      const duration = options?.duration ?? 150;
      const volume = options?.volume ?? config.defaultVolume;
      const waveform = options?.waveform ?? config.waveform;
      const pan = options?.pan ?? 0;

      debug('[Bell.ring] Playing beep', {
        frequency,
        duration,
        volume,
        waveform,
        pan,
        time: Date.now(),
      });
      const audioId = playBeepWithSpeaker(frequency, duration, volume, waveform, pan);
      debug('[Bell.ring] Beep started', { audioId, time: Date.now() });
      return audioId;
    }
  }

  /**
   * Play a sequence of tones
   *
   * The first tone plays immediately. Subsequent tones have a delay
   * before they play (default 50ms if not specified).
   *
   * @param tones - Array of tone configurations
   *
   * @example
   * ```tsx
   * // Simple two-tone notification
   * Bell.play([
   *   { frequency: 800, duration: 100 },
   *   { frequency: 600, duration: 100 },
   * ]);
   *
   * // Ascending tones with custom delays
   * Bell.play([
   *   { frequency: 400, duration: 100 },
   *   { frequency: 600, duration: 100, delay: 50 },
   *   { frequency: 800, duration: 150, delay: 50 },
   * ]);
   *
   * // Alert pattern with longer pauses
   * Bell.play([
   *   { frequency: 880, duration: 200 },
   *   { frequency: 880, duration: 200, delay: 100 },
   *   { frequency: 880, duration: 200, delay: 100 },
   * ]);
   * ```
   */
  play(tones: BellTone[]): string | undefined {
    const state = getBellState();
    debug('[Bell.play] Called', {
      time: Date.now(),
      enabled: state.enabled,
      toneCount: tones.length,
    });
    if (!state.enabled || tones.length === 0) return undefined;

    debug('[Bell.play] Starting sequence', { time: Date.now(), tones });
    return playSequenceWithSpeaker(tones);
  }

  /**
   * Ring the bell multiple times with a pattern (legacy API)
   *
   * @param pattern - Number of beeps or pattern object
   *
   * @example
   * ```tsx
   * // 3 beeps with default 100ms interval
   * Bell.beep(3);
   *
   * // Custom pattern with 200ms interval
   * Bell.beep({ count: 2, interval: 200 });
   * ```
   */
  beep(pattern: number | BellPattern): string | undefined {
    const state = getBellState();
    debug('[Bell.beep] Called', { time: Date.now(), pattern, enabled: state.enabled });
    if (!state.enabled) return undefined;

    const count = typeof pattern === 'number' ? pattern : pattern.count;
    const interval = typeof pattern === 'number' ? 100 : (pattern.interval ?? 100);

    if (count <= 0) return undefined;

    // Convert to play() format
    const tones: BellTone[] = [];
    for (let i = 0; i < count; i++) {
      tones.push({
        frequency: 800,
        duration: 150,
        delay: i === 0 ? 0 : interval,
      });
    }

    return this.play(tones);
  }

  /**
   * Cancel audio playback
   * @param audioId - Optional ID to stop specific audio, or undefined to stop all
   */
  cancel(audioId?: string): void {
    // Stop audio (specific or all)
    stopActiveSpeaker(audioId);
    if (!audioId) {
      this.stopTone();
    }
  }

  /**
   * Enable or disable bell sounds
   *
   * @param enabled - Whether bells are enabled
   */
  setEnabled(enabled: boolean): void {
    const state = getBellState();
    state.enabled = enabled;
    if (!enabled) {
      this.cancel();
    }
  }

  /**
   * Check if bells are enabled
   */
  isEnabled(): boolean {
    return getBellState().enabled;
  }

  /**
   * Play a named pattern from the registry
   *
   * @param name - Name of the registered pattern
   * @returns Audio event ID for stopping this specific audio, or undefined if pattern not found
   *
   * @example
   * ```tsx
   * Bell.playPattern('success');
   * Bell.playPattern('phone');
   * Bell.playPattern('coin');
   * ```
   */
  playPattern(name: string): string | undefined {
    const registry = getPatternRegistry();
    const pattern = registry.get(name);
    if (pattern) {
      debug('[Bell.playPattern] Playing', { name, toneCount: pattern.length });
      return this.play(pattern);
    } else {
      debug('[Bell.playPattern] Pattern not found', { name });
      return undefined;
    }
  }

  /**
   * Register a custom pattern
   *
   * @param name - Name for the pattern
   * @param tones - Array of tone configurations
   *
   * @example
   * ```tsx
   * Bell.registerPattern('myJingle', [
   *   { frequency: 440, duration: 100 },
   *   { frequency: 550, duration: 100, delay: 50 },
   *   { frequency: 660, duration: 200, delay: 50 },
   * ]);
   *
   * // Later...
   * Bell.playPattern('myJingle');
   * ```
   */
  registerPattern(name: string, tones: BellTone[]): void {
    const registry = getPatternRegistry();
    registry.set(name, tones);
    debug('[Bell.registerPattern] Registered', { name, toneCount: tones.length });
  }

  /**
   * Get list of all registered pattern names
   */
  getPatternNames(): string[] {
    return Array.from(getPatternRegistry().keys());
  }

  /**
   * Get a pattern by name (for inspection or modification)
   */
  getPattern(name: string): BellTone[] | undefined {
    return getPatternRegistry().get(name);
  }

  // Convenience methods for common patterns - all return audio ID

  /** Play alert sound (3 quick high beeps) */
  alert(): string | undefined {
    return this.playPattern('alert');
  }

  /** Play success sound (ascending two-tone) */
  success(): string | undefined {
    return this.playPattern('success');
  }

  /** Play error sound (descending harsh tone) */
  error(): string | undefined {
    return this.playPattern('error');
  }

  /** Play warning sound (alternating tones) */
  warning(): string | undefined {
    return this.playPattern('warning');
  }

  /** Play notification sound (gentle ding) */
  notification(): string | undefined {
    return this.playPattern('notification');
  }

  /** Play ding sound */
  ding(): string | undefined {
    return this.playPattern('ding');
  }

  /** Play bell sound */
  bell(): string | undefined {
    return this.playPattern('bell');
  }

  /** Play phone ring sound */
  phone(): string | undefined {
    return this.playPattern('phone');
  }

  /** Play chime sound */
  chime(): string | undefined {
    return this.playPattern('chime');
  }

  /** Play doorbell sound */
  doorbell(): string | undefined {
    return this.playPattern('doorbell');
  }

  /** Play completion sound */
  complete(): string | undefined {
    return this.playPattern('complete');
  }

  /** Play level-up sound */
  levelUp(): string | undefined {
    return this.playPattern('levelUp');
  }

  /** Play power-up sound */
  powerUp(): string | undefined {
    return this.playPattern('powerUp');
  }

  /** Play power-down sound */
  powerDown(): string | undefined {
    return this.playPattern('powerDown');
  }

  /** Play coin/collect sound */
  coin(): string | undefined {
    return this.playPattern('coin');
  }

  /** Play blip sound */
  blip(): string | undefined {
    return this.playPattern('blip');
  }
}

/**
 * Bell singleton instance
 */
export const Bell = new BellModule();

/**
 * Hook: useBell
 * React hook for bell functionality
 *
 * @returns Bell control functions
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const bell = useBell();
 *
 *   const handleError = () => {
 *     bell.error();
 *   };
 *
 *   const handleSuccess = () => {
 *     bell.success();
 *   };
 *
 *   // Custom sequence
 *   const playCustom = () => {
 *     bell.play([
 *       { frequency: 440, duration: 200 },
 *       { frequency: 880, duration: 200, delay: 100 },
 *     ]);
 *   };
 *
 *   return <Button onPress={handleSuccess}>Complete</Button>;
 * }
 * ```
 */
export function useBell() {
  return {
    // Configuration
    configure: (config: BellAudioConfig) => Bell.configure(config),
    getConfig: () => Bell.getConfig(),

    // Core methods
    ring: (options?: BellOptions) => Bell.ring(options),
    play: (tones: BellTone[]) => Bell.play(tones),
    beep: (pattern: number | BellPattern) => Bell.beep(pattern),

    // Continuous tones
    startTone: (options?: Omit<BellOptions, 'visual' | 'duration'>) => Bell.startTone(options),
    stopTone: () => Bell.stopTone(),

    // Pattern management
    playPattern: (name: string) => Bell.playPattern(name),
    registerPattern: (name: string, tones: BellTone[]) => Bell.registerPattern(name, tones),
    getPatternNames: () => Bell.getPatternNames(),
    getPattern: (name: string) => Bell.getPattern(name),

    // Preset sounds
    alert: () => Bell.alert(),
    success: () => Bell.success(),
    error: () => Bell.error(),
    warning: () => Bell.warning(),
    notification: () => Bell.notification(),
    ding: () => Bell.ding(),
    bell: () => Bell.bell(),
    phone: () => Bell.phone(),
    chime: () => Bell.chime(),
    doorbell: () => Bell.doorbell(),
    complete: () => Bell.complete(),
    levelUp: () => Bell.levelUp(),
    powerUp: () => Bell.powerUp(),
    powerDown: () => Bell.powerDown(),
    coin: () => Bell.coin(),
    blip: () => Bell.blip(),

    // Control
    cancel: (audioId?: string) => Bell.cancel(audioId),
    setEnabled: (enabled: boolean) => Bell.setEnabled(enabled),
    isEnabled: () => Bell.isEnabled(),
  };
}
