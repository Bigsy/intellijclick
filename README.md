# IntellijClicks

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/billhedworth.IntellijClick)](https://marketplace.visualstudio.com/items?itemName=billhedworth.IntellijClick)

A VS Code extension that enhances selection behavior to mimic IntelliJ's smart selection capabilities, particularly for paired characters like brackets and quotes.

## Features

- Smart selection of content within paired characters:
  - Brackets: `()`, `[]`, `{}`, `<>`
  - Quotes: `""`, `''`, ````
- Bidirectional scanning with nesting awareness
- Configurable timing for click detection
- Seamless integration with VS Code's selection system

## Usage

Double-click near paired characters to select their inner content including the paired chars:

```js
▽
 (foo, bar)
 └────────┘

▽
 "hello world"
 └───────────┘
```

## Configuration

This extension can be customized through VS Code settings:

```jsonc
{
  // Interval between clicks in milliseconds
  "intellijClicks.clicksInterval": 600,

  // Delay after triggering selection to prevent conflicts
  "intellijClicks.triggerDelay": 150,

  // Enable/disable character pair selection
  "intellijClicks.rules.character-pair": true
}
```

## Requirements

- VS Code version 1.92.0 or higher

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Development commands:
   ```bash
   npm run dev    # Watch mode
   npm run build  # Production build
   npm run pack   # Create VSIX package
