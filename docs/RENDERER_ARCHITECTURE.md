# Renderer Architecture

This document describes the architecture of the React Console renderer system, including data flow, component lifecycle, and rendering pipeline.

## Overview

React Console uses a custom React renderer built on `react-reconciler` that maps React components to console output. The renderer handles layout calculations, ANSI code generation, input handling, and terminal output.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      React Application                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              React Component Tree (JSX)                    │  │
│  │  <App>                                                     │  │
│  │    <View>                                                  │  │
│  │      <Text>Hello</Text>                                    │  │
│  │      <Input />                                             │  │
│  │    </View>                                                 │  │
│  └──────────────────────┬─────────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    React Reconciler                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  - React 19 reconciliation                               │  │
│  │  - Component lifecycle management                         │  │
│  │  - State updates and re-renders                          │  │
│  │  - Concurrent features support                           │  │
│  └──────────────────────┬─────────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Host Config (hostConfig.ts)                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  - createInstance() - Creates ConsoleNode                │  │
│  │  - appendChild() - Adds to parent                        │  │
│  │  - removeChild() - Removes from parent                   │  │
│  │  - commitUpdate() - Updates node properties              │  │
│  │  - commitTextUpdate() - Updates text content             │  │
│  └──────────────────────┬─────────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                  ConsoleNode Tree                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  {                                                         │  │
│  │    type: 'box',                                           │  │
│  │    children: [                                            │  │
│  │      { type: 'text', content: 'Hello' },                  │  │
│  │      { type: 'input', value: '' }                         │  │
│  │    ]                                                       │  │
│  │  }                                                         │  │
│  └──────────────────────┬─────────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Layout System (layout.ts)                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  - renderNodeToBuffer() - Main layout function           │  │
│  │  - calculateLayout() - Flexbox/Grid calculations        │  │
│  │  - resolveDimensions() - Responsive size resolution      │  │
│  │  - applyStyles() - Style application                     │  │
│  └──────────────────────┬─────────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Node Renderers (nodes/)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  - renderTextNode() - Text rendering                     │  │
│  │  - renderBoxNode() - Box/View rendering                  │  │
│  │  - renderInputNode() - Input rendering                   │  │
│  │  - renderButtonNode() - Button rendering                  │  │
│  │  - renderSelectionNode() - Radio/Checkbox/Dropdown/List  │  │
│  │  - renderLayoutNode() - Scrollable/Overlay               │  │
│  └──────────────────────┬─────────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Output Buffer (output.ts)                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  - createOutputBuffer() - Creates buffer                 │  │
│  │  - flushOutput() - Writes to stdout                     │  │
│  │  - ANSI code generation                                  │  │
│  │  - Cursor positioning                                    │  │
│  └──────────────────────┬─────────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────────┘
                          │
                          ▼
                    Terminal Output
```

## Data Flow

### 1. Component Rendering Flow

```
React Component → Reconciler → Host Config → ConsoleNode → Layout → Render → Output
```

**Step-by-Step:**

1. **React Component:** User writes JSX (`<Text>Hello</Text>`)
2. **Reconciler:** React reconciles component tree, calls host config
3. **Host Config:** Creates `ConsoleNode` objects from React elements
4. **ConsoleNode Tree:** Internal representation of component tree
5. **Layout System:** Calculates positions, sizes, styles
6. **Node Renderers:** Renders each node type to buffer
7. **Output Buffer:** Collects rendered output
8. **Terminal Output:** Flushes buffer to stdout

### 2. Update Flow

```
State Change → Reconciler → Diff → Update ConsoleNode → Re-layout → Re-render → Update Output
```

**Step-by-Step:**

1. **State Change:** React state updates (useState, props change)
2. **Reconciler:** React detects changes, calculates diff
3. **Host Config:** Updates ConsoleNode tree (commitUpdate)
4. **Layout System:** Recalculates layout for changed nodes
5. **Node Renderers:** Re-renders affected nodes
6. **Output Buffer:** Updates buffer with new output
7. **Terminal Output:** Flushes updated output

### 3. Input Flow

```
Terminal Input → Input Parser → Event Handler → Component State → Re-render
```

**Step-by-Step:**

1. **Terminal Input:** User presses key or clicks mouse
2. **Input Parser:** Parses raw input (ANSI codes, mouse events)
3. **Event Handler:** Maps to component event handlers
4. **Component State:** Updates React state
5. **Re-render:** Triggers reconciliation and re-render

## Component Lifecycle

### ConsoleNode Lifecycle

```
createInstance() → appendChild() → commitUpdate() → removeChild()
```

**Phases:**

1. **Creation:** `createInstance()` - Creates ConsoleNode from React element
2. **Mounting:** `appendChild()` - Adds to parent's children array
3. **Updates:** `commitUpdate()` - Updates properties on state/props change
4. **Unmounting:** `removeChild()` - Removes from parent, cleanup

### Rendering Lifecycle

```
Layout Calculation → Node Rendering → Buffer Update → Output Flush
```

**Phases:**

1. **Layout:** Calculate positions, sizes, styles for all nodes
2. **Rendering:** Render each node type to buffer
3. **Buffer Update:** Update output buffer with rendered content
4. **Output Flush:** Write buffer to terminal

## Key Components

### 1. Reconciler (`reconciler.ts`)

**Purpose:** React reconciliation engine

**Responsibilities:**
- Component tree reconciliation
- State update batching
- Concurrent feature support
- Lifecycle management

**Key Functions:**
- `createContainer()` - Creates root container
- `updateContainer()` - Updates component tree
- `flushSync()` - Synchronous updates

### 2. Host Config (`hostConfig.ts`)

**Purpose:** Bridge between React and ConsoleNode

**Responsibilities:**
- Create ConsoleNode instances
- Manage parent-child relationships
- Handle updates and removals
- Text content updates

**Key Functions:**
- `createInstance()` - Creates ConsoleNode
- `appendChild()` - Adds child to parent
- `removeChild()` - Removes child from parent
- `commitUpdate()` - Updates node properties
- `commitTextUpdate()` - Updates text content

### 3. Layout System (`layout.ts`)

**Purpose:** Calculate layout and render nodes

**Responsibilities:**
- Flexbox layout calculations
- Grid layout calculations
- Responsive size resolution
- Style application
- Node rendering orchestration

**Key Functions:**
- `renderNodeToBuffer()` - Main rendering function
- `calculateLayout()` - Layout calculations
- `resolveDimensions()` - Size resolution
- `applyStyles()` - Style application

### 4. Node Renderers (`nodes/`)

**Purpose:** Render specific node types

**Responsibilities:**
- Render text nodes
- Render box/view nodes
- Render interactive nodes (input, button)
- Render selection nodes (radio, checkbox, dropdown, list)
- Render layout nodes (scrollable, overlay)

**Key Functions:**
- `renderTextNode()` - Text rendering
- `renderBoxNode()` - Box/View rendering
- `renderInputNode()` - Input rendering
- `renderButtonNode()` - Button rendering
- `renderSelectionNode()` - Selection component rendering
- `renderLayoutNode()` - Layout component rendering

### 5. Output System (`output.ts`)

**Purpose:** Manage terminal output

**Responsibilities:**
- Create output buffers
- Generate ANSI codes
- Handle cursor positioning
- Flush output to stdout

**Key Functions:**
- `createOutputBuffer()` - Creates buffer
- `flushOutput()` - Writes to stdout
- `startRendering()` - Starts render loop
- `stopRendering()` - Stops render loop

### 6. Input System (`input.ts`)

**Purpose:** Handle terminal input

**Responsibilities:**
- Parse keyboard input
- Parse mouse input
- Map to component events
- Handle focus management

**Key Functions:**
- `startInputListener()` - Starts input listening
- `stopInputListener()` - Stops input listening
- `parseKeyPress()` - Parses keyboard input
- `parseMouseEvent()` - Parses mouse input

## Rendering Modes

### Static Mode

**Use Case:** One-time output (CLI tools, scripts)

**Behavior:**
- Renders once and exits
- No input handling
- No reactive updates
- Fast and lightweight

**Example:**
```tsx
render(<App />, { mode: 'static' });
```

### Interactive Mode

**Use Case:** Interactive applications (forms, menus)

**Behavior:**
- Continuous rendering
- Keyboard and mouse input
- Reactive updates
- Focus management
- Tab navigation

**Example:**
```tsx
render(<App />, { mode: 'interactive' });
```

### Fullscreen Mode

**Use Case:** Full-screen applications (dashboards, editors)

**Behavior:**
- Takes over entire terminal
- Continuous rendering
- All input handling
- Full reactive updates

**Example:**
```tsx
render(<App />, { mode: 'fullscreen' });
```

## Layout System

### Flexbox Layout

**Supported Properties:**
- `flexDirection` - row, column
- `justifyContent` - flex-start, center, flex-end, space-between, space-around
- `alignItems` - flex-start, center, flex-end, stretch
- `flexWrap` - nowrap, wrap
- `gap` - spacing between items

**Calculation Flow:**
```
Parent Dimensions → Child Constraints → Flex Calculation → Final Dimensions
```

### Grid Layout

**Supported Properties:**
- `gridTemplateColumns` - Column definitions
- `gridTemplateRows` - Row definitions
- `gridGap` - Gap between grid items
- `gridColumn` / `gridRow` - Item placement

**Calculation Flow:**
```
Grid Definition → Item Placement → Size Calculation → Final Layout
```

### Responsive Sizing

**Supported Units:**
- **Fixed:** `100` (characters)
- **Percentage:** `"50%"` (of parent)
- **Viewport:** `"80vw"`, `"80vh"` (of terminal)
- **Character:** `"80ch"` (character units)

**Resolution Flow:**
```
Responsive Value → Terminal Dimensions → Parent Dimensions → Resolved Value
```

## Event System

### Keyboard Events

**Flow:**
```
Raw Input → ANSI Parser → KeyPress Object → Component Handler
```

**KeyPress Structure:**
```typescript
{
  key: {
    return: boolean;
    escape: boolean;
    tab: boolean;
    backspace: boolean;
    // ... more keys
  };
  ctrl: boolean;
  shift: boolean;
  meta: boolean;
}
```

### Mouse Events

**Flow:**
```
Raw Input → Mouse Parser → MouseEvent Object → Component Handler
```

**MouseEvent Structure:**
```typescript
{
  x: number;
  y: number;
  button: number; // 0=left, 1=middle, 2=right
  eventType: 'press' | 'release' | 'drag';
}
```

## Focus Management

### Focus Flow

```
Tab Key → Focus Collection → Tab Index Sort → Focus Next → Update State → Re-render
```

**Components:**
1. **Collection:** `collectInteractiveComponents()` - Finds all focusable components
2. **Tab Index Assignment:** `assignTabIndexes()` - Assigns tab indexes
3. **Navigation:** `handleTabNavigation()` - Handles Tab/Shift+Tab
4. **Focus Update:** `focusComponent()` - Updates focus state
5. **Re-render:** Triggers reconciliation

### Focus Trapping

**Overlay Focus Trapping:**
- When overlay is open, focus is trapped within overlay
- Tab navigation only cycles through overlay components
- Focus returns to previous component when overlay closes

## Performance Optimizations

### 1. Memoization

**Layout Calculations:**
- Memoized layout results
- Only recalculates on dimension/style changes
- Reduces unnecessary calculations

### 2. Batching

**Update Batching:**
- Batches multiple state updates
- Single re-render for multiple updates
- Reduces render cycles

### 3. Incremental Rendering

**Partial Updates:**
- Only re-renders changed nodes
- Preserves unchanged output
- Faster updates

### 4. Lazy Evaluation

**Conditional Rendering:**
- Only renders visible components
- Skips hidden/disabled components
- Reduces render overhead

## Memory Management

### Component Bounds Registry

**Purpose:** Track component positions for hit testing

**Structure:**
- Maps ConsoleNode to bounding box
- Used for mouse click detection
- Cleared on unmount

### Output Buffer

**Purpose:** Collect rendered output before flushing

**Structure:**
- Array of lines (strings)
- ANSI codes embedded
- Flushed to stdout periodically

## Error Handling

### Error Boundaries

**Purpose:** Catch rendering errors

**Behavior:**
- Catches errors in component tree
- Displays error message
- Prevents app crash

### Error Reporting

**Purpose:** Report errors for debugging

**Functions:**
- `reportError()` - Reports errors
- `ErrorType` - Error classification
- Error logging and recovery

## Summary

The React Console renderer is a sophisticated system that:

1. **Uses React Reconciler** for component lifecycle management
2. **Maps React to ConsoleNode** via host config
3. **Calculates Layout** using flexbox/grid algorithms
4. **Renders Nodes** using type-specific renderers
5. **Manages Output** through buffered output system
6. **Handles Input** via keyboard/mouse parsers
7. **Manages Focus** with automatic tab navigation
8. **Optimizes Performance** through memoization and batching

This architecture provides a React-like development experience while outputting to the terminal, making it easy to build complex terminal applications with familiar React patterns.
