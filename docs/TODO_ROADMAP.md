# React Console - Feature Roadmap & TODO

> **Document Purpose**: Track planned features, research notes, implementation details, and completion status. Update this document as work progresses.

---

## Audit Summary (v0.1.3) ✅ COMPLETE

**Completed**: February 3, 2026

### Key Findings

| Area              | Status       | Summary                                          |
| ----------------- | ------------ | ------------------------------------------------ |
| API Surface       | ✅ Excellent | Consistent naming, good organization, RN-aligned |
| Components        | ✅ Good      | 30+ components, few gaps identified              |
| Code Organization | ✅ Good      | Logical structure, no major issues               |
| Documentation     | ✅ Good      | Comprehensive guides, missing testing docs       |
| Existing Features | ✅ Good      | Many utilities exist, some need hook wrappers    |

### New Items Added to Roadmap

Based on audit findings:

- **2.3** Divider component
- **2.4** TouchableOpacity/TouchableHighlight aliases
- **3.3** Link component (terminal hyperlinks)
- **3.4** Code component (syntax highlighting)

### Items Confirmed Already Exist (Don't Reimplement)

- debounce, throttle, useDebounce
- onAppStart, onAppExit
- enterRawMode, exitRawMode
- Full storage system with hooks

### Items to Enhance (Not Rewrite)

- Exit handling (add confirmation, async cleanup)
- Color utilities (export internals, add manipulation)
- Terminal I/O (wrap in React hooks)

### Bug Fixes Required (v0.1.3) ✅ COMPLETE

| Bug                                               | Severity | Status   | Fix Applied                        |
| ------------------------------------------------- | -------- | -------- | ---------------------------------- |
| ESM examples use `require.main === module`        | Medium   | ✅ Fixed | Removed conditional check          |
| `useAsyncWithFallback` wraps `use()` in try/catch | High     | ✅ Fixed | Redesigned with useState/useEffect |
| bell.tsx buttons don't work                       | Medium   | ✅ Fixed | Added `mode: 'interactive'`        |
| borderTop/borderRight/etc props missing           | Medium   | ✅ Fixed | Added props and style handling     |

---

## Bug Fixes (v0.1.3)

### BF-1: ESM Compatibility in Examples

**Priority**: Medium  
**Status**: [x] Complete

**Problem**: Examples use `require.main === module` which is a CommonJS pattern that doesn't work in ESM context. The package has `"type": "module"` so all `.tsx` files are treated as ESM.

**Error**:

```text
ReferenceError: require is not defined in ES module scope
```

**Files Affected** (10 files):

- `examples/cli/basic-cli.tsx`
- `examples/cli/commands-with-params.tsx`
- `examples/cli/help-customization.tsx`
- `examples/cli/mixed-mode.tsx`
- `examples/cli/nested-commands.tsx`
- `examples/cli/path-based-commands.tsx`
- `examples/cli/routes-only.tsx`
- `examples/cli/single-component.tsx`
- `examples/animations.tsx`
- `examples/slide-animations.tsx`

**Solution Options**:

1. **Remove the check entirely** (Recommended for examples):

   ```tsx
   // Before
   if (require.main === module) {
     render(<App />, { mode: 'interactive' });
   }

   // After - just run directly
   render(<App />, { mode: 'interactive' });
   ```

2. **Use ESM pattern** (If conditional execution needed):

   ```tsx
   import { fileURLToPath } from 'url';

   if (process.argv[1] === fileURLToPath(import.meta.url)) {
     render(<App />, { mode: 'interactive' });
   }
   ```

**Tasks**:

- [x] Update all 10 affected example files
- [x] Test each example runs correctly
- [x] Consider adding ESM utility helper if pattern is common

---

### BF-2: `useAsyncWithFallback` Hook Misuse of `use()`

**Priority**: High  
**Status**: [x] Complete

**Problem**: The `useAsyncWithFallback` hook wraps React 19's `use()` in a try/catch block, which is not allowed. The `use()` hook throws promises for Suspense to catch - wrapping it in try/catch prevents Suspense from working.

**Warning**:

```text
`use` was called from inside a try/catch block. This is not allowed and can lead to unexpected behavior.
```

**File**: `src/hooks/async.ts`

**Current Implementation**:

```typescript
export function useAsyncWithFallback<T>(promise: Promise<T>, fallback: T): T {
  try {
    return use(promise);
  } catch {
    return fallback;
  }
}
```

**Solution Options**:

1. **Deprecate and remove** - Users should use Suspense + ErrorBoundary:

   ```tsx
   <ErrorBoundary fallback={<FallbackComponent />}>
     <Suspense fallback={<Loading />}>
       <AsyncComponent />
     </Suspense>
   </ErrorBoundary>
   ```

2. **Redesign using state** - Don't use `use()`, manage promise state manually:

   ```typescript
   export function useAsyncWithFallback<T>(promise: Promise<T>, fallback: T): T {
     const [result, setResult] = useState<T>(fallback);
     const [, setError] = useState<Error | null>(null);

     useEffect(() => {
       let cancelled = false;
       promise
         .then((value) => {
           if (!cancelled) setResult(value);
         })
         .catch((err) => {
           if (!cancelled) setError(err);
         });
       return () => {
         cancelled = true;
       };
     }, [promise]);

     return result;
   }
   ```

3. **Keep `use()` but document requirement** - Require ErrorBoundary wrapper:
   ```typescript
   /**
    * @requires Must be wrapped in ErrorBoundary for fallback behavior
    */
   export function useAsyncWithFallback<T>(promise: Promise<T>, _fallback: T): T {
     return use(promise);
   }
   ```

**Recommended**: Option 2 - Redesign using state for true fallback behavior without requiring Suspense/ErrorBoundary.

**Tasks**:

- [x] Decide on solution approach
- [x] Implement fix
- [x] Update example in `state-hooks.tsx`
- [x] Add/update tests
- [x] Update documentation

---

## Status Legend

- [ ] Not started
- [~] In progress
- [x] Completed
- [!] Blocked/Needs discussion

---

## 1. Audits & Assessment

> **IMPORTANT**: Complete these audits FIRST before implementing new features. Audit findings may add items to this roadmap, reveal existing capabilities that don't need reimplementation, or identify areas that need restructuring before new work begins.

### 1.1 API Surface Audit

**Priority**: High (do first)  
**Status**: [x] Complete

Review and assess the current public API for consistency, completeness, and React Native alignment.

**Areas Audited**:

- [x] Component naming consistency
- [x] Prop naming patterns (React Native alignment)
- [x] Hook naming conventions
- [x] Export organization
- [x] TypeScript type exports
- [x] Deprecated API cleanup

**Naming Conventions Check**:

| Pattern               | Status  | Notes                               |
| --------------------- | ------- | ----------------------------------- |
| Components PascalCase | ✅ Good | All components follow PascalCase    |
| Hooks use\*           | ✅ Good | All hooks follow use\* pattern      |
| Event handlers on\*   | ✅ Good | onPress, onChangeText, etc.         |
| Boolean props         | ✅ Good | disabled, editable, etc.            |
| Style props           | ✅ Good | backgroundColor, textAlign match RN |

**Export Organization**:

| Entry Point       | Purpose                        | Status            |
| ----------------- | ------------------------------ | ----------------- |
| Main (`index.ts`) | Core components, utilities     | ✅ Well organized |
| `/cli`            | CLI framework                  | ✅ Good           |
| `/router`         | Routing (alias for CLI router) | ✅ Good           |
| `/selection`      | Selection components           | ✅ Good           |
| `/layout`         | Layout components              | ✅ Good           |
| `/animations`     | Animation system               | ✅ Good           |
| `/theme`          | Theme system                   | ✅ Good           |
| `/storage`        | Storage system                 | ✅ Good           |
| `/hooks`          | Advanced hooks                 | ✅ Good           |
| `/apis`           | React Native APIs              | ✅ Good           |

**Issues Found**:

| Issue                                     | Severity | Action                            |
| ----------------------------------------- | -------- | --------------------------------- |
| `Newline` deprecated but still exported   | Low      | Document migration to `LineBreak` |
| `textTransform` missing from TextStyle    | Medium   | Add to roadmap (3.1)              |
| No `Spacer` component                     | Medium   | Already in roadmap (2.1)          |
| No `Divider` component                    | Low      | Add to roadmap                    |
| `Input` exported as alias for `TextInput` | Info     | Keep for convenience              |

**Findings Summary**:

1. **Naming conventions**: Excellent - consistent throughout
2. **Type exports**: Good - types exported alongside components
3. **Organization**: Excellent - logical entry points
4. **React Native alignment**: Good - APIs match RN patterns
5. **Deprecated APIs**: `Newline` should be removed in future major version

**New Items Added to Roadmap**:

- Add `Divider` component to section 2 (Layout Components)

---

### 1.2 Component Completeness Audit

**Priority**: High (do first)  
**Status**: [x] Complete

Assess current component coverage against React Native core and terminal-specific needs.

**React Native Core Components Checklist**:

| Component            | Status | Location                    | Quality                     |
| -------------------- | ------ | --------------------------- | --------------------------- |
| View                 | ✅     | `primitives/View.tsx`       | Good - alias for Box        |
| Box                  | ✅     | `primitives/Box.tsx`        | Good - primary container    |
| Text                 | ✅     | `primitives/Text.tsx`       | Good - supports nested Text |
| Image                | ❌     | Not implemented             | Planned (8.1)               |
| TextInput            | ✅     | `interactive/TextInput.tsx` | Good - full RN API          |
| ScrollView           | ✅     | `layout/ScrollView.tsx`     | Good                        |
| FlatList             | ✅     | `data/FlatList.tsx`         | Good - full RN API          |
| SectionList          | ✅     | `data/SectionList.tsx`      | Good - full RN API          |
| Button               | ✅     | `interactive/Button.tsx`    | Good                        |
| Pressable            | ✅     | `interactive/Pressable.tsx` | Good - state styles         |
| Switch               | ✅     | `interactive/Switch.tsx`    | Good - RN compatible        |
| Modal                | ✅     | `layout/Modal.tsx`          | Good - includes Overlay     |
| ActivityIndicator    | ✅     | `ui/ActivityIndicator.tsx`  | Good - multiple styles      |
| ProgressBar          | ✅     | `ui/ProgressBar.tsx`        | Good                        |
| StatusBar            | N/A    | Not applicable to terminal  | -                           |
| SafeAreaView         | N/A    | Not applicable              | -                           |
| KeyboardAvoidingView | N/A    | Not applicable              | -                           |
| TouchableOpacity     | ❌     | Not implemented             | Add as Pressable alias      |
| TouchableHighlight   | ❌     | Not implemented             | Add as Pressable alias      |

**Additional Components Found**:

| Component     | Location                    | Purpose                        |
| ------------- | --------------------------- | ------------------------------ |
| LineBreak     | `primitives/LineBreak.tsx`  | Line break                     |
| Newline       | `primitives/Newline.tsx`    | Deprecated alias for LineBreak |
| Focusable     | `interactive/Focusable.tsx` | Make content focusable         |
| Prompt        | `interactive/Prompt.tsx`    | Input prompts                  |
| Row           | `layout/Row.tsx`            | Horizontal flex container      |
| Column        | `layout/Column.tsx`         | Vertical flex container        |
| Scrollable    | `layout/Scrollable.tsx`     | Base scrollable                |
| Radio         | `selection/Radio.tsx`       | Radio selection                |
| Checkbox      | `selection/Checkbox.tsx`    | Checkbox selection             |
| Dropdown      | `selection/Dropdown.tsx`    | Dropdown selection             |
| List          | `selection/List.tsx`        | List selection                 |
| Table         | `data/Table.tsx`            | Table (needs enhancement)      |
| Form          | `Form.tsx`                  | Form wrapper                   |
| ErrorBoundary | `ErrorBoundary.tsx`         | Error handling                 |
| Suspense      | `Suspense.tsx`              | Async boundaries               |
| Animated      | `Animated.tsx`              | Animation wrapper              |

**Terminal-Specific Components Assessment**:

| Component | Exists? | Status               | Action                               |
| --------- | ------- | -------------------- | ------------------------------------ |
| Spacer    | ❌      | Not implemented      | Planned (2.1)                        |
| Divider   | ❌      | Not implemented      | Add to roadmap                       |
| Table     | ⚠️      | Basic implementation | Enhance (9.1)                        |
| Section   | ❌      | Not implemented      | Planned (9.2)                        |
| Link      | ❌      | Not implemented      | Add to roadmap (terminal hyperlinks) |
| Code      | ❌      | Not implemented      | Add to roadmap (syntax highlighting) |
| Console   | ❌      | Not implemented      | Planned (5.1)                        |

**Quality Assessment**:

| Category    | Rating     | Notes                |
| ----------- | ---------- | -------------------- |
| Primitives  | ⭐⭐⭐⭐⭐ | Solid, well-typed    |
| Interactive | ⭐⭐⭐⭐⭐ | Full event support   |
| Layout      | ⭐⭐⭐⭐   | Good, missing Spacer |
| Selection   | ⭐⭐⭐⭐⭐ | Complete set         |
| Data        | ⭐⭐⭐⭐   | Table needs work     |
| UI          | ⭐⭐⭐⭐⭐ | Good indicators      |

**New Items Added to Roadmap**:

- Add `TouchableOpacity` and `TouchableHighlight` as Pressable aliases
- Add `Divider` component
- Add `Link` component (terminal hyperlinks)
- Add `Code` component (syntax highlighting) - lower priority

---

### 1.3 Code Organization Audit

**Priority**: High (do first)  
**Status**: [x] Complete

Review code organization before adding new features to ensure proper placement.

**Current Structure Assessment**:

```text
src/
├── __tests__/      # ✅ Good - E2E and integration tests
├── apis/           # ✅ Good - Platform APIs (AppState, Clipboard, etc.)
├── buffer/         # ✅ Good - Multi-buffer rendering system
├── cli/            # ✅ Good - CLI framework (well-organized subdirs)
├── components/     # ✅ Good - Logical subdirectories
│   ├── data/       # FlatList, SectionList, Table
│   ├── interactive/# Button, TextInput, Pressable, etc.
│   ├── layout/     # Modal, Row, Column, ScrollView
│   ├── primitives/ # Box, Text, View, LineBreak
│   ├── selection/  # Radio, Checkbox, Dropdown, List
│   └── ui/         # ActivityIndicator, ProgressBar
├── context/        # ✅ Good - React contexts
├── hooks/          # ✅ Good - Custom hooks by category
├── layout/         # ✅ Good - Layout engine (BoxModel, LayoutEngine)
├── nodes/          # ✅ Good - Node types for reconciler
├── renderer/       # ✅ Good - Core renderer, ANSI, batching
├── style/          # ✅ Good - Style system with mixins
├── theme/          # ✅ Good - Theme system
├── tree/           # ✅ Good - Component tree management
├── types/          # ✅ Good - TypeScript types (well-split)
└── utils/          # ⚠️ Review - Many utilities (25+ files)
```

**Directory Assessment**:

| Directory   | Rating    | Notes                         |
| ----------- | --------- | ----------------------------- |
| apis/       | ✅ Good   | Clear purpose, well-organized |
| buffer/     | ✅ Good   | Has own tests, self-contained |
| cli/        | ✅ Good   | Complex but well-structured   |
| components/ | ✅ Good   | Logical categorization        |
| context/    | ✅ Good   | Standard React pattern        |
| hooks/      | ✅ Good   | Organized by purpose          |
| layout/     | ✅ Good   | Core layout engine            |
| nodes/      | ✅ Good   | Mirrors component structure   |
| renderer/   | ✅ Good   | Core rendering logic          |
| style/      | ✅ Good   | Mixin-based architecture      |
| theme/      | ✅ Good   | Complete theme system         |
| tree/       | ✅ Good   | Has own tests                 |
| types/      | ✅ Good   | Well-split by category        |
| utils/      | ⚠️ Review | Could benefit from grouping   |

**Utils Directory Analysis** (25 files):

| Category   | Files                                       | Recommendation       |
| ---------- | ------------------------------------------- | -------------------- |
| Terminal   | terminal.ts, console.ts, mouse.ts           | Could group          |
| Text       | measure.ts, formatting.ts                   | Could group          |
| Validation | validation.ts, inputValidator.ts            | Keep separate        |
| Debug      | debug.ts, layoutDebug.ts                    | Could group          |
| Style      | StyleSheet.ts, className.ts, stateStyles.ts | Could move to style/ |
| Other      | storage.ts, debounce.ts, refs.ts, etc.      | Keep in utils        |

**Barrel Export Consistency**: ✅ Good

- All entry points have index.ts files
- Types exported alongside implementations
- Clear public API

**New Feature Placement Guide**:

| Feature                      | Location                               |
| ---------------------------- | -------------------------------------- |
| Spacer                       | `components/layout/Spacer.tsx`         |
| Divider                      | `components/layout/Divider.tsx`        |
| Console                      | `components/ui/Console.tsx`            |
| Image                        | `components/media/Image.tsx` (new dir) |
| Link                         | `components/primitives/Link.tsx`       |
| Code                         | `components/primitives/Code.tsx`       |
| useStdin/useStdout/useStderr | `hooks/streams.ts` (new file)          |
| useConsole                   | `hooks/console.ts` (new file)          |
| useHotkeys                   | `hooks/hotkeys.ts` (new file)          |
| Testing utilities            | `testing/` (new top-level dir)         |

**Issues Found**:

- utils/ has many files but organization is acceptable
- No major restructuring needed

**Recommendation**: Structure is solid. Minor utils reorganization optional. No blockers for new features.

---

### 1.4 Documentation Audit

**Priority**: Medium  
**Status**: [x] Complete

Assess current documentation completeness and quality.

**Documentation Inventory**:

| Document                | Size      | Quality    | Notes                         |
| ----------------------- | --------- | ---------- | ----------------------------- |
| README.md               | Good      | ⭐⭐⭐⭐⭐ | Comprehensive, well-organized |
| docs/api/               | 158 files | ⭐⭐⭐⭐   | TypeDoc generated, complete   |
| CLI_FRAMEWORK_GUIDE.md  | 9KB       | ⭐⭐⭐⭐⭐ | Detailed with examples        |
| CLI_SCAFFOLDING.md      | 6KB       | ⭐⭐⭐⭐   | Good scaffolding guide        |
| STYLING_GUIDE.md        | 15KB      | ⭐⭐⭐⭐⭐ | Very thorough                 |
| LAYOUT_GUIDE.md         | 11KB      | ⭐⭐⭐⭐⭐ | Flexbox/grid coverage         |
| EVENT_HANDLING_GUIDE.md | 15KB      | ⭐⭐⭐⭐⭐ | Comprehensive                 |
| INPUT_HANDLING_GUIDE.md | 15KB      | ⭐⭐⭐⭐⭐ | Detailed input docs           |
| ANIMATIONS_GUIDE.md     | 8KB       | ⭐⭐⭐⭐   | Good animation coverage       |
| STATE_MANAGEMENT.md     | 14KB      | ⭐⭐⭐⭐⭐ | React 19 hooks covered        |
| MIGRATION_GUIDE.md      | 10KB      | ⭐⭐⭐⭐   | From other libraries          |
| PERFORMANCE_GUIDE.md    | 12KB      | ⭐⭐⭐⭐   | Optimization tips             |
| STYLE_LIBRARIES.md      | 9KB       | ⭐⭐⭐⭐   | className support             |

**Missing Documentation**:

| Document            | Priority | Notes                   |
| ------------------- | -------- | ----------------------- |
| Testing Guide       | High     | No testing docs yet     |
| Troubleshooting     | Medium   | Common issues/solutions |
| Cookbook/Recipes    | Medium   | Common patterns         |
| Accessibility Guide | Medium   | When implemented        |
| API Quick Reference | Low      | Cheat sheet format      |

**Documentation Quality Summary**:

- ✅ **Excellent**: Core guides (Styling, Layout, Events, Input)
- ✅ **Good**: Framework guides (CLI, Animations, Performance)
- ✅ **Good**: API reference (TypeDoc generated)
- ❌ **Missing**: Testing guide (critical for v0.2.0)
- ❌ **Missing**: Troubleshooting guide

**Documentation to Create for v0.2.0**:

1. Testing Guide (when testing utilities implemented)
2. Troubleshooting Guide
3. Update existing docs with new features

---

### 1.5 Existing Feature Verification

**Priority**: High (do first)  
**Status**: [x] Complete

Before implementing new features, verify what already exists to avoid duplicate work.

**Features Verification Results**:

| Feature              | Planned | Exists?     | Details                                                 |
| -------------------- | ------- | ----------- | ------------------------------------------------------- |
| Text transforms      | 3.1     | ❌ No       | `textTransform` NOT in TextStyle - needs implementation |
| Nested Text (inline) | 3.2     | ⚠️ Untested | Code structure supports it - needs verification         |
| Stdin raw mode       | 4.1     | ✅ Partial  | `enterRawMode`/`exitRawMode` exist - needs hook wrapper |
| Stdout access        | 4.2     | ✅ Partial  | `getTerminalDimensions` exists - needs hook wrapper     |
| Console patching     | 5.1     | ❌ No       | No existing implementation                              |
| DevTools             | 6.1     | ❌ No       | No `injectIntoDevTools` call found                      |
| Keyboard shortcuts   | 12.1    | ❌ No       | Basic Ctrl+key mapping only, no shortcut system         |
| Exit handling        | 12.2    | ✅ Partial  | `onAppExit` exists, SIGINT handlers exist               |
| Color utilities      | 12.4    | ✅ Internal | `parseColor`, `hexToRgb` exist but internal             |
| Debounce/throttle    | -       | ✅ Yes      | Full implementation + `useDebounce` hook                |
| Storage              | -       | ✅ Yes      | Full storage system with hooks                          |

**Already Exists - Don't Reimplement**:

| Feature           | Location             | Export Status |
| ----------------- | -------------------- | ------------- |
| debounce          | `utils/debounce.ts`  | ✅ Exported   |
| debounceImmediate | `utils/debounce.ts`  | ✅ Exported   |
| throttle          | `utils/debounce.ts`  | ✅ Exported   |
| useDebounce       | `hooks/utility.ts`   | ✅ Exported   |
| onAppStart        | `hooks/lifecycle.ts` | ✅ Exported   |
| onAppExit         | `hooks/lifecycle.ts` | ✅ Exported   |
| enterRawMode      | `utils/terminal.ts`  | ✅ Exported   |
| exitRawMode       | `utils/terminal.ts`  | ✅ Exported   |
| storage API       | `utils/storage.ts`   | ✅ Exported   |
| useStorage        | `hooks/storage.ts`   | ✅ Exported   |

**Partially Exists - Enhance**:

| Feature       | Current State           | Enhancement Needed              |
| ------------- | ----------------------- | ------------------------------- |
| Exit handling | Basic SIGINT handlers   | Add confirmation, async cleanup |
| Color parsing | Internal functions only | Export and add manipulation     |
| Terminal I/O  | Raw utilities           | Wrap in React hooks             |

**Doesn't Exist - Implement**:

| Feature            | Priority | Notes                      |
| ------------------ | -------- | -------------------------- |
| textTransform      | Medium   | Add to TextStyle type      |
| Console capture    | Medium   | New feature                |
| DevTools           | Medium   | Add reconciler integration |
| Hotkeys system     | Medium   | New feature                |
| Color manipulation | Low      | lighten, darken, etc.      |
| Testing utilities  | High     | New testing/ directory     |

**Roadmap Updates Based on Findings**:

- 4.1-4.3: Can leverage existing utilities, just need hook wrappers
- 12.2: Enhance existing onAppExit, don't rewrite
- 12.4: Export existing internal functions + add manipulation

---

### 1.6 Gap Analysis for Terminal UI Library

**Priority**: High (do first)  
**Status**: [x] Complete

Identify missing features that a comprehensive terminal UI library should have.

**Categories Evaluated**:

| Category       | Expected Features                   | Current Status | Gaps                        |
| -------------- | ----------------------------------- | -------------- | --------------------------- |
| **Input**      | Keyboard, Mouse                     | ✅ Complete    | None                        |
| **Output**     | Text, Colors, ANSI, Unicode         | ✅ Complete    | Images missing              |
| **Layout**     | Flexbox, Grid, Absolute, Responsive | ✅ Complete    | Spacer missing              |
| **State**      | React state, Context, Storage       | ✅ Complete    | None                        |
| **Navigation** | Focus, Tab order, Routes            | ✅ Complete    | None                        |
| **Feedback**   | Loading, Progress, Alerts           | ⚠️ Partial     | Notifications/Toast missing |
| **Data**       | Lists, Tables, Forms                | ⚠️ Partial     | Table needs enhancement     |
| **Dev Tools**  | Debugging, Testing                  | ⚠️ Partial     | Testing utilities missing   |
| **Platform**   | Detection, Capabilities             | ✅ Complete    | None                        |

**Identified Gaps**:

| Gap                  | Category  | Priority | Roadmap Section |
| -------------------- | --------- | -------- | --------------- |
| Spacer component     | Layout    | High     | 2.1             |
| Divider component    | Layout    | Medium   | NEW             |
| textTransform        | Styling   | Medium   | 3.1             |
| Image component      | Media     | Medium   | 8.1             |
| Table enhancement    | Data      | Medium   | 9.1             |
| Section component    | Data      | Medium   | 9.2             |
| Testing utilities    | Dev Tools | High     | 10.1            |
| Console capture      | Dev Tools | Medium   | 5.1             |
| DevTools integration | Dev Tools | Medium   | 6.1             |
| Hotkeys system       | Input     | Medium   | 12.1            |
| Notifications/Toast  | Feedback  | Medium   | 12.3            |
| Link component       | Output    | Low      | NEW             |
| Code component       | Output    | Low      | NEW             |

**Common Patterns Not Yet Supported**:

| Pattern              | Description                 | Priority                |
| -------------------- | --------------------------- | ----------------------- |
| Confirmation dialogs | "Are you sure?" with Yes/No | Low (Alert can do this) |
| Wizards/Steps        | Multi-step forms            | Low (can compose)       |
| Tree view            | Hierarchical data           | Low                     |
| Tabs                 | Tab navigation UI           | Low                     |
| Breadcrumbs          | Navigation breadcrumbs      | Low                     |

**React Native API Gaps**:

| API        | Status     | Notes                        |
| ---------- | ---------- | ---------------------------- |
| Linking    | 📋 Planned | Section 3.3 - Link component |
| Share      | N/A        | Not applicable               |
| Vibration  | N/A        | Use Bell instead             |
| PixelRatio | N/A        | Not applicable               |
| Appearance | ✅ Have    | useColorScheme exists        |

**Additional Opportunities Identified**:

| Feature                | Priority | Notes                                  |
| ---------------------- | -------- | -------------------------------------- |
| TextInput autocomplete | Medium   | CLI has it, general TextInput doesn't  |
| Progress with ETA      | Low      | Enhance ProgressBar with time estimate |
| openApp utility        | Low      | Expose `open` package's app opening    |
| revealFile utility     | Low      | Show file in Finder/Explorer           |

**New Items Added to Roadmap**:

1. Add Divider component (section 2)
2. Add Link component (uses `open` package for browser opening)
3. Add Code component (syntax highlighting) - lower priority
4. Add TouchableOpacity/TouchableHighlight aliases

**Summary**: Core functionality is solid. Main gaps are in developer tooling (testing, DevTools) and some convenience components (Spacer, Divider, notifications). These are all already planned in the roadmap.

---

## 2. Layout Components

### 2.1 `<Spacer>` Component

> **Audit Finding**: Confirmed missing - no Spacer component exists.

**Priority**: High  
**Status**: [x] Complete

A flexible spacing component that expands to fill available space in flex containers. Essential for common layout patterns like pushing items to opposite ends.

**Proposed API**:

```tsx
// Fills all available space
<Spacer />

// Fixed width/height spacer
<Spacer width={10} />
<Spacer height={5} />

// Flex-based sizing
<Spacer flex={1} />
<Spacer flex={2} /> // Takes 2x the space of flex={1}
```

**Implementation Notes**:

- Create `src/components/layout/Spacer.tsx`
- Should work with the existing flexbox layout engine
- When no props provided, defaults to `flex: 1`
- When `width` or `height` provided, renders as fixed-size empty box
- Can be used horizontally in `Row` or vertically in `Column`
- Should not render any visible content, just occupy space

**Example Use Cases**:

```tsx
// Push button to right
<Row>
  <Text>Title</Text>
  <Spacer />
  <Button label="Action" />
</Row>

// Even spacing between items
<Row>
  <Text>Left</Text>
  <Spacer />
  <Text>Center</Text>
  <Spacer />
  <Text>Right</Text>
</Row>

// Vertical spacing in column
<Column>
  <Text>Header</Text>
  <Spacer height={2} />
  <Text>Content</Text>
  <Spacer />
  <Text>Footer</Text>
</Column>
```

**Tasks**:

- [x] Create component file with TypeScript types
- [x] Implement flex-based spacing logic
- [x] Add fixed width/height support
- [x] Export from `src/components/layout/index.ts`
- [x] Export from main index and layout entry point
- [ ] Add unit tests
- [ ] Add example file `examples/spacer.tsx`
- [ ] Update documentation

---

### 2.2 `<Newline>` / `<LineBreak>` Multiple Lines Prop

**Priority**: Medium  
**Status**: [x] Complete

Enhance the existing `LineBreak` component to support adding multiple line breaks with a single prop.

**Current Implementation** (`src/components/primitives/LineBreak.tsx`):

```tsx
export function LineBreak() {
  return createConsoleNode('newline', {});
}
```

**Proposed API**:

```tsx
// Current (unchanged)
<LineBreak />

// New: Multiple lines
<LineBreak count={3} />
<LineBreak lines={3} />  // Alias for count

// Shorthand
<Newline count={2} />
```

**Implementation Notes**:

- Modify `LineBreak` and `Newline` components to accept `count` prop
- When `count > 1`, render multiple newline nodes or handle in renderer
- Option A: Return array of newline nodes (simpler)
- Option B: Add `count` property to newline node type for renderer to handle (more efficient)
- Recommend Option B for large counts to avoid creating many nodes

**Tasks**:

- [x] Update `LineBreakProps` interface with `count?: number`
- [x] Implement rendering logic for multiple lines
- [x] Update `Newline` component (deprecated but maintain parity)
- [x] Update renderer to handle `count` on newline nodes
- [ ] Add tests for edge cases (count=0, negative, undefined)
- [ ] Update documentation

---

### 2.3 `<Divider>` Component

> **Audit Finding**: Identified as missing during gap analysis.

**Priority**: Medium  
**Status**: [x] Complete

A horizontal or vertical line separator for visual grouping.

**Proposed API**:

```tsx
// Horizontal divider (default)
<Divider />

// Vertical divider
<Divider orientation="vertical" />

// Styled divider
<Divider
  style="dashed"    // 'solid' | 'dashed' | 'dotted' | 'double'
  color="gray"
  thickness={1}
  margin={1}
/>

// With label
<Divider label="OR" />
```

**Implementation Notes**:

- Create `src/components/layout/Divider.tsx`
- Default to horizontal, full-width
- Support vertical for use in Row layouts
- Use box-drawing characters for styles

**Tasks**:

- [x] Create component file with TypeScript types
- [x] Implement horizontal divider
- [x] Implement vertical divider
- [x] Add style variants (solid, dashed, dotted, double)
- [x] Add label support
- [x] Export from layout entry point
- [ ] Add unit tests
- [ ] Add example
- [ ] Update documentation

---

### 2.4 `<TouchableOpacity>` / `<TouchableHighlight>` Aliases

> **Audit Finding**: Missing for React Native compatibility.

**Priority**: Low  
**Status**: [x] Complete

Add React Native compatibility aliases for Pressable.

**Implementation**:

```tsx
// Simple re-exports with appropriate defaults
export const TouchableOpacity = Pressable;
export const TouchableHighlight = Pressable;
```

**Tasks**:

- [x] Add re-exports in components/interactive/
- [x] Export from main index
- [ ] Document as aliases for Pressable

---

## 3. Text Components & Styling

### 3.1 Verify `<Text>` Transform Capabilities

**Priority**: Medium  
**Status**: [ ] Not started

> **Note**: Audit 1.5 should verify if this already exists before implementation.

Confirm that the `Text` component can handle all text transformations that would be expected from a dedicated Transform component.

**Transformations to Support**:

| Transform       | Current Support | Implementation                             |
| --------------- | --------------- | ------------------------------------------ |
| Uppercase       | Via style prop? | `textTransform: 'uppercase'`               |
| Lowercase       | Via style prop? | `textTransform: 'lowercase'`               |
| Capitalize      | Via style prop? | `textTransform: 'capitalize'`              |
| Custom function | No              | `transform={(text) => text.toUpperCase()}` |

**Research Tasks**:

- [ ] Audit current `TextStyle` type for transform support
- [ ] Check renderer handling of text transformations
- [ ] Determine if `textTransform` style prop exists
- [ ] Evaluate if custom transform function is needed

**Implementation (if needed)**:

```tsx
interface TextProps {
  // Existing props...
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  // Or function-based:
  transform?: (text: string) => string;
}
```

**Tasks**:

- [ ] Audit existing Text component capabilities
- [ ] Add `textTransform` to `TextStyle` if missing
- [ ] Implement in renderer text processing
- [ ] Consider adding `transform` function prop for custom transforms
- [ ] Add examples demonstrating all transforms
- [ ] Document capabilities

---

### 3.2 Inline Text Styling Component

**Priority**: High  
**Status**: [ ] Not started

> **Note**: Audit 1.5 should verify if nested Text already works correctly.

React Native allows nested `<Text>` for inline styling. Verify this works correctly and determine the appropriate component naming for inline vs block text behavior.

**Display Behavior Distinction**:

| Component       | Display Behavior      | Use Case                           |
| --------------- | --------------------- | ---------------------------------- |
| `<Text>`        | Block-level (default) | Standalone text blocks, paragraphs |
| Nested `<Text>` | Inline                | Styling portions within text       |

**Current Pattern** (should already work per React Native):

```tsx
<Text>
  Normal text with{' '}
  <Text bold color="cyan">
    highlighted
  </Text>{' '}
  content
</Text>
```

**Naming Consideration**:

React Native does **not** have a `<Span>` component - it relies on nested `<Text>` for inline styling. The question is whether to:

1. **Follow React Native strictly**: Document that nested `<Text>` is inherently inline (no new component)
2. **Add semantic alias**: Create an alias that communicates inline intent

If we add an alias, consider naming options:

| Name          | Pros                       | Cons                       |
| ------------- | -------------------------- | -------------------------- |
| `Span`        | Familiar to web developers | Not React Native naming    |
| `InlineText`  | Descriptive, clear intent  | Verbose                    |
| Nested `Text` | React Native pattern       | May confuse web developers |

**Research Tasks**:

- [ ] Verify nested Text rendering works correctly (block parent, inline children)
- [ ] Check if inline styles merge properly with parent
- [ ] Verify ANSI codes are properly nested/reset
- [ ] Confirm Text at root level renders as block (newline after)
- [ ] Confirm nested Text renders inline (no newline)

**Implementation Notes**:

- If nested Text already works correctly, may just need documentation
- If adding alias: decide if it's a simple re-export or has `display: inline` forced
- Consider StyleSheet support: `{ display: 'inline' }` vs `{ display: 'block' }`

**Proposed Implementation (if alias needed)**:

```tsx
// Option A: Simple alias (relies on context detection)
export const InlineText = Text;

// Option B: Wrapper with forced inline (more explicit)
export function InlineText(props: TextProps) {
  return <Text {...props} style={[{ display: 'inline' }, props.style]} />;
}
```

**Tasks**:

- [ ] Test nested Text scenarios thoroughly
- [ ] Verify block vs inline behavior based on nesting context
- [ ] Fix any issues with nested text rendering
- [ ] Decide on naming (Span vs InlineText vs documentation-only)
- [ ] Implement component if needed
- [ ] Export from primitives
- [ ] Document inline styling patterns with clear examples

---

### 3.3 `<Link>` Component (Openable URLs)

> **Audit Finding**: Identified as missing during gap analysis.

**Priority**: Low  
**Status**: [ ] Not started

Display clickable URLs using OSC 8 terminal hyperlinks (primary) with `open` package fallback.

**Key Design Decision**:

Links should be clickable in **static apps** too, not just interactive ones. OSC 8 terminal hyperlinks enable this - the terminal handles the click, no keyboard interaction needed. For terminals without OSC 8 support, fall back to the `open` package (requires interactive mode).

**Proposed API**:

```tsx
// Basic link - uses OSC 8 (clickable in static output on supported terminals)
<Link href="https://example.com">Click here</Link>

// With custom styling
<Link href="https://example.com" style={{ color: 'cyan', underline: true }}>
  Visit website
</Link>

// Custom fallback handler (instead of open package)
<Link
  href="https://example.com"
  fallback={(url) => console.log('Custom fallback:', url)}
>
  Custom fallback
</Link>

// Disable fallback - OSC 8 only (link won't work in unsupported terminals)
<Link href="https://example.com" fallback={false}>
  OSC 8 only
</Link>

// Force open package (skip OSC 8, always require keypress)
<Link href="https://example.com" fallback="always">
  Always use open package
</Link>

// Show URL inline for accessibility
<Link href="https://example.com" showUrl />
// Renders: "Click here (https://example.com)"
```

**Implementation Approach**:

1. **Primary - OSC 8**: Always emit OSC 8 escape sequences for terminal-native hyperlinks

   ```text
   \x1b]8;;URL\x07TEXT\x1b]8;;\x07
   ```

   This makes links clickable even in static output on supported terminals.

2. **Fallback - `open` package**: For interactive mode on unsupported terminals

   ```typescript
   import open from 'open';
   await open('https://example.com');
   ```

   Triggered by Enter/Space when link is focused.

3. **Detection**: Auto-detect OSC 8 support via TERM_PROGRAM, TERM, etc.

**Supported Terminals for OSC 8**:

- iTerm2 3.1+
- VTE-based (GNOME Terminal, Tilix, Terminator)
- Windows Terminal
- Hyper, Alacritty, Kitty, WezTerm

**Props**:

| Prop               | Type                                         | Default  | Description                                |
| ------------------ | -------------------------------------------- | -------- | ------------------------------------------ |
| href               | string                                       | required | URL to open                                |
| children           | ReactNode                                    | required | Link text                                  |
| fallback           | boolean \| 'always' \| (url: string) => void | true     | Fallback when OSC 8 unsupported            |
| disabled           | boolean                                      | false    | Disable interaction                        |
| tabIndex           | number                                       | 0        | Focus order (-1 to skip)                   |
| style              | TextStyle \| StateStyle                      | -        | Text styling (supports state-based)        |
| onPress            | (url: string) => void                        | -        | Custom press handler (in addition to open) |
| onHover            | () => void                                   | -        | Called when mouse enters                   |
| onHoverOut         | () => void                                   | -        | Called when mouse leaves                   |
| onFocus            | () => void                                   | -        | Called when focused                        |
| onBlur             | () => void                                   | -        | Called when focus lost                     |
| showUrl            | boolean                                      | false    | Display URL after text                     |
| accessibilityLabel | string                                       | -        | Screen reader label                        |

**Fallback Prop Behavior**:

| Value            | Behavior                                                    |
| ---------------- | ----------------------------------------------------------- |
| `true` (default) | Use `open` package when OSC 8 not supported                 |
| `false`          | OSC 8 only - no keypress handler for unsupported terminals  |
| `'always'`       | Skip OSC 8 detection, always use `open` package on keypress |
| `(url) => void`  | Custom fallback function instead of `open` package          |

**State-Based Styling** (like Pressable):

```tsx
<Link
  href="https://example.com"
  style={({ focused, hovered, disabled }) => ({
    color: disabled ? 'gray' : hovered ? 'brightCyan' : 'cyan',
    underline: !disabled,
    dim: disabled,
  })}
>
  Visit website
</Link>
```

**Implementation Notes**:

- **OSC 8 first**: Always emit OSC 8 sequences (works in supported terminals, ignored in others)
- **Fallback for interaction**: In interactive mode, handle keypress to use `open` package
- **Static mode**: OSC 8 makes links clickable without any keypress handling
- Default styling: cyan color with underline (standard link appearance)
- Link extends Pressable behavior for full interactivity
- Enter/Space triggers fallback action when focused (interactive mode only)
- Disabled state prevents interaction and applies dim styling by default
- tabIndex controls focus order (-1 removes from tab order)

**Tasks**:

- [ ] Add `open` as optional/peer dependency
- [ ] Create OSC 8 terminal capability detection utility
- [ ] Create `src/components/primitives/Link.tsx`
- [ ] Implement OSC 8 escape sequence output (always emitted)
- [ ] Implement fallback behavior with `open` package
- [ ] Add fallback prop with all modes (true/false/'always'/function)
- [ ] Add disabled prop with appropriate styling
- [ ] Add tabIndex for focus order control
- [ ] Add state-based styling support (focused, hovered, disabled)
- [ ] Add onHover, onHoverOut, onFocus, onBlur handlers
- [ ] Add showUrl option for accessibility
- [ ] Add onPress handler (in addition to fallback)
- [ ] Add accessibilityLabel prop
- [ ] Export from primitives
- [ ] Add unit tests
- [ ] Add example (both static and interactive modes)
- [ ] Document terminal support and fallback behavior

**Related Utilities** (can be added alongside):

The `open` package also supports:

- Opening apps: `openApp('xcode')` - could expose as utility
- Opening files: `open('document.pdf')` - already works with href
- Consider adding `revealFile` utility (shows file in Finder/Explorer)

---

### 3.4 `<Code>` Component (Syntax Highlighting)

> **Audit Finding**: Identified as missing during gap analysis.

**Priority**: Low  
**Status**: [ ] Not started

Display code with syntax highlighting in terminal.

**Proposed API**:

```tsx
<Code language="javascript">
  const x = 1;
</Code>

<Code
  language="typescript"
  showLineNumbers
  highlightLines={[2, 3]}
  theme="dark"
>
  {codeString}
</Code>
```

**Implementation Notes**:

- Consider using a lightweight syntax highlighter
- Map highlight tokens to ANSI colors
- Support common languages (js, ts, json, bash, etc.)
- Keep dependencies minimal or make highlighting optional

**Tasks**:

- [ ] Research lightweight syntax highlighting options
- [ ] Create `src/components/primitives/Code.tsx`
- [ ] Implement basic highlighting for common languages
- [ ] Add line numbers support
- [ ] Add line highlighting
- [ ] Export from primitives
- [ ] Document usage and language support

---

## 4. I/O & Stream Hooks

### 4.1 `useStdin` Hook

**Priority**: High  
**Status**: [ ] Not started

> **Note**: Audit 1.5 should check what already exists in terminal.ts utilities.

Provide a hook for direct stdin stream access with raw mode control.

**Proposed API**:

```tsx
const {
  stdin, // The actual stdin stream
  isRawModeSupported,
  setRawMode, // (enabled: boolean) => void
  read, // () => Promise<string> - read until newline
  readKey, // () => Promise<KeyPress> - read single keypress
} = useStdin();
```

**Implementation Notes**:

- Wrap `process.stdin` with React-friendly interface
- Handle raw mode transitions safely
- Provide cleanup on component unmount
- Consider integration with existing `enterRawMode`/`exitRawMode` utilities

**Existing Utilities to Leverage**:

- `src/utils/terminal.ts` - has `enterRawMode`, `exitRawMode`
- `src/renderer/input.ts` - has input handling logic

**Tasks**:

- [ ] Create `src/hooks/stdin.ts`
- [ ] Implement stdin stream access
- [ ] Add raw mode control methods
- [ ] Handle cleanup on unmount
- [ ] Add TypeScript types
- [ ] Export from hooks entry point
- [ ] Add usage examples
- [ ] Document API

---

### 4.2 `useStdout` Hook

**Priority**: High  
**Status**: [ ] Not started

Provide a hook for direct stdout stream access with dimension tracking.

**Proposed API**:

```tsx
const {
  stdout, // The actual stdout stream
  write, // (data: string) => void
  columns, // Current column count
  rows, // Current row count
} = useStdout();
```

**Implementation Notes**:

- Wrap `process.stdout`
- Sync with existing `Dimensions` API
- Provide write method that bypasses React rendering (for escape sequences, etc.)
- Consider if this conflicts with React reconciler output

**Warning**: Direct stdout writes may interfere with React's rendering. Document this clearly.

**Tasks**:

- [ ] Create `src/hooks/stdout.ts`
- [ ] Implement stdout stream access
- [ ] Add write method with appropriate warnings
- [ ] Sync dimensions with existing utilities
- [ ] Export from hooks entry point
- [ ] Document interference warnings

---

### 4.3 `useStderr` Hook

**Priority**: Medium  
**Status**: [ ] Not started

Provide a hook for direct stderr stream access.

**Proposed API**:

```tsx
const {
  stderr, // The actual stderr stream
  write, // (data: string) => void
} = useStderr();
```

**Implementation Notes**:

- Simpler than stdout (no dimensions)
- Useful for error output that shouldn't interfere with main UI
- Can be used for debug logging

**Tasks**:

- [ ] Create `src/hooks/stderr.ts`
- [ ] Implement stderr stream access
- [ ] Export from hooks entry point
- [ ] Add usage examples

---

## 5. Console Method Patching

### 5.1 `<Console>` Component & `useConsole` Hook

**Priority**: Medium  
**Status**: [ ] Not started

Support intercepting and redirecting `console.log`, `console.error`, etc. to render within the React UI or to a separate area. Provide both component and hook APIs.

**Component API: `<Console>`**

```tsx
// Basic usage - renders captured logs
<Console
  enabled={true}
  methods={['log', 'warn', 'error', 'info', 'debug']}
  maxHistory={100}
  passthrough={true}  // Still output to real console
  style={{ maxHeight: 10, border: 'single' }}
/>

// With custom rendering
<Console
  enabled={true}
  renderLog={(log) => (
    <Text color={log.level === 'error' ? 'red' : 'white'}>
      [{log.level}] {log.timestamp}: {log.args.join(' ')}
    </Text>
  )}
/>

// As a wrapper/provider (captures logs from children)
<Console.Provider enabled={true} onLog={(log) => /* handle */}>
  <App />
</Console.Provider>
```

**Hook API: `useConsole`**

```tsx
const {
  logs, // Array of captured log entries
  clearLogs, // () => void
  setEnabled, // (enabled: boolean) => void
  isEnabled, // boolean
} = useConsole({
  capture: ['log', 'warn', 'error'],
  maxHistory: 100,
  passthrough: true,
});

// Use logs in custom UI
return (
  <View>
    {logs.map((log, i) => (
      <Text key={i} color={log.level === 'error' ? 'red' : 'gray'}>
        {log.args.join(' ')}
      </Text>
    ))}
  </View>
);
```

**Render Option Integration**:

```tsx
render(<App />, {
  console: {
    capture: true,
    area: 'bottom', // 'bottom' | 'top' | 'separate' | 'hidden'
    maxHeight: 5,
    passthrough: false,
  },
});
```

**Log Entry Type**:

```tsx
interface ConsoleLogEntry {
  level: 'log' | 'warn' | 'error' | 'info' | 'debug';
  args: unknown[];
  timestamp: number;
  stack?: string; // For errors
}
```

**Implementation Notes**:

- Store original console methods
- Replace with intercepting functions
- Route output to designated area or callback
- Restore on cleanup (critical for unmount)
- Handle async console calls
- Consider buffering vs immediate rendering
- Support both component and hook usage patterns

**Tasks**:

- [ ] Create `Console` component with log rendering
- [ ] Create `Console.Provider` for wrapping apps
- [ ] Create `useConsole` hook for state access
- [ ] Implement console method patching utility
- [ ] Add log storage with configurable limits
- [ ] Implement cleanup/restore logic
- [ ] Add render option integration
- [ ] Add custom `renderLog` prop
- [ ] Create example showing debug panel pattern
- [ ] Document usage and caveats

---

## 6. Developer Tools

### 6.1 React DevTools Support

**Priority**: Medium  
**Status**: [ ] Not started

> **Note**: Audit 1.5 should check what DevTools integration already exists in the reconciler.

Add support for React DevTools to enable component inspection and debugging.

**Research Required**:

- React DevTools connects via WebSocket or electron bridge
- Custom renderers need to implement DevTools protocol
- The `react-reconciler` package has DevTools integration options

**Implementation Approach**:

1. Enable DevTools in reconciler configuration
2. Make DevTools options configurable via render options
3. Implement required DevTools hooks
4. Provide connection instructions for standalone DevTools

**Configurable Render Options**:

DevTools configuration should be part of the render options, allowing apps to configure at startup:

```tsx
render(<App />, {
  mode: 'interactive',
  // DevTools configuration
  devTools: {
    enabled: true, // Enable/disable DevTools integration
    bundleType: 'development', // 'development' | 'production' (maps to 1/0)
    // Version auto-read from package.json, but can be overridden
    version: undefined, // Defaults to package.json version
  },
});
```

**Reconciler Integration**:

```tsx
// In reconciler setup - version should come from package.json
import { version } from '../package.json';

// DevTools injection with configurable options
function injectDevTools(options: DevToolsOptions) {
  reconciler.injectIntoDevTools({
    bundleType: options.bundleType === 'production' ? 0 : 1,
    version: options.version ?? version, // Use package.json version as default
    rendererPackageName: '@baseline-operations/react-console',
    // Additional findFiberByHostInstance for component inspection
    findFiberByHostInstance: (instance) => {
      // Implementation for finding fiber from console node
    },
  });
}
```

**Other Configurable Options to Research**:

| Option                    | Description                            | Default               |
| ------------------------- | -------------------------------------- | --------------------- |
| `bundleType`              | Production (0) vs Development (1) mode | Based on NODE_ENV     |
| `version`                 | Renderer version shown in DevTools     | From package.json     |
| `rendererPackageName`     | Package name shown in DevTools         | Package name          |
| `findFiberByHostInstance` | Map host instances to fibers           | Implementation needed |

**Research: Additional Reconciler DevTools Hooks**:

```tsx
// These may need implementation for full DevTools support
const hostConfig = {
  // ... existing config

  // DevTools-related hooks to research:
  getCurrentEventPriority: () => DefaultEventPriority,
  setCurrentUpdatePriority: (priority) => {
    /* ... */
  },
  resolveUpdatePriority: () => {
    /* ... */
  },

  // For component highlighting in DevTools
  preparePortalMount: (containerInfo) => {
    /* ... */
  },

  // For profiling support
  markCommitStarted: () => {
    /* ... */
  },
  markCommitStopped: () => {
    /* ... */
  },
  markRenderStarted: () => {
    /* ... */
  },
  markRenderStopped: () => {
    /* ... */
  },
};
```

**Tasks**:

- [ ] Research react-reconciler DevTools integration fully
- [ ] Audit current reconciler configuration for missing hooks
- [ ] Add DevTools options to `RenderOptions` type
- [ ] Read version from package.json for default
- [ ] Make bundleType configurable (default based on NODE_ENV)
- [ ] Implement `findFiberByHostInstance` for component inspection
- [ ] Research and document all configurable DevTools options
- [ ] Implement `injectIntoDevTools` call with config
- [ ] Test with standalone React DevTools
- [ ] Document connection instructions
- [ ] Add example showing DevTools configuration

---

## 7. Accessibility

### 7.1 ARIA & Screen Reader Support

**Priority**: Medium  
**Status**: [ ] Not started

Research how terminal accessibility works and implement what can be supported.

**Research Questions**:

- How do screen readers interact with terminals?
- What ARIA-like patterns exist for terminal UIs?
- Are there terminal accessibility APIs or standards?
- What do existing terminal apps do for accessibility?

**Potential Approaches**:

1. **Bell/Audio Cues**: Use system bell for alerts (already have Bell API)
2. **Semantic Output**: Structure output for screen reader parsing
3. **Alternative Output**: Provide text descriptions alongside visual elements
4. **Terminal Accessibility APIs**: Research platform-specific APIs
   - macOS: VoiceOver terminal support
   - Windows: Narrator/NVDA terminal support
   - Linux: Orca terminal support

**Possible Implementation**:

```tsx
// Accessibility props on components
<Button
  label="Submit"
  accessibilityLabel="Submit form"
  accessibilityHint="Submits the current form"
/>

// Or semantic structure
<AccessibleRegion role="alert">
  <Text>Error: Invalid input</Text>
</AccessibleRegion>
```

**Tasks**:

- [ ] Research terminal screen reader behavior
- [ ] Investigate platform-specific accessibility APIs
- [ ] Document findings
- [ ] Design accessibility API for React Console
- [ ] Add `accessibilityLabel`, `accessibilityHint`, `accessibilityRole` props to interactive components
- [ ] Implement Bell-based audio feedback integration
- [ ] Implement semantic output structure for screen readers
- [ ] Test with VoiceOver (macOS), Narrator/NVDA (Windows), Orca (Linux)
- [ ] Document accessibility best practices for users

---

## 8. Media Components

### 8.1 `<Image>` Component

**Priority**: Medium  
**Status**: [ ] Not started

Add support for displaying images in terminals that support them.

**Terminal Image Protocols**:

| Protocol             | Terminals       | Notes              |
| -------------------- | --------------- | ------------------ |
| iTerm2 inline images | iTerm2, WezTerm | Base64 encoded     |
| Kitty graphics       | Kitty, WezTerm  | Efficient, chunked |
| Sixel                | mlterm, xterm   | Older standard     |
| Unicode blocks       | All             | Fallback, low-res  |

**Proposed API**:

```tsx
<Image
  source={{ uri: './image.png' }}
  // or
  source={{ uri: 'https://example.com/image.png' }}
  // or
  source={require('./image.png')} // If bundler supports
  width={40}
  height={20}
  resizeMode="contain" // 'contain' | 'cover' | 'stretch'
  alt="Description"
  fallback={<Text>[Image: Description]</Text>}
/>
```

**Implementation Notes**:

- Detect terminal image support at runtime
- Support multiple protocols with fallback chain
- Handle async image loading
- Support local files and URLs
- Provide fallback for unsupported terminals

**Dependencies to Consider**:

- `term-img` - Terminal image detection
- `sharp` or `jimp` - Image processing (optional)
- Custom sixel/kitty encoders

**Tasks**:

- [ ] Research terminal image protocols in depth
- [ ] Create terminal image capability detection
- [ ] Implement iTerm2 protocol support
- [ ] Implement Kitty protocol support
- [ ] Add Unicode block fallback
- [ ] Handle async loading with Suspense
- [ ] Create Image component
- [ ] Add examples for supported terminals
- [ ] Document terminal requirements

---

## 9. Data Display Components

### 9.1 Enhanced `<Table>` Component

**Priority**: Medium  
**Status**: [~] Partially implemented

The current Table component exists but needs enhancement for full feature parity. Should support both declarative (data-driven) and compound component (compositional) APIs.

**Current State** (`src/components/data/Table.tsx`):

- Basic structure exists
- Uses `createConsoleNode('box', ...)` with table metadata
- Needs custom renderer support for actual table rendering

**API Approach A: Declarative (Data-Driven)**

Best for simple, data-driven tables with consistent structure:

```tsx
const data = [
  { id: 1, name: 'John', role: 'Admin' },
  { id: 2, name: 'Jane', role: 'User' },
];

const columns = [
  { key: 'name', header: 'Name', width: '40%' },
  { key: 'role', header: 'Role', align: 'right' },
];

<Table
  data={data}
  columns={columns}
  border="single"
  zebra={true}
  stickyHeader={true}
  selectedRows={[0]}
  onRowPress={(row, index) => console.log(row)}
  rowStyle={(row, index) => (index === 0 ? { backgroundColor: 'blue' } : {})}
  cellStyle={(value, row, column) => (column.key === 'role' ? { color: 'cyan' } : {})}
/>;
```

**API Approach B: Compound Component (Compositional)**

Best for complex layouts, custom cells, or mixed content:

```tsx
<Table border="single">
  <Table.Header>
    <Table.HeaderCell width="40%">Name</Table.HeaderCell>
    <Table.HeaderCell align="right">Role</Table.HeaderCell>
  </Table.Header>

  <Table.Body>
    <Table.Row onPress={() => console.log('clicked')}>
      <Table.Cell>John</Table.Cell>
      <Table.Cell>
        <Text color="green">Admin</Text>
      </Table.Cell>
    </Table.Row>

    <Table.Row style={{ backgroundColor: 'gray' }}>
      <Table.Cell>Jane</Table.Cell>
      <Table.Cell>User</Table.Cell>
    </Table.Row>
  </Table.Body>

  <Table.Footer>
    <Table.Cell style={{ width: '100%' }}>
      <Text dim>2 users total</Text>
    </Table.Cell>
  </Table.Footer>
</Table>
```

**Combined Usage** (Declarative with Custom Rendering):

```tsx
<Table
  data={data}
  columns={columns}
  renderCell={(value, row, column) => {
    if (column.key === 'status') {
      return <StatusBadge status={value} />;
    }
    return value;
  }}
  renderRow={(row, index, defaultRow) => {
    // Can wrap or modify the default row
    return defaultRow;
  }}
/>
```

**Enhanced Props**:

```tsx
interface TableProps<T> {
  // Declarative API
  data?: T[];
  columns?: TableColumn<T>[];

  // Styling
  border?: 'single' | 'double' | 'thick' | 'rounded' | 'none';
  zebra?: boolean;
  style?: ViewStyle;
  headerStyle?: ViewStyle;
  rowStyle?: ViewStyle | ((row: T, index: number) => ViewStyle);
  cellStyle?: ViewStyle | ((value: unknown, row: T, column: TableColumn<T>) => ViewStyle);

  // Behavior
  stickyHeader?: boolean;
  horizontalScroll?: boolean;
  selectable?: boolean;
  selectedRows?: number[];
  onRowSelect?: (indices: number[]) => void;
  onRowPress?: (row: T, index: number) => void;

  // Custom rendering
  renderCell?: (value: unknown, row: T, column: TableColumn<T>) => ReactNode;
  renderRow?: (row: T, index: number, defaultRow: ReactNode) => ReactNode;
  renderHeader?: (column: TableColumn<T>, index: number) => ReactNode;

  // Compound component children
  children?: ReactNode;
}
```

**Tasks**:

- [ ] Implement actual table rendering in renderer
- [ ] Add border drawing with box characters
- [ ] Implement column width calculation (fixed, percentage, auto)
- [ ] Add text truncation/wrapping in cells
- [ ] Create compound components (Table.Header, Table.Body, Table.Row, Table.Cell, Table.Footer)
- [ ] Support both declarative and compound APIs
- [ ] Add custom render props for cells/rows
- [ ] Add row selection support
- [ ] Add sticky header support for scrolling
- [ ] Add zebra striping implementation
- [ ] Share border utilities with Section component
- [ ] Comprehensive testing
- [ ] Add examples for both API styles

---

### 9.2 `<Section>` Component

**Priority**: Medium  
**Status**: [ ] Not started

A flexible sectional component similar to Table but with non-strict columns. Unlike Table where columns align across all rows, Section allows each row to have independently sized cells. Useful for dashboards, info panels, key-value displays, and layouts where content varies per row.

**Key Difference from Table**:

| Feature          | Table                  | Section                     |
| ---------------- | ---------------------- | --------------------------- |
| Column alignment | Strict across all rows | Independent per row         |
| Use case         | Tabular data           | Flexible layouts            |
| Cell widths      | Defined by columns     | Defined per cell via styles |

**API Approach A: Compound Component (Compositional)**

```tsx
<Section border="single" title="User Info">
  <Section.Row>
    <Section.Cell style={{ width: '30%' }}>Name:</Section.Cell>
    <Section.Cell>John Doe</Section.Cell>
  </Section.Row>
  <Section.Row>
    <Section.Cell style={{ width: '30%' }}>Email:</Section.Cell>
    <Section.Cell>john@example.com</Section.Cell>
  </Section.Row>
  <Section.Row>
    {/* Full width cell - just use style, no colSpan needed */}
    <Section.Cell style={{ width: '100%' }}>
      <Text dim>Additional notes can span full width</Text>
    </Section.Cell>
  </Section.Row>
</Section>
```

**API Approach B: Declarative (Data-Driven)**

```tsx
<Section
  border="single"
  title="Stats"
  rows={[
    [{ content: 'Users', style: { width: '40%' } }, { content: '1,234' }],
    [
      { content: 'Revenue', style: { width: '40%' } },
      { content: '$5,678', style: { color: 'green' } },
    ],
    [{ content: 'Total items in inventory', style: { width: '100%', textAlign: 'center' } }],
  ]}
/>
```

**Width Distribution Logic**:

When cells don't specify widths, remaining space is distributed evenly:

```tsx
// Row with 3 cells, no widths specified → each gets 33.3%
<Section.Row>
  <Section.Cell>A</Section.Cell>
  <Section.Cell>B</Section.Cell>
  <Section.Cell>C</Section.Cell>
</Section.Row>

// Row with 2 cells, first has 30% → second gets 70%
<Section.Row>
  <Section.Cell style={{ width: '30%' }}>Label</Section.Cell>
  <Section.Cell>Value takes remaining space</Section.Cell>
</Section.Row>

// Full width single cell
<Section.Row>
  <Section.Cell style={{ width: '100%' }}>Full width content</Section.Cell>
</Section.Row>
```

**Styling via StyleSheet**:

```tsx
const styles = StyleSheet.create({
  labelCell: {
    width: '30%',
    color: 'gray',
  },
  valueCell: {
    flex: 1, // Takes remaining space
    bold: true,
  },
  fullWidth: {
    width: '100%',
    textAlign: 'center',
  },
});

<Section border="rounded">
  <Section.Row>
    <Section.Cell style={styles.labelCell}>Name:</Section.Cell>
    <Section.Cell style={styles.valueCell}>John Doe</Section.Cell>
  </Section.Row>
</Section>;
```

**Props**:

```tsx
interface SectionProps {
  border?: 'single' | 'double' | 'thick' | 'rounded' | 'dashed' | 'none';
  title?: ReactNode;
  footer?: ReactNode;
  style?: ViewStyle;

  // Declarative API
  rows?: SectionRowData[][];

  // Compound component children
  children?: ReactNode;
}

interface SectionRowProps {
  style?: ViewStyle;
  children?: ReactNode;
}

interface SectionCellProps {
  style?: ViewStyle; // Use width, flex, textAlign, etc.
  children?: ReactNode;
}

// For declarative API
interface SectionCellData {
  content: ReactNode;
  style?: ViewStyle;
}
```

**Shared Infrastructure with Table**:

```tsx
// src/style/mixins/BorderStyleMixin.ts (enhance existing)
// Shared utilities:
// - Box character selection (single, double, rounded, etc.)
// - Corner handling
// - Intersection handling (for Table) vs simple borders (for Section)
// - Row separator drawing
```

**Tasks**:

- [ ] Design both compound and declarative APIs
- [ ] Extract/enhance border utilities into shared mixin
- [ ] Implement Section container component
- [ ] Implement Section.Row component
- [ ] Implement Section.Cell component with flexible width distribution
- [ ] Support percentage, fixed, and flex-based widths via style prop
- [ ] Add title/header support
- [ ] Add footer support
- [ ] Share border drawing with Table component
- [ ] Create examples showing both API styles
- [ ] Document width distribution behavior
- [ ] Document patterns and use cases

---

## 10. Testing Infrastructure

### 10.1 Unit Testing Support

**Priority**: High  
**Status**: [ ] Not started

Improve testing infrastructure for applications built with React Console. Focus on utilities that make sense for terminal UI testing rather than blindly copying DOM testing patterns.

**Current State**:

- Project uses Vitest (`vitest.config.ts`)
- Some tests exist in `src/__tests__/`
- Need better utilities for testing console components

**Key Testing Concerns for Terminal UIs**:

Unlike DOM testing, terminal UI testing focuses on:

1. **Output content** - What text is rendered
2. **ANSI styling** - Colors, formatting applied correctly
3. **Layout** - Dimensions, positioning, spacing
4. **Keyboard input** - Key presses, stdin processing
5. **Mouse input** - Clicks, movement, scroll (for terminals that support it)
6. **Focus management** - Tab navigation, focus state
7. **State changes** - Component updates based on interactions
8. **Resize handling** - Terminal dimension changes

**Proposed Testing Utilities**:

```tsx
import {
  render,
  renderToString,
  renderToAnsi,
  createMockTerminal,
  simulateKeyPress,
  simulateInput,
  simulateMouse,
  simulateFocus,
  simulateResize,
} from '@baseline-operations/react-console/testing';
```

**1. Output Rendering Utilities**

```tsx
// Render to plain text (ANSI stripped) - for content assertions
const plainText = renderToString(<MyComponent />);
expect(plainText).toContain('Hello World');
expect(plainText).toMatchSnapshot();

// Render with ANSI codes - for styling assertions
const ansiOutput = renderToAnsi(<MyComponent />);
expect(ansiOutput).toContain('\x1b[31m'); // Contains red color code
expect(ansiOutput).toMatchSnapshot();

// Structured render result - for detailed inspection
const result = render(<MyComponent />);
expect(result.text).toBe('Hello World');
expect(result.lines).toHaveLength(3);
expect(result.width).toBe(80);
expect(result.height).toBe(24);
```

**2. Terminal Environment Mocking**

```tsx
// Create isolated terminal environment
const terminal = createMockTerminal({
  columns: 80,
  rows: 24,
  supportsColor: true,
  supportsMouse: false,
});

// Render in mock environment
const result = terminal.render(<MyComponent />);

// Resize and re-render
terminal.resize(120, 40);
const resizedResult = terminal.render(<MyComponent />);

// Access captured output
expect(terminal.output).toContain('Expected text');
terminal.clear();
```

**3. Keyboard Input Simulation**

```tsx
const terminal = createMockTerminal();
terminal.render(<TextInput onChangeText={mockFn} />);

// Simulate keyboard input
simulateKeyPress(terminal, 'a');
simulateKeyPress(terminal, { key: 'Enter' });
simulateKeyPress(terminal, { key: 'Tab', shift: true });
simulateKeyPress(terminal, { key: 'Escape' });
simulateKeyPress(terminal, { key: 'ArrowUp', ctrl: true });

// Simulate text input sequence
simulateInput(terminal, 'Hello World');

// Verify handlers called
expect(mockFn).toHaveBeenCalledWith('Hello World');
```

**4. Mouse Input Simulation**

```tsx
const terminal = createMockTerminal({ supportsMouse: true });
terminal.render(<Button onPress={mockPress} onHoverIn={mockHover} />);

// Simulate mouse click at position
simulateMouse(terminal, { type: 'click', x: 10, y: 5 });
simulateMouse(terminal, { type: 'click', x: 10, y: 5, button: 'right' });

// Simulate mouse movement (hover)
simulateMouse(terminal, { type: 'move', x: 10, y: 5 });
simulateMouse(terminal, { type: 'move', x: 20, y: 5 }); // Move away

// Simulate mouse press/release (drag)
simulateMouse(terminal, { type: 'down', x: 10, y: 5 });
simulateMouse(terminal, { type: 'move', x: 15, y: 5 }); // Drag
simulateMouse(terminal, { type: 'up', x: 15, y: 5 });

// Simulate scroll
simulateMouse(terminal, { type: 'scroll', x: 10, y: 5, direction: 'up' });
simulateMouse(terminal, { type: 'scroll', x: 10, y: 5, direction: 'down', amount: 3 });

// Verify handlers
expect(mockPress).toHaveBeenCalled();
expect(mockHover).toHaveBeenCalled();
```

**5. Focus Simulation**

```tsx
const terminal = createMockTerminal();
terminal.render(<App />);

// Simulate focus changes
simulateFocus(terminal, { tabIndex: 0 }); // Focus first focusable
simulateFocus(terminal, { tabIndex: 2 }); // Focus by tab index
simulateFocus(terminal, { type: 'textinput' }); // Focus first of type
simulateFocus(terminal, null); // Blur all

// Tab navigation
simulateKeyPress(terminal, { key: 'Tab' });
simulateKeyPress(terminal, { key: 'Tab', shift: true });

// Get current focus
expect(terminal.focusedComponent).toBeDefined();
expect(terminal.focusedComponent.type).toBe('textinput');
```

**6. Component Tree Inspection**

```tsx
const result = render(<App />);

// Find components by type
const textInputs = result.findAllByType('textinput');
const buttons = result.findAllByType('button');

// Find by props
const submitBtn = result.findByProps({ label: 'Submit' });

// Inspect component
expect(submitBtn.props.disabled).toBe(false);
expect(submitBtn.style.color).toBe('cyan');
```

**7. Custom Matchers (Vitest/Jest)**

```tsx
// Text content matchers
expect(result).toContainText('Hello');
expect(result).toMatchLines(['Line 1', 'Line 2']);

// Style matchers
expect(result).toHaveStyle({ color: 'red', bold: true });
expect(result).toHaveBackgroundColor('blue');

// Layout matchers
expect(result).toHaveDimensions(80, 24);
expect(result).toFitWithinWidth(80);

// Component state matchers
expect(textInput).toBeFocused();
expect(button).toBeDisabled();

// Mouse/interaction matchers
expect(button).toBeHovered();
expect(pressable).toBePressed();
```

**8. Async & Update Testing**

```tsx
const terminal = createMockTerminal();
const { rerender, waitForUpdate } = terminal.render(<Counter />);

// Trigger state change
simulateKeyPress(terminal, 'Enter');

// Wait for React to update
await waitForUpdate();

// Assert new state
expect(terminal.output).toContain('Count: 1');

// Re-render with new props
rerender(<Counter initialCount={10} />);
expect(terminal.output).toContain('Count: 10');
```

**Implementation Notes**:

- Create `src/testing/` directory
- Use existing renderer internals but capture output instead of writing to stdout
- Mock `process.stdin`/`process.stdout` for isolation
- Provide Vitest matchers (Jest-compatible)
- Support both sync and async testing patterns

**Tasks**:

- [ ] Create `src/testing/` directory structure
- [ ] Implement `renderToString` (strip ANSI, return plain text)
- [ ] Implement `renderToAnsi` (preserve ANSI codes)
- [ ] Implement `render` with structured result
- [ ] Create `createMockTerminal` with stdin/stdout mocking
- [ ] Implement `simulateKeyPress` and `simulateInput`
- [ ] Implement `simulateMouse` (click, move, scroll, drag)
- [ ] Implement `simulateFocus` for focus management testing
- [ ] Implement `simulateResize` for terminal resize testing
- [ ] Add component tree inspection methods
- [ ] Create custom Vitest/Jest matchers (including hover/press states)
- [ ] Add async update waiting utilities
- [ ] Create testing entry point (`@baseline-operations/react-console/testing`)
- [ ] Add to package.json exports
- [ ] Write documentation for testing patterns
- [ ] Add example test files demonstrating each utility

---

## 11. Developer Experience & Tooling

### 11.1 ESLint Plugin for React Console

**Priority**: Medium  
**Status**: [ ] Not started

Provide ESLint rules specific to React Console applications to catch common mistakes and enforce best practices.

**Proposed Package**: `@baseline-operations/eslint-plugin-react-console` or integrated rules

**Rules to Implement**:

| Rule                       | Description                                                       | Fixable |
| -------------------------- | ----------------------------------------------------------------- | ------- |
| `no-direct-stdout-write`   | Warn when writing directly to stdout in components                | No      |
| `prefer-text-component`    | Suggest using Text instead of string literals in certain contexts | Yes     |
| `valid-style-props`        | Validate style prop values against terminal capabilities          | No      |
| `no-invalid-colors`        | Check color values are valid (named, hex, rgb)                    | No      |
| `require-key-in-lists`     | Standard React key rule awareness for FlatList/SectionList        | No      |
| `no-nested-interactive`    | Prevent nesting interactive components (Button in Button)         | No      |
| `prefer-stylesheet`        | Suggest StyleSheet.create for repeated styles                     | Yes     |
| `valid-event-handlers`     | Validate event handler prop names                                 | No      |
| `no-blocking-stdin`        | Warn about blocking stdin operations in render                    | No      |
| `exhaustive-deps-terminal` | Like React's exhaustive-deps but aware of terminal hooks          | No      |

**Configuration**:

```js
// eslint.config.js
import reactConsole from '@baseline-operations/eslint-plugin-react-console';

export default [
  reactConsole.configs.recommended,
  // or individual rules
  {
    plugins: { 'react-console': reactConsole },
    rules: {
      'react-console/no-direct-stdout-write': 'warn',
      'react-console/prefer-stylesheet': 'warn',
    },
  },
];
```

**Implementation Notes**:

- Can be a separate package or included in main package
- Should extend/complement existing React ESLint rules
- Consider providing preset configs (recommended, strict)

**Tasks**:

- [ ] Research ESLint plugin architecture
- [ ] Decide on package structure (separate vs included)
- [ ] Implement core rules
- [ ] Create recommended config preset
- [ ] Add documentation
- [ ] Test with real React Console projects

---

### 11.2 Storybook Support

**Priority**: Medium  
**Status**: [ ] Not started

Investigate and implement Storybook support for React Console components, or provide a documented alternative if not feasible.

**Research Questions**:

- Can Storybook render to a terminal-like preview?
- Would we need a custom Storybook renderer/addon?
- Are there existing terminal-in-browser solutions to leverage?
- Is this even valuable given terminal-specific nature?

**Potential Approaches**:

1. **Terminal Emulator in Browser**: Use xterm.js or similar to render output
2. **Custom Storybook Addon**: Create addon that captures React Console output
3. **Static Output Preview**: Render to ANSI and display in pre-formatted block
4. **Not Feasible**: Document why and provide alternative (example files)

**If Feasible - Proposed Integration**:

```tsx
// Component.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-console';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    terminal: {
      columns: 80,
      rows: 24,
      theme: 'dark',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    label: 'Click me',
    color: 'cyan',
  },
};
```

**Alternative if Not Feasible**:

- Provide excellent example files as documentation
- Create a simple CLI viewer for component demos
- Generate static ANSI screenshots for docs

**Tasks**:

- [ ] Research Storybook custom renderer requirements
- [ ] Investigate xterm.js integration possibilities
- [ ] Prototype terminal-in-browser preview
- [ ] If feasible: Implement full Storybook integration
- [ ] If not feasible: Implement alternative (CLI component viewer, ANSI screenshot generator)
- [ ] Document the solution
- [ ] Create example stories/demos

---

## 12. Additional Features & Gaps

### 12.1 Keyboard Shortcuts / Hotkeys System

**Priority**: Medium  
**Status**: [ ] Not started

Provide a system for registering and managing keyboard shortcuts across the application.

**Proposed API**:

```tsx
// Hook API
const { registerShortcut, unregisterShortcut } = useHotkeys();

useHotkeys([
  { keys: 'ctrl+s', handler: handleSave, description: 'Save' },
  { keys: 'ctrl+q', handler: handleQuit, description: 'Quit' },
  { keys: 'ctrl+shift+p', handler: handleCommand, description: 'Command palette' },
]);

// Component API
<Hotkey keys="ctrl+s" onPress={handleSave} />;

// Global registration
Hotkeys.register('ctrl+q', handleQuit);
Hotkeys.unregister('ctrl+q');
Hotkeys.list(); // Get all registered shortcuts
```

**Tasks**:

- [ ] Design API (hook vs component vs global)
- [ ] Implement keyboard shortcut parser
- [ ] Handle modifier keys (ctrl, alt, shift, meta)
- [ ] Add conflict detection
- [ ] Create help display component for shortcuts
- [ ] Document usage

---

### 12.2 Exit Handling & Cleanup

**Priority**: High  
**Status**: [ ] Not started

Ensure proper cleanup and exit handling for terminal applications.

**Proposed API**:

```tsx
// Hook for cleanup on exit
useExitHandler(() => {
  // Cleanup resources
  saveState();
  closeConnections();
});

// Prevent accidental exit
useExitConfirmation({
  when: hasUnsavedChanges,
  message: 'You have unsaved changes. Exit anyway?',
});

// Programmatic exit
import { exit } from '@baseline-operations/react-console';
exit(0); // Exit with code
exit(1, 'Error message'); // Exit with error
```

**Implementation Notes**:

- Handle SIGINT, SIGTERM, SIGHUP
- Restore terminal state (cursor, raw mode, mouse tracking)
- Allow async cleanup before exit
- Provide exit confirmation for interactive apps

**Tasks**:

- [ ] Implement signal handlers
- [ ] Create useExitHandler hook
- [ ] Create useExitConfirmation hook
- [ ] Ensure terminal state restoration
- [ ] Handle async cleanup
- [ ] Document best practices

---

### 12.3 Notification / Toast System

**Priority**: Medium  
**Status**: [ ] Not started

Provide a system for temporary notifications/toasts in terminal UI.

**Proposed API**:

```tsx
// Hook API
const { notify, clearAll } = useNotifications();

notify({
  message: 'File saved successfully',
  type: 'success', // 'success' | 'error' | 'warning' | 'info'
  duration: 3000, // Auto-dismiss after 3s
  position: 'top-right',
});

// Component API
<NotificationProvider position="top-right" maxVisible={3}>
  <App />
</NotificationProvider>;

// Toast shorthand
toast.success('Saved!');
toast.error('Failed to save');
```

**Tasks**:

- [ ] Design notification system
- [ ] Implement positioning logic
- [ ] Add animation support
- [ ] Handle stacking multiple notifications
- [ ] Create preset types (success, error, etc.)
- [ ] Document usage

---

### 12.4 Color Utilities

**Priority**: Medium  
**Status**: [ ] Not started

Provide color manipulation utilities for dynamic theming and styling.

**Proposed API**:

```tsx
import { colors } from '@baseline-operations/react-console';

// Color parsing
const color = colors.parse('#ff0000');
const rgb = colors.toRgb('red');
const hex = colors.toHex('rgb(255, 0, 0)');

// Color manipulation
const lighter = colors.lighten('blue', 0.2);
const darker = colors.darken('blue', 0.2);
const faded = colors.fade('red', 0.5);

// Terminal-safe color
const safe = colors.toTerminalColor('#ff5733'); // Nearest ANSI color

// Contrast checking
const readable = colors.isReadable('white', 'yellow'); // false
const suggested = colors.suggestForeground('yellow'); // 'black'
```

**Tasks**:

- [ ] Implement color parsing
- [ ] Add color manipulation functions
- [ ] Add terminal color conversion (256-color, 16-color fallbacks)
- [ ] Add contrast utilities
- [ ] Document usage

---

### 12.5 Performance Profiling Utilities

**Priority**: Medium  
**Status**: [ ] Not started

Provide utilities for profiling React Console application performance.

**Proposed API**:

```tsx
// Development mode profiling
import { Profiler, useProfiler } from '@baseline-operations/react-console';

<Profiler
  id="App"
  onRender={(id, phase, duration) => {
    console.log(`${id} ${phase}: ${duration}ms`);
  }}
>
  <App />
</Profiler>;

// Render count tracking
const renderCount = useRenderCount();

// Performance metrics
const metrics = usePerformanceMetrics();
// { fps: 60, renderTime: 5, componentCount: 42 }
```

**Tasks**:

- [ ] Integrate with React Profiler API
- [ ] Add terminal-specific metrics
- [ ] Create performance visualization component
- [ ] Document profiling best practices

---

## 14. Tracking & Progress

### Completion Checklist

Use this checklist to track overall progress. **All items must be completed before v0.2.0. Nothing is deferred.**

**Phase 0: Audits & Bug Fixes** (Do First - Informs Everything Else)

- [x] 1.1 API surface audit
- [x] 1.2 Component completeness audit
- [x] 1.3 Code organization audit
- [x] 1.4 Documentation audit
- [x] 1.5 Existing feature verification
- [x] 1.6 Gap analysis for terminal UI library
- [x] Update this roadmap based on audit findings
- [x] BF-1: Fix ESM compatibility in examples
- [x] BF-2: Fix `useAsyncWithFallback` hook
- [x] BF-3: Fix bell.tsx buttons (add interactive mode)
- [x] BF-4: Add borderTop/borderRight/borderBottom/borderLeft props

**Phase 1: Core Components** (Foundation)

- [x] 2.1 Spacer component
- [x] 2.2 LineBreak count prop
- [x] 2.3 Divider component
- [x] 2.4 TouchableOpacity/TouchableHighlight aliases
- [ ] 3.1 Text transform verification
- [ ] 3.2 Inline text styling (nested Text / alias decision)
- [ ] 3.3 Link component (terminal hyperlinks)
- [ ] 3.4 Code component (syntax highlighting)

**Phase 2: I/O & Integration** (Developer Experience)

- [ ] 4.1 useStdin hook
- [ ] 4.2 useStdout hook
- [ ] 4.3 useStderr hook
- [ ] 5.1 Console component & useConsole hook

**Phase 3: Developer Tools** (Debugging)

- [ ] 6.1 React DevTools support (configurable via render options)
- [ ] 10.1 Testing utilities (keyboard, mouse, focus, resize)
- [ ] 11.1 ESLint plugin for React Console
- [ ] 11.2 Storybook support investigation

**Phase 4: Media & Accessibility**

- [ ] 7.1 Accessibility implementation
- [ ] 8.1 Image component

**Phase 5: Data Display Components**

- [ ] 9.1 Table enhancements (declarative + compound APIs)
- [ ] 9.2 Section component (declarative + compound APIs)

**Phase 6: Additional Features**

- [ ] 12.1 Keyboard shortcuts / Hotkeys system
- [ ] 12.2 Exit handling & cleanup hooks
- [ ] 12.3 Notification / Toast system
- [ ] 12.4 Color utilities
- [ ] 12.5 Performance profiling utilities

**Phase 7: Polish & Release** (Production Ready)

- [ ] Final documentation pass
- [ ] API consistency review and fixes
- [ ] All examples updated
- [ ] README complete
- [ ] CHANGELOG complete
- [ ] Version bump to 0.2.0

> **Note**: All phases and all items within each phase are required for v0.2.0. Nothing is optional or deferred.

---

## Cleanup Protocol

When completing any task:

1. **Update this document**: Mark task as complete with [x]
2. **Update CHANGELOG.md**: Add entry under appropriate version
3. **Run tests**: Ensure all tests pass
4. **Run linting**: `npm run lint:fix`
5. **Update exports**: Add new exports to appropriate entry points
6. **Update TypeDoc**: Ensure JSDoc comments are complete
7. **Create example**: Add example file if applicable
8. **Update README**: If feature is user-facing

---

## Version Planning

All work in this roadmap will be completed before v0.2.0. Each logical grouping gets its own patch release. Nothing is deferred or skipped.

### v0.1.3 - Audits & Bug Fixes

- [x] 1.1 API surface audit
- [x] 1.2 Component completeness audit
- [x] 1.3 Code organization audit
- [x] 1.4 Documentation audit
- [x] 1.5 Existing feature verification
- [x] 1.6 Gap analysis for terminal UI library
- [x] Update roadmap based on findings
- [x] BF-1: Fix ESM compatibility in examples (10 files)
- [x] BF-2: Fix `useAsyncWithFallback` hook
- [x] BF-3: Fix bell.tsx buttons (add interactive mode)
- [x] BF-4: Add borderTop/borderRight/borderBottom/borderLeft props

### v0.1.4 - Core Layout Components

- [x] Dependency updates (GitHub Actions + npm production/dev dependencies)
- [x] 2.1 Spacer component
- [x] 2.2 LineBreak count prop
- [x] 2.3 Divider component
- [x] 2.4 TouchableOpacity/TouchableHighlight aliases

### v0.1.5 - Text Components & Styling

- [ ] 3.1 Text transform verification/implementation
- [ ] 3.2 Inline text styling (nested Text / alias decision)
- [ ] 3.3 Link component (terminal hyperlinks)
- [ ] 3.4 Code component (syntax highlighting)

### v0.1.6 - I/O Stream Hooks

- [ ] 4.1 useStdin hook
- [ ] 4.2 useStdout hook
- [ ] 4.3 useStderr hook

### v0.1.7 - Console Capture System

- [ ] 5.1 Console component & useConsole hook

### v0.1.8 - React DevTools Integration

- [ ] 6.1 React DevTools support (configurable via render options)

### v0.1.9 - Accessibility

- [ ] 7.1 ARIA & Screen Reader support research & implementation

### v0.1.10 - Image Component

- [ ] 8.1 Image component (iTerm2, Kitty, Sixel, Unicode fallback)

### v0.1.11 - Data Display Components

- [ ] 9.1 Table enhancements (declarative + compound APIs)
- [ ] 9.2 Section component (declarative + compound APIs)

### v0.1.12 - Testing Infrastructure

- [ ] 10.1 Testing utilities (render, mock terminal, keyboard, mouse, focus, resize)

### v0.1.13 - Developer Tooling

- [ ] 11.1 ESLint plugin for React Console
- [ ] 11.2 Storybook support (implementation or documented alternative)

### v0.1.14 - Keyboard & Exit Handling

- [ ] 12.1 Keyboard shortcuts / Hotkeys system
- [ ] 12.2 Exit handling & cleanup hooks

### v0.1.15 - Notifications & Utilities

- [ ] 12.3 Notification / Toast system
- [ ] 12.4 Color utilities
- [ ] 12.5 Performance profiling utilities

### v0.1.16 - Documentation & Polish

- [ ] Final documentation pass (all components, hooks, APIs)
- [ ] API consistency review and fixes
- [ ] All examples updated
- [ ] README updated
- [ ] CHANGELOG complete

### v0.2.0 - Release

- [ ] All above versions complete
- [ ] Full test coverage
- [ ] All documentation complete
- [ ] Version bump to 0.2.0
- [ ] Release notes

---

## Order of Work

1. **v0.1.3**: Complete all audits - these inform everything else
2. **v0.1.4 - v0.1.7**: Core functionality (layout, text, I/O hooks, console)
3. **v0.1.8 - v0.1.10**: DevTools, accessibility, and media (DevTools, accessibility, images)
4. **v0.1.11 - v0.1.13**: Data components, testing, and developer tooling
5. **v0.1.14 - v0.1.15**: Additional features (hotkeys, exit handling, notifications, utilities)
6. **v0.1.16**: Documentation and polish
7. **v0.2.0**: Final release

Each patch version should be a complete, working state. No broken functionality between versions.

---

## Notes & Research Links

### Reference Documentation

- [React Reconciler](https://github.com/facebook/react/tree/main/packages/react-reconciler)
- [React Native Components](https://reactnative.dev/docs/components-and-apis)
- [ANSI Escape Codes](https://en.wikipedia.org/wiki/ANSI_escape_code)
- [Terminal Capabilities](https://invisible-island.net/xterm/ctlseqs/ctlseqs.html)

### Terminal Image Protocols

- [iTerm2 Inline Images](https://iterm2.com/documentation-images.html)
- [Kitty Graphics Protocol](https://sw.kovidgoyal.net/kitty/graphics-protocol/)
- [Sixel Graphics](https://en.wikipedia.org/wiki/Sixel)

### Accessibility Resources

- [Terminal Accessibility](https://www.w3.org/WAI/perspective-videos/speech/)
- [macOS VoiceOver](https://support.apple.com/guide/voiceover/welcome/mac)

---

_Last Updated: February 10, 2026_
