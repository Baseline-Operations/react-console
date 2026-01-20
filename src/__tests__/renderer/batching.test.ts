/**
 * Tests for render batching utilities
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  scheduleBatchedUpdate,
  flushBatchedUpdates,
  flushBatchedUpdatesSync,
  clearBatchedUpdates,
  hasBatchedUpdates,
  getBatchedUpdatesCount,
} from '../../renderer/batching';

describe('Batching', () => {
  beforeEach(() => {
    // Clear any pending updates before each test
    clearBatchedUpdates();
    vi.clearAllTimers();
  });

  describe('scheduleBatchedUpdate', () => {
    it('should queue update functions', () => {
      const fn1 = vi.fn();
      const fn2 = vi.fn();

      scheduleBatchedUpdate(fn1);
      scheduleBatchedUpdate(fn2);

      expect(hasBatchedUpdates()).toBe(true);
      expect(getBatchedUpdatesCount()).toBe(2);
      expect(fn1).not.toHaveBeenCalled();
      expect(fn2).not.toHaveBeenCalled();
    });

    it('should batch multiple rapid updates', () => {
      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      scheduleBatchedUpdate(fn1);
      scheduleBatchedUpdate(fn2);
      scheduleBatchedUpdate(fn3);

      expect(getBatchedUpdatesCount()).toBe(3);
    });
  });

  describe('flushBatchedUpdates', () => {
    it('should execute all queued updates', () => {
      const fn1 = vi.fn();
      const fn2 = vi.fn();

      scheduleBatchedUpdate(fn1);
      scheduleBatchedUpdate(fn2);

      flushBatchedUpdates();

      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn2).toHaveBeenCalledTimes(1);
      expect(hasBatchedUpdates()).toBe(false);
    });

    it('should execute updates in order', () => {
      const calls: number[] = [];

      scheduleBatchedUpdate(() => calls.push(1));
      scheduleBatchedUpdate(() => calls.push(2));
      scheduleBatchedUpdate(() => calls.push(3));

      flushBatchedUpdates();

      expect(calls).toEqual([1, 2, 3]);
    });

    it('should handle empty queue', () => {
      expect(() => flushBatchedUpdates()).not.toThrow();
      expect(hasBatchedUpdates()).toBe(false);
    });

    it('should continue executing even if one update throws', () => {
      const fn1 = vi.fn(() => {
        throw new Error('Test error');
      });
      const fn2 = vi.fn();

      scheduleBatchedUpdate(fn1);
      scheduleBatchedUpdate(fn2);

      // Should not throw, but log error
      expect(() => flushBatchedUpdates()).not.toThrow();
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn2).toHaveBeenCalledTimes(1);
    });
  });

  describe('flushBatchedUpdatesSync', () => {
    it('should execute updates synchronously', () => {
      const fn1 = vi.fn();
      const fn2 = vi.fn();

      scheduleBatchedUpdate(fn1);
      scheduleBatchedUpdate(fn2);

      flushBatchedUpdatesSync();

      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn2).toHaveBeenCalledTimes(1);
      expect(hasBatchedUpdates()).toBe(false);
    });
  });

  describe('clearBatchedUpdates', () => {
    it('should clear all queued updates without executing', () => {
      const fn1 = vi.fn();
      const fn2 = vi.fn();

      scheduleBatchedUpdate(fn1);
      scheduleBatchedUpdate(fn2);

      clearBatchedUpdates();

      expect(hasBatchedUpdates()).toBe(false);
      expect(fn1).not.toHaveBeenCalled();
      expect(fn2).not.toHaveBeenCalled();
    });
  });

  describe('hasBatchedUpdates', () => {
    it('should return false when queue is empty', () => {
      expect(hasBatchedUpdates()).toBe(false);
    });

    it('should return true when updates are queued', () => {
      scheduleBatchedUpdate(() => {});
      expect(hasBatchedUpdates()).toBe(true);
    });

    it('should return false after flushing', () => {
      scheduleBatchedUpdate(() => {});
      flushBatchedUpdatesSync();
      expect(hasBatchedUpdates()).toBe(false);
    });
  });

  describe('getBatchedUpdatesCount', () => {
    it('should return 0 when queue is empty', () => {
      expect(getBatchedUpdatesCount()).toBe(0);
    });

    it('should return correct count of queued updates', () => {
      scheduleBatchedUpdate(() => {});
      expect(getBatchedUpdatesCount()).toBe(1);

      scheduleBatchedUpdate(() => {});
      scheduleBatchedUpdate(() => {});
      expect(getBatchedUpdatesCount()).toBe(3);
    });
  });
});
