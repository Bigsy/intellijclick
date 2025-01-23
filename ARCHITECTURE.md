# VSCode Intellij Clicks Extension Architecture

## Overview
A VS Code extension that enhances selection behavior to mimic IntelliJ's smart selection capabilities, particularly for paired characters (brackets, quotes).

## Key Components

### 1. Core System
- **Entry Point**: `src/index.ts`
  - Manages extension activation/deactivation
  - Handles text editor selection changes
  - Implements debouncing logic for click handling
  - Delegates to rule handlers

```ts
// Simplified activation flow
window.onDidChangeTextEditorSelection → 
debounce logic → 
trigger handler execution → 
apply selection changes
```

### 2. Rule Handling System
- **Base Interface**: `Handler` (`types.ts`)
  ```ts
  interface Handler {
    name: string;
    handle(context: HandlerContext): Selection | Range | void;
  }
  ```
  
- **Character Pair Implementation**: `src/rules/character-pair.ts`
  - Supports brackets: `()`, `[]`, `{}`, `<>`
  - Supports quotes: `""`, `''`, ````
  - Bidirectional scanning logic
  - Nesting-aware selection expansion
  - Special handling for quotes

### 3. Configuration System
- **VS Code Settings** (`package.json` contributions):
  ```json
  "intellijClicks.clicksInterval": 600,
  "intellijClicks.triggerDelay": 150,
  "intellijClicks.rules.character-pair": true
  ```
  
- **Runtime Configuration Access**:
  ```ts
  const config = workspace.getConfiguration('intellijClicks');
  ```

### 4. Build System
- **ESBuild Configuration**: `build.js`
  - Produces single-file bundle
  - Watch mode support
- **Package Scripts**:
  ```json
  "scripts": {
    "build": "node build.js",
    "dev": "node build.js --watch",
    "publish": "vsce publish --no-dependencies"
  }
  ```

## Architectural Patterns

1. **Plugin Architecture**
- Rule handlers are self-contained modules
- New rules can be added without core changes
- Configuration-driven enable/disable

2. **Event-Driven Design**
- Leverages VS Code's event system
- Efficient debouncing for performance

3. **Immutable Selections**
- Uses VS Code's Position/Range/Selection objects
- Pure functions for selection transformations

## Development Practices

1. **Type Safety**
- Strict TypeScript configuration
- Clear type definitions for handler contracts

2. **Modular Structure**
- Separation of concerns:
  - Core logic (`index.ts`)
  - Rule implementations (`rules/`)
  - Shared utilities (`utils.ts`)

3. **Configuration First**
- All magic numbers controlled via settings
- Clear configuration schema in package.json

## Flow Diagram

```mermaid
graph TD
    A[User Click] --> B(Selection Change Event)
    B --> C{Meets Timing Criteria?}
    C -->|Yes| D[Execute Handler Chain]
    D --> E{Character Pair Match?}
    E -->|Yes| F[Expand Selection]
    E -->|No| G[Default Behavior]
    F --> H[Update Editor Selections]
