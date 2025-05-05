# Butterfly Function - Visual Studio Code Extension

[![Version](https://img.shields.io/visual-studio-marketplace/v/your-extension-id.svg)](https://marketplace.visualstudio.com/items?itemName=your-extension-id)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/your-extension-id.svg)](https://marketplace.visualstudio.com/items?itemName=your-extension-id)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/your-extension-id.svg)](https://marketplace.visualstudio.com/items?itemName=your-extension-id)

## Overview

Butterfly Function is a Visual Studio Code extension that visualizes function call relationships in your codebase using a butterfly graph. This visualization helps developers better understand and explore their code by showing both callers and callees of selected functions.

![Demo](path/to/demo.gif)

## Features

- **Interactive Function Call Visualization**
  - Display function call relationships in a butterfly graph format
  - Central node shows the selected function
  - Left side shows calling functions
  - Right side shows called functions

- **Supported Languages**
  - C/C++
  - Python
  - (More languages coming soon)

- **Key Features**
  - Right-click on any function to view its butterfly graph
  - Double-click nodes to jump to function definitions
  - Configurable depth for caller and callee hierarchies
  - Customizable node display limits per level

## Installation

1. Open Visual Studio Code
2. Press `Ctrl+P` to open the Quick Open dialog
3. Paste the following command and press Enter:
   ```
   ext install your-extension-id
   ```
4. Click the Install button

## Usage

1. Open a supported source code file
2. Right-click on any function
3. Select "Show Butterfly Graph" from the context menu
4. The butterfly graph will appear in a new panel

### Basic Controls

- **Double-click a node**: Jump to function definition
- **Hover over a node**: View function details
- **Use mouse wheel**: Zoom in/out
- **Click and drag**: Pan the graph

## Configuration

The extension can be configured through VS Code settings:

```json
{
  "butterflyGraph.callerLevels": 2,        // Number of caller hierarchy levels
  "butterflyGraph.calleeLevels": 2,        // Number of callee hierarchy levels
  "butterflyGraph.maxNodesPerLevel": 10,   // Maximum nodes per level
  "butterflyGraph.theme": "default"        // Graph color theme
}
```

## Requirements

- Visual Studio Code 1.60.0 or higher
- Language Server Protocol (LSP) support for your programming language

## Known Issues

- Large codebases may experience slower performance
- Some dynamic language features may not be fully supported
- Limited support for certain language-specific features

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development

### Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher
- Visual Studio Code Extension Development Tools

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/butterfly-function.git
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Open in VS Code
   ```bash
   code .
   ```
4. Press F5 to start debugging

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Cytoscape.js](https://js.cytoscape.org/) for graph visualization
- VS Code Extension API
- Language Server Protocol

## Support

- [GitHub Issues](https://github.com/your-username/butterfly-function/issues)
- [Documentation](https://github.com/your-username/butterfly-function/wiki)

---

**Note**: This extension is currently in active development. Some features may change or be added in future updates.
