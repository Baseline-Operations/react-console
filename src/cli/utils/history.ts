/**
 * Command history system
 * Tracks command history for interactive CLI applications
 */

/**
 * History entry
 */
export interface HistoryEntry {
  /** Command path */
  command: string[];
  /** Parsed arguments */
  args: {
    options: Record<string, string | number | boolean | string[]>;
    params: (string | number | boolean)[];
  };
  /** Timestamp */
  timestamp: number;
}

/**
 * Command history manager
 */
class CommandHistory {
  private history: HistoryEntry[] = [];
  private maxSize: number = 100;
  private currentIndex: number = -1;

  /**
   * Set maximum history size
   */
  setMaxSize(size: number): void {
    this.maxSize = size;
    // Trim history if needed
    if (this.history.length > this.maxSize) {
      this.history = this.history.slice(-this.maxSize);
    }
  }

  /**
   * Add entry to history
   */
  add(
    command: string[],
    args: {
      options: Record<string, string | number | boolean | string[]>;
      params: (string | number | boolean)[];
    }
  ): void {
    const entry: HistoryEntry = {
      command: [...command],
      args: {
        options: { ...args.options },
        params: [...args.params],
      },
      timestamp: Date.now(),
    };

    this.history.push(entry);
    this.currentIndex = this.history.length - 1;

    // Trim history if exceeds max size
    if (this.history.length > this.maxSize) {
      this.history = this.history.slice(-this.maxSize);
      this.currentIndex = this.history.length - 1;
    }
  }

  /**
   * Get previous entry (for up arrow)
   */
  getPrevious(): HistoryEntry | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.history[this.currentIndex]!;
    }
    if (this.currentIndex === 0) {
      return this.history[0]!;
    }
    return null;
  }

  /**
   * Get next entry (for down arrow)
   */
  getNext(): HistoryEntry | null {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return this.history[this.currentIndex]!;
    }
    return null;
  }

  /**
   * Get all history entries
   */
  getAll(): HistoryEntry[] {
    return [...this.history];
  }

  /**
   * Get history entries matching a pattern
   */
  search(pattern: string): HistoryEntry[] {
    const lowerPattern = pattern.toLowerCase();
    return this.history.filter((entry) => {
      const cmdStr = entry.command.join(' ').toLowerCase();
      return cmdStr.includes(lowerPattern);
    });
  }

  /**
   * Clear history
   */
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  /**
   * Get current index
   */
  getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * Reset navigation index (to end of history)
   */
  resetIndex(): void {
    this.currentIndex = this.history.length - 1;
  }
}

/**
 * Global command history instance
 */
export const commandHistory = new CommandHistory();

/**
 * Add command to history
 *
 * @param command - Command path
 * @param args - Parsed arguments
 */
export function addToHistory(
  command: string[],
  args: {
    options: Record<string, string | number | boolean | string[]>;
    params: (string | number | boolean)[];
  }
): void {
  commandHistory.add(command, args);
}

/**
 * Get previous command from history
 */
export function getPreviousCommand(): HistoryEntry | null {
  return commandHistory.getPrevious();
}

/**
 * Get next command from history
 */
export function getNextCommand(): HistoryEntry | null {
  return commandHistory.getNext();
}

/**
 * Get all history entries
 */
export function getAllHistory(): HistoryEntry[] {
  return commandHistory.getAll();
}

/**
 * Search history
 */
export function searchHistory(pattern: string): HistoryEntry[] {
  return commandHistory.search(pattern);
}

/**
 * Clear history
 */
export function clearHistory(): void {
  commandHistory.clear();
}

/**
 * Set maximum history size
 */
export function setHistoryMaxSize(size: number): void {
  commandHistory.setMaxSize(size);
}

/**
 * Reset history navigation index
 */
export function resetHistoryIndex(): void {
  commandHistory.resetIndex();
}
