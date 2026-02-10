# Bell Sound Debug Tracking

## Problem

Bell sounds play SLOWLY when idle, but play at CORRECT SPEED when user presses tab DURING the bell sequence (not instantly - human timing, ~200-500ms after starting).

## Key Observations

1. User presses tab AFTER bells start (human delay)
2. After tab press, remaining bells play at correct speed
3. This suggests tab press CHANGES something that persists and affects subsequent bells

## What Happens When Tab Is Pressed (Library Flow)

1. stdin 'data' event fires
2. Input handler in RenderEntry.ts runs
3. `flushSyncReactUpdates()` called
4. `handleTabNavigation()` called - CHANGES FOCUS STATE (visual change)
5. `scheduleUpdate()` called (uses scheduleBatchedUpdate -> setImmediate)
6. Input callback returns
7. setImmediate fires
8. `performRender()` runs
9. Since focus CHANGED, there ARE visual diffs
10. `flushDiff()` or `flush()` writes LOTS of data to terminal

## What Happens When Bell Fires

1. setTimeout callback fires
2. `Bell.ring()` runs
3. Bell is queued, renderCallback called
4. performRender runs (sync or async depending on current implementation)
5. NO visual changes
6. flushDiff writes only bell character (small amount of data)

## Approaches TRIED (and failed)

### Direct stdout writes

- [x] `process.stdout.write('\u0007')` - didn't work
- [x] `fs.writeSync(1, '\u0007')` - no sound
- [x] `process.stderr.write('\u0007')` - no sound

### Flushing attempts

- [x] `process.stdout.cork()` / `uncork()` - didn't work
- [x] `fs.fsyncSync(1)` - didn't work

### Escape sequences after bell

- [x] Cursor save/restore `\x1b7...\x1b8` - didn't work
- [x] Cursor position query `\x1b[6n` - caused input parsing errors
- [x] Large invisible sequences - didn't work

### Timing/scheduling changes

- [x] `setImmediate` for render callback - didn't work
- [x] `process.nextTick` for render callback - didn't work
- [x] Synchronous `performRender()` call - didn't work (JUST TRIED)

### stdin manipulation

- [x] `process.stdin.pause()` / `resume()` - didn't work
- [x] `process.stdin.emit('data', '')` - caused input errors
- [x] `process.stdin.read(0)` - didn't work

### Render system changes

- [x] Queue bells in render output via `consumePendingBells()` - implemented
- [x] Fixed `flushDiff()` to check for pending bells - implemented
- [x] Write bells with cursor save/restore in flushDiff - current state

## Key Difference to Investigate

When tab is pressed:

- Focus state CHANGES
- Render writes LOTS of data (hundreds/thousands of bytes)
- Terminal receives substantial output

When bell fires:

- NO state changes
- Render writes very little data (just bell + maybe cursor save/restore)
- Terminal receives minimal output

## Hypothesis

The terminal might be buffering small writes and only processing when:

1. A certain amount of data is received
2. There's bidirectional I/O activity (input received)
3. Some terminal-specific flush condition is met

## Next Steps to Try

- [ ] Force a visual change when bell fires (toggle hidden character?)
- [ ] Write more substantial data with the bell (not just escape sequences)
- [ ] Investigate terminal synchronization protocols (DEC private modes)
- [ ] Check if scheduling the NEXT bell's setTimeout needs different timing
- [ ] Look at how the render differs between first render and subsequent renders

## Current Attempt (based on user insight)

User insight: "simulate steps 3-10 within a timeout that shouldn't be instant"
User insight 2: "Maybe it needs to add a character somewhere, then remove it"

Current approach:

1. Bell.ring() writes bell char immediately via process.stdout.write('\u0007')
2. Then triggers renderCallback
3. renderCallback waits 10ms (non-instant delay)
4. Then does what tab handler does:
   - flushSyncReactUpdates()
   - getInteractiveComponents + applyFocusState
   - scheduleUpdate()
5. In flushDiff, if bells but no visual changes:
   - Toggle a space/dot in bottom-right corner
   - This creates a fake diff
   - Forces actual output to terminal (not just bell char)
   - NOTE: flushDiff is NEVER called in interactive mode (always fullRedraw)
6. MOVED toggle logic to flush() instead:
   - When bells pending, toggle char in pending buffer
   - Regenerate last line with toggled char
   - Rebuild output with updated content
   - This makes actual screen content different each bell

7. KEY INSIGHT: Bell was written BEFORE render, but tab flow writes AFTER
   - Changed Bell.ring() to ONLY queue bell (not write immediately)
   - Bell char now written as part of render output
   - renderCallback now does immediate component/focus setup (like input handler)
   - Then scheduleUpdate after 10ms delay
   - USER FEEDBACK: Bell should be written before (reverted)

8. Tried: stdout.write callback - DIDN'T WORK (already tried before)

9. Tried: Multiple rapid renders - DIDN'T WORK

## IMPORTANT: NOT RELEVANT (stop investigating these)

- Mouse handling - NOT THE ISSUE
- stdin/stdout mechanics - NOT THE ISSUE
- Direct writes vs queued writes - tried both, neither works
- /dev/tty writes - TRIED, didn't help (it's not HOW we output)

## What we KNOW:

1. User clicks button, bells start (SLOW)
2. User presses TAB ~300-500ms later (HUMAN timing, not instant)
3. After TAB, bells are FAST
4. Something PERSISTS after TAB
5. CODE TIMING IS CORRECT - logs show ~100ms between bell writes in ALL cases
6. Terminal has "activity mode" - processes output immediately after user input

## Log Analysis (2026-02-05):

Test 1 (no fast Enter, supposedly slow):

- Bell 1: 53890, Bell 2: 53999 (109ms), Bell 3: 54099 (100ms)

Test 3 (fast Enter, supposedly works):

- Bell 1: 56091, Bell 2: 56199 (108ms), Bell 3: 56300 (101ms)

IDENTICAL TIMING! But Test 3 came 46ms after previous Enter (terminal "warm").
Test 1 came 2 seconds after previous activity (terminal "cold").

## What TAB does that's unique:

1. flushSyncReactUpdates() - flushes React batched updates, does sync reconciler update
2. handleTabNavigation() - CHANGES FOCUS STATE
3. Updates terminal.focusedNodeId
4. Render happens with ACTUAL VISUAL DIFFS (focus indicator moved)

## More Attempts TRIED (and failed):

### DSR-triggered bells (2026-02-05)

- [x] Queue bells, wait for DSR response, then render - didn't work
- [x] setImmediate in onDsrResponse to defer render - didn't work
- [x] Write to /dev/tty directly - NOT THE ISSUE (it's order, not output method)

## ORDER OF OPERATIONS comparison:

TAB path:

1. stdin event fires
2. SYNCHRONOUS: flushSyncReactUpdates() - substantial work
3. SYNCHRONOUS: handleTabNavigation() - focus state changes
4. scheduleUpdate (setImmediate)
5. stdin handler returns
6. setImmediate fires -> render with visual changes

BELL/DSR path (current):

1. timer fires, DSR sent
2. stdin event (DSR response)
3. onDsrResponse: queues bells, setImmediate for render
4. stdin handler returns (almost immediately - minimal work)
5. setImmediate fires -> render

KEY DIFFERENCE: TAB does substantial SYNCHRONOUS work during stdin handler.
BELL/DSR returns almost immediately with minimal synchronous work.

## Attempts (continued):

### flushSyncReactUpdates in DSR handler (2026-02-05)

- [x] Added setBellFlushSyncCallback()
- [x] onDsrResponse calls flushSyncReactUpdates() synchronously during stdin handling
- [x] Then uses setImmediate for render (like TAB's scheduleUpdate)
- RESULT: Didn't work

### Synchronous renderCallback (no setImmediate) (2026-02-05)

- [x] Changed onDsrResponse to call renderCallback directly, not via setImmediate
- [x] Bell should now be written DURING stdin handler, not after
- RESULT: Didn't work

### Write ALL bells immediately (2026-02-05)

- [x] Changed beep() to queue ALL bells at once (not one at a time via timers)
- [x] All 3 bells written in single stream.write during initial Enter press
- [x] Output size: 410 bytes (vs 395 without bells)
- [x] Added cursor save/restore between bells for spacing
- RESULT: Didn't work - still slow without keypress

## Key observation from latest log:

```text
676284: First Enter
676286: beep(3) - queues all 3 bells
676292: flush writes 410 bytes with 3 bells
676422: Second Enter (138ms later)
```

Even writing ALL bells immediately during user input doesn't help.
The terminal appears to rate-limit bell characters regardless of when/how they're written.

## Hypotheses:

1. **Terminal has minimum bell interval**: macOS Terminal.app might enforce a minimum
   time between audible bells regardless of input timing. Multiple \x07 in quick
   succession get coalesced into fewer sounds.

2. **Sound vs character processing**: The terminal receives and processes the bell
   CHARACTERS immediately, but the SOUND generation is on a separate queue that
   has rate limiting.

3. **User input "unblocks" audio**: When user presses a key, it might flush or
   prioritize the terminal's audio queue.

### Spawn child process (2026-02-05)

- [x] Used `spawnSync('printf', ['\\a'])` to bypass Node.js stdout entirely
- [x] Child process writes bell directly to inherited stdout
- RESULT: Didn't work (also violates "it's not HOW we output" rule)

## What we KNOW for certain:

1. Code timing is IDENTICAL in slow vs fast cases (~100ms intervals)
2. HOW we write the bell doesn't matter (stdout, fs, /dev/tty, child process)
3. Terminal processes bell CHARACTERS immediately (we can see in logs)
4. Terminal AUDIO playback is delayed/rate-limited when "idle"
5. User keypress (Tab/Enter) makes audio play at correct speed
6. DSR responses don't count as "real" user input to terminal
7. The difference is in the TERMINAL's behavior, not our code
8. **SCREEN REFRESH DOES NOT HELP** - even with real visual changes (focus cycling)
9. **ONLY ACTUAL KEYBOARD INPUT speeds up bells**

## CRITICAL FINDING (2026-02-05):

Tried cycling focus when bell fires (same visual changes as TAB):

- Focus indicator VISIBLY MOVED on screen
- Real UI changes, not just escape sequences
- **RESULT: Did NOT speed up bells**
- BUT: pressing keyboard AFTER still sped them up
- **CONCLUSION: It's specifically KEYBOARD INPUT that matters, not screen activity**

The terminal must have audio processing specifically tied to keyboard input events
at the OS/terminal level - not just "activity" or "screen changes".

## SOLUTION FOUND (2026-02-05):

- [x] Use node-speaker library instead of terminal bell - **THIS WORKS!**
- Speaker package plays audio directly through system audio
- Bypasses terminal bell entirely, so not affected by terminal rate limiting
- Required `createRequire(import.meta.url)` for ESM compatibility
- Required adding 'speaker' to rollup external dependencies

## New Bell API:

- `Bell.ring({ frequency, duration, volume })` - single tone with customization
- `Bell.play([...tones])` - chain of tones with delays between them
- `Bell.beep(count)` - legacy API, now uses play() internally
- Preset sounds: `alert()`, `success()`, `error()`, `warning()`, `notification()`
