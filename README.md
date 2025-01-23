# VSCode Intellij Clicks

[![Version](https://img.shields.io/visual-studio-marketplace/v/antfu.Intellij-clicks)](https://marketplace.visualstudio.com/items?itemName=antfu.Intellij-clicks)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A VS Code extension that enhances selection behavior to mimic IntelliJ's smart selection capabilities, particularly for paired characters like brackets and quotes.

## Features

- Smart selection of content within paired characters:
  - Brackets: `()`, `[]`, `{}`, `<>`
  - Quotes: `""`, `''`, ````
- Bidirectional scanning with nesting awareness
- Configurable timing for click detection
- Seamless integration with VS Code's selection system

## Usage

Double-click near paired characters to select their inner content:

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
  "smartClicks.clicksInterval": 600,

  // Delay after triggering selection to prevent conflicts
  "smartClicks.triggerDelay": 150,

  // Enable/disable character pair selection
  "smartClicks.rules.character-pair": true
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
   ```

### Architecture

The extension follows a plugin-based architecture with these key components:

- **Core System**: Handles extension lifecycle and selection events
- **Rule System**: Modular handlers for different selection behaviors
- **Configuration**: Flexible settings for customization

For detailed technical information, see [ARCHITECTURE.md](ARCHITECTURE.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE) © Bill Hedworth

## Links

- [GitHub Repository](https://github.com/bigsy/vscode-intellij-clicks)
- [Issue Tracker](https://github.com/antfu/vscode-smart-clicks/issues)
- [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=antfu.Intellij-clicks)
