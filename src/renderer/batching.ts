/**
 * Render batching utilities
 * Prevents flicker by batching multiple rapid updates into a single render
 */

let updateQueue: (() => void)[] = [];
let isScheduled = false;
let batchTimeoutId: ReturnType<typeof setTimeout> | null = null;

/**
 * Schedule a batched update
 * Queues an update function to be executed in the next batch
 *
 * @param updateFn - Function to execute as part of the batch
 *
 * @example
 * ```ts
 * scheduleBatchedUpdate(() => {
 *   // Update state or trigger render
 * });
 * ```
 */
export function scheduleBatchedUpdate(updateFn: () => void): void {
  updateQueue.push(updateFn);

  if (!isScheduled) {
    isScheduled = true;

    // Use setImmediate for batching (runs after current event loop)
    // This ensures all synchronous updates in the same tick are batched together
    if (typeof setImmediate !== 'undefined') {
      const immediateId = setImmediate(flushBatchedUpdates);
      batchTimeoutId = immediateId as unknown as ReturnType<typeof setTimeout>;
    } else {
      batchTimeoutId = setTimeout(flushBatchedUpdates, 0);
    }
  }
}

/**
 * Flush all batched updates
 * Executes all queued update functions and then clears the queue
 */
export function flushBatchedUpdates(): void {
  if (updateQueue.length === 0) {
    isScheduled = false;
    return;
  }

  // Create a copy of the queue and clear it
  const queue = updateQueue.slice();
  updateQueue = [];
  isScheduled = false;

  if (batchTimeoutId !== null) {
    // Both setImmediate and setTimeout IDs can be cleared with clearTimeout
    if (typeof clearImmediate !== 'undefined') {
      try {
        clearImmediate(batchTimeoutId as unknown as ReturnType<typeof setImmediate>);
      } catch {
        clearTimeout(batchTimeoutId);
      }
    } else {
      clearTimeout(batchTimeoutId);
    }
    batchTimeoutId = null;
  }

  // Execute all queued updates
  for (const updateFn of queue) {
    try {
      updateFn();
    } catch (error) {
      // Error handling - log but don't stop other updates
      console.error('Error in batched update:', error);
    }
  }
}

/**
 * Immediately flush batched updates (synchronously)
 * Useful when you need to ensure updates are applied before proceeding
 *
 * @example
 * ```ts
 * scheduleBatchedUpdate(update1);
 * scheduleBatchedUpdate(update2);
 * flushBatchedUpdatesSync(); // Executes both updates now
 * ```
 */
export function flushBatchedUpdatesSync(): void {
  if (updateQueue.length === 0) {
    isScheduled = false;
    return;
  }

  // Cancel any pending async flush
  if (batchTimeoutId !== null) {
    // Both setImmediate and setTimeout IDs can be cleared with clearTimeout
    if (typeof clearImmediate !== 'undefined') {
      try {
        clearImmediate(batchTimeoutId as unknown as ReturnType<typeof setImmediate>);
      } catch {
        clearTimeout(batchTimeoutId);
      }
    } else {
      clearTimeout(batchTimeoutId);
    }
    batchTimeoutId = null;
  }

  // Execute all queued updates synchronously
  const queue = updateQueue.slice();
  updateQueue = [];
  isScheduled = false;

  for (const updateFn of queue) {
    try {
      updateFn();
    } catch (error) {
      // Error handling - log but don't stop other updates
      console.error('Error in batched update:', error);
    }
  }
}

/**
 * Clear all pending batched updates without executing them
 * Useful for cleanup or when you want to cancel pending updates
 */
export function clearBatchedUpdates(): void {
  updateQueue = [];
  isScheduled = false;

  if (batchTimeoutId !== null) {
    // Both setImmediate and setTimeout IDs can be cleared with clearTimeout
    if (typeof clearImmediate !== 'undefined') {
      try {
        clearImmediate(batchTimeoutId as unknown as ReturnType<typeof setImmediate>);
      } catch {
        clearTimeout(batchTimeoutId);
      }
    } else {
      clearTimeout(batchTimeoutId);
    }
    batchTimeoutId = null;
  }
}

/**
 * Check if there are pending batched updates
 *
 * @returns True if there are updates waiting to be flushed
 */
export function hasBatchedUpdates(): boolean {
  return updateQueue.length > 0;
}

/**
 * Get the number of pending batched updates
 *
 * @returns Number of queued updates
 */
export function getBatchedUpdatesCount(): number {
  return updateQueue.length;
}
