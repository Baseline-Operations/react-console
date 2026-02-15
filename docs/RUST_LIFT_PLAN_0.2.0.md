# Rust Lift Plan — 0.2.0

> **Scope**: Planning for v0.2.0. Post-0.2.0 follow-ups are tracked in the main roadmap (`TODO_ROADMAP.md`). This document covers the 0.2.0 Rust lift only.
>
> **Version planning & todos**: The canonical todo list is in [TODO_ROADMAP.md](./TODO_ROADMAP.md). All RUST-\* items are in patch versions **v0.1.5–v0.1.11**: **v0.1.5** (addon skeleton, build), **v0.1.6** (buffer & output), **v0.1.7** (storage), **v0.1.8** (bell), **v0.1.10** (wcwidth, graphics research, advanced terminal), **v0.1.11** (graphics/sound exploration). **v0.2.0** is final cleanup, documentation verification, and release only — no new Rust or feature work. Use the roadmap for tracking completion; this document is the design and reference.

---

## 1. Overview

Move performance-critical and capability-rich paths **entirely to Rust** for the areas that use it: buffer, compositing, ANSI, display flush, storage, and audio. There is **no TypeScript fallback** for those areas — the native addon is required for the render/output path, storage backend, and sound. React, reconciler, HostConfig, and layout stay in TypeScript; they call into the addon. Distribution must ship prebuilt binaries for all supported platforms so users do not need a Rust toolchain.

**Goals**

- **Buffer & output**: Cell buffer, compositing, ANSI generation, display buffer (diff + flush) implemented only in Rust; TS orchestrates and feeds data.
- **Storage**: Single Rust-backed storage API with multiple backends — **memory (default)**, file (encrypted), and keychain/credential store; all options in the addon.
- **Sound**: Bell and sound in Rust — terminal BEL when needed, plus PCM/speaker for tones and patterns; explore advanced (WAV, streams, etc.) where useful.
- **Graphics**: Explore terminal graphics (Sixel, Kitty, iTerm2) and **pixel-based graphics mode** where possible; document what is feasible vs. exploration-only.

**Non-goals for v0.2.0**

- Rewriting React, reconciler, or HostConfig in Rust.
- Keeping a TS implementation of buffer/display/storage/bell for fallback; those areas are Rust-only.

---

## 2. What Is Rust-Only (No Fallback)

| Area               | Responsibility                                              | TS role                                                        |
| ------------------ | ----------------------------------------------------------- | -------------------------------------------------------------- |
| **Cell buffer**    | 2D cell grid, get/set/fill/clear/resize, dirty regions      | Layout/node tree; calls addon to create buffer and write cells |
| **Compositing**    | Merge layers by z-index into one buffer                     | Layer creation, node→layer mapping; calls addon to composite   |
| **Display buffer** | Current/pending buffers, diff, flush full, flush diff to fd | Tells addon when to flush; passes composite result             |
| **ANSI**           | Cell→ANSI, transition codes, color parsing                  | Style resolution only; addon does encoding                     |
| **Storage**        | All backends: memory (default), file, keychain              | Same public API; addon is the only implementation              |
| **Bell / sound**   | Terminal BEL, PCM tones/patterns, optional advanced audio   | Same public API; addon is the only implementation              |

**Implications**

- Prebuilds are **required** for every supported platform/arch; no "optional native" path.
- If the addon fails to load (wrong arch, broken binary), the library **fails fast** with a clear error (e.g. "React Console native addon failed to load; ensure prebuilds are installed for your platform") rather than falling back to TS.
- Supported platforms must be clearly documented (e.g. Windows x64/arm64, macOS x64/arm64, Linux x64/arm64).

---

## 3. Phases and Deliverables

### 3.1 Phase 1 — Buffer & output (Rust-only)

| Area           | Deliverable                                                                                                |
| -------------- | ---------------------------------------------------------------------------------------------------------- |
| Addon skeleton | napi-rs crate, build, load at startup; no fallback — abort or throw if load fails.                         |
| Cell buffer    | Width×height grid, Cell struct, get_cell/set_cell, fill_region, clear, resize, dirty regions.              |
| ANSI           | Cell→ANSI string, transition optimization, hex/rgb/named color parsing.                                    |
| Compositing    | Merge layers (by z-index) into one buffer; accept layer buffers from TS.                                   |
| Display buffer | Current/pending, get_diff, flush (full), flush_diff; write to fd (e.g. stdout).                            |
| TS integration | Render path creates/uses Rust buffer, calls composite, then flush; no TS implementation of buffer/display. |

**Data boundary**

- Buffers live in Rust. TS sends incremental updates or batched cell data; avoid passing full Cell[][] every frame.

**Deliverables**

- [ ] **RUST-1.1** — napi-rs addon skeleton; load required; clear error if load fails (no fallback).
- [ ] **RUST-1.2** — Cell buffer in Rust (grid, get/set/fill/clear/resize, dirty regions).
- [ ] **RUST-1.3** — ANSI generation in Rust (cell→ANSI, transition codes, color parsing).
- [ ] **RUST-1.4** — Compositing in Rust (layers → single buffer).
- [ ] **RUST-1.5** — Display buffer in Rust (current/pending, diff, flush full, flush diff to fd).
- [ ] **RUST-1.6** — TS integration: render path uses only Rust buffer/composite/flush; remove or stub TS buffer/display code for this path.

---

### 3.2 Phase 2 — Advanced terminal features

Implement in the addon where they fit; TS consumes via options or query results.

| Feature                           | Addon role                                                                                             |
| --------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Terminal capability queries**   | DECRQSS, DA (CSI c / CSI ? … c); parse replies; expose cursor style, SGR, terminal type, colors to TS. |
| **Synchronized output**           | DEC 2026/2027 (or DCS); addon sends sync sequence for full redraw when enabled.                        |
| **Cursor style (DECSCUSR)**       | CSI Ps SP q; addon sets cursor style when requested by TS.                                             |
| **Dynamic palette (OSC 4/10/11)** | Query/set default fg/bg and palette; optional; expose to TS for theming.                               |
| **REP**                           | Use CSI Ps b in ANSI path for long runs of same character.                                             |
| **Selective erase**               | DECSED/DECSEL when TS requests "erase by attribute".                                                   |
| **Unicode width (wcwidth)**       | Expose wcwidth/wcswidth for TS layout/measurement.                                                     |

**Deliverables**

- [ ] **RUST-2.1** — DA/DECRQSS parsing; expose capability flags and cursor/style state to TS.
- [ ] **RUST-2.2** — Synchronized output for full redraws when enabled.
- [ ] **RUST-2.3** — DECSCUSR, REP; optional OSC 4/10/11 get/set.
- [ ] **RUST-2.4** — wcwidth/wcswidth export for TS layout.
- [ ] **RUST-2.5** — Document advanced features and how to enable them (e.g. render options).

---

### 3.3 Phase 3 — Storage (all options in Rust, default memory)

Storage is **Rust-only**; one API with multiple backends. **Default backend: memory** (no file). No TS implementation of storage for these backends.

| Backend      | Description                                                                                                                                               | When to use                                                                |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **memory**   | In-process key-value store with TTL; no file, no disk. **Default.**                                                                                       | Session-only, no persistence; no files created.                            |
| **file**     | Single encrypted file (AES-256-GCM), app-namespaced, same semantics as current TS storage; path configurable.                                             | Persistent storage; creates `storage.enc` (or user path) when data exists. |
| **keychain** | System credential store (macOS Keychain, Windows Credential Manager, Linux Secret Service) via e.g. `keyring` crate. No app-owned file for these entries. | Secrets only; keys stored as credential entries.                           |

**API shape (TS-facing)**

- `initializeStorage({ backend: 'memory' | 'file' | 'keychain', ... })` — backend selection; default `backend: 'memory'`.
- Same methods as today: `getItem`, `setItem`, `removeItem`, `clear`, `keys`, `hasItem`, TTL, appId/namespace.
- For **keychain**, key names map to credential identifiers; values are secret strings (e.g. tokens). Optional: hybrid — "normal" keys in memory/file, "secret" keys in keychain via naming or option.

**Deliverables**

- [ ] **RUST-3.1** — Storage in Rust: memory backend (default), in-memory KV + TTL, app namespace; no file created.
- [ ] **RUST-3.2** — File backend in addon: encrypted file, same format/semantics as current TS; path from options or env.
- [ ] **RUST-3.3** — Keychain backend in addon: `keyring` (or equivalent) for secrets; expose as storage backend or dedicated API (e.g. `storage.setSecret(key, value)`).
- [ ] **RUST-3.4** — TS storage API: all calls go to addon only; remove current TS file-based implementation (or keep only as legacy migration if needed).
- [ ] **RUST-3.5** — Document backends: default memory, when to use file/keychain, path and env vars.

---

### 3.4 Phase 4 — Bell and sound (Rust-only, explore advanced)

Bell and sound are **Rust-only**; TS keeps the same public API (Bell, useBell, etc.) but implementation lives in the addon.

**Current behavior (TS)**

- Terminal bell (ASCII BEL `\u0007`) when speaker unavailable.
- Optional `@mastra/node-speaker`: PCM playback for tones (frequency, duration, waveform, volume, pan), sequences, patterns (e.g. success, error, doorbell).

**Rust implementation**

- **Terminal bell**: Emit BEL to stdout when requested (e.g. when "speaker" is disabled or as fallback).
- **PCM / tones**: Generate and play tone sequences in Rust (e.g. `rodio`, `cpal`, or raw write to system audio). Match current behavior: frequency, duration, waveform (sine, square, triangle), volume, pan; support sequences and patterns.
- **Advanced sound (exploration)**:
  - Play WAV (or other format) from buffer or path.
  - Optional: streamed audio, background music, or more complex mixing — document as "exploration" and implement only if feasible without scope creep.

**Deliverables**

- [ ] **RUST-4.1** — Bell in Rust: terminal BEL emission; integrate with display flush (e.g. append BEL when requested, same as current DisplayBuffer logic).
- [ ] **RUST-4.2** — PCM tones in Rust: generate and play tones (frequency, duration, waveform, volume, pan); match current Bell.ring / Bell.play semantics.
- [ ] **RUST-4.3** — Patterns and sequences in Rust: play lists of tones; built-in patterns (success, error, bell, etc.) and registerPattern/playPattern equivalent.
- [ ] **RUST-4.4** — TS Bell API: all implementation in addon; remove or stub TS Bell implementation (and optional `@mastra/node-speaker` dependency for this path).
- [ ] **RUST-4.5** — Exploration: document and, if feasible, implement one "advanced" option (e.g. WAV playback from buffer); otherwise document as future/roadmap.

---

### 3.5 Phase 5 — Graphics and advanced design (exploration)

Explore terminal graphics and **pixel-based graphics mode**; implement only what is clearly useful and feasible; treat the rest as research for the roadmap.

**Terminal graphics protocols**

| Protocol   | Description                                                                                 | Pixel-level?                                     |
| ---------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **Sixel**  | DEC; six-pixel vertical units; palette-based; widely supported (xterm, foot, iTerm2, etc.). | Cell-aligned blocks; not arbitrary pixel coords. |
| **Kitty**  | Chunked base64 RGBA/PNG; placement above/below text; alpha; many modern terminals.          | **Yes** — individual pixel positions supported.  |
| **iTerm2** | OSC 1337; inline images; base64; some terminals.                                            | Image placement; protocol-specific.              |

**Pixel-based graphics mode**

- **Kitty** supports pixel-level positioning (coordinates) and RGBA data; suitable for "pixel canvas" style output (e.g. plots, simple games). Feasible in principle.
- **Sixel** is character-grid aligned (six pixels per column); not free pixel coords but still "raster graphics."
- **Exploration**: Addon can expose (e.g.) "draw image at pixel (x,y)" or "draw raw RGBA block" that emits Kitty (and optionally Sixel) sequences; detect terminal support via DA/capability query and enable only when supported. If unimplementable in 0.2.0, document as exploration and leave for roadmap.

**Deliverables**

- [ ] **RUST-5.1** — Research: document Kitty vs Sixel vs iTerm2 for "advanced design" (images, icons, decorations); document pixel-based mode (Kitty) and any limitations.
- [ ] **RUST-5.2** — Exploration: if feasible, add minimal "graphics" API in addon (e.g. place image/block at pixel or cell position using Kitty or Sixel); otherwise document as "not in 0.2.0, roadmap."
- [ ] **RUST-5.3** — Document findings: what is in scope for 0.2.0 vs. post-0.2.0 (e.g. pixel canvas, image components).

---

### 3.6 Phase 6 — Build and distribution

- **No fallback**: Addon must load for buffer/display/storage/bell; prebuilds required for all supported platforms.
- **Tooling**: napi-rs, `crate-type = ["cdylib"]`, N-API only.
- **Platforms**: Windows (x64, arm64), macOS (x64, arm64), Linux (x64, arm64) as baseline.
- **CI**: Build addon on every PR/main; tests run with addon (no "without addon" mode for those areas).
- **Docs**: List supported platforms; state that unsupported platforms will get a clear load failure (no TS fallback).

**Deliverables**

- [ ] **RUST-6.1** — Crate layout (e.g. `native/` or `packages/react-console-native`); build and link from main package.
- [ ] **RUST-6.2** — Prebuild pipeline (e.g. GitHub Actions) for all supported platforms/arches; publish or ship so installs get correct binary.
- [ ] **RUST-6.3** — TS loader: require addon at startup; on failure, throw with clear message (no fallback).
- [ ] **RUST-6.4** — Document supported platforms and "no fallback" in README/contributing.

---

## 4. Todos summary (0.2.0)

| ID       | Task                                                              | Phase |
| -------- | ----------------------------------------------------------------- | ----- |
| RUST-1.1 | napi-rs addon skeleton; load required; fail clearly if load fails | 1     |
| RUST-1.2 | Cell buffer in Rust                                               | 1     |
| RUST-1.3 | ANSI generation in Rust                                           | 1     |
| RUST-1.4 | Compositing in Rust                                               | 1     |
| RUST-1.5 | Display buffer + diff + flush in Rust                             | 1     |
| RUST-1.6 | TS integration; remove TS buffer/display for this path            | 1     |
| RUST-2.1 | DA/DECRQSS parsing; expose capabilities to TS                     | 2     |
| RUST-2.2 | Synchronized output                                               | 2     |
| RUST-2.3 | DECSCUSR, REP; optional OSC 4/10/11                               | 2     |
| RUST-2.4 | wcwidth/wcswidth for TS layout                                    | 2     |
| RUST-2.5 | Document advanced terminal features                               | 2     |
| RUST-3.1 | Storage: memory backend (default), no file                        | 3     |
| RUST-3.2 | Storage: file backend (encrypted)                                 | 3     |
| RUST-3.3 | Storage: keychain backend for secrets                             | 3     |
| RUST-3.4 | TS storage API → addon only; remove TS storage impl               | 3     |
| RUST-3.5 | Document storage backends (default memory)                        | 3     |
| RUST-4.1 | Bell: terminal BEL in Rust                                        | 4     |
| RUST-4.2 | Bell: PCM tones in Rust                                           | 4     |
| RUST-4.3 | Bell: patterns/sequences in Rust                                  | 4     |
| RUST-4.4 | TS Bell API → addon only; remove TS Bell impl                     | 4     |
| RUST-4.5 | Exploration: advanced sound (e.g. WAV)                            | 4     |
| RUST-5.1 | Research: graphics protocols, pixel mode                          | 5     |
| RUST-5.2 | Exploration: minimal graphics API or defer                        | 5     |
| RUST-5.3 | Document graphics/pixel findings                                  | 5     |
| RUST-6.1 | Crate layout and build                                            | 6     |
| RUST-6.2 | Prebuild pipeline (all supported platforms)                       | 6     |
| RUST-6.3 | TS loader: require addon, no fallback                             | 6     |
| RUST-6.4 | Document supported platforms, no fallback                         | 6     |

---

## 5. Post-0.2.0 (roadmap only)

Track in `TODO_ROADMAP.md` when scheduling:

- Further terminal features (BiDi, XTHIMOUSE, title stack, ConPTY options).
- Partial/dirty-region-only flush in Rust.
- Advanced sound (streaming, more formats) if only explored in 0.2.0.
- Full graphics/pixel API if only explored in 0.2.0.
- Benchmarks and performance budgets.

---

## 6. References

- xterm ctlseqs, terminal-wg BiDi, OSC 133, DECSCUSR, REP, DECRQSS, DA, synchronized output, wcwidth.
- Storage: current `utils/storage.ts`; Rust: keyring, redb/sled for file; memory = in-process only.
- Sound: current `apis/Bell.ts`, `@mastra/node-speaker`; Rust: rodio, cpal, or raw PCM.
- Graphics: Kitty graphics protocol (pixel positions), Sixel, iTerm2 inline images.
- napi-rs: https://napi.rs/ ; keyring: https://docs.rs/keyring/ ; Kitty: https://sw.kovidgoyal.net/kitty/graphics-protocol/
