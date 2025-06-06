# Code Vision - Visual Studio Code Extension

[![Version](https://img.shields.io/visual-studio-marketplace/v/CodeVision.codevision.svg)](https://marketplace.visualstudio.com/items?itemName=CodeVision.codevision)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/CodeVision.codevision.svg)](https://marketplace.visualstudio.com/items?itemName=CodeVision.codevision)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/CodeVision.codevision.svg)](https://marketplace.visualstudio.com/items?itemName=CodeVision.codevision)

## Overview

Code Vision is a Visual Studio Code extension that visualizes function call relationships in your codebase using a butterfly graph (Call Tree). This visualization helps developers better understand and explore their code by showing both callers and callees of selected functions.

![Demo](img/demo.gif)

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
   ext install CodeVision
   ```
4. Click the Install button

## Usage

1. Open a supported source code file
2. Right-click on any function
3. Select "Show Butterfly Graph" from the context menu
4. The butterfly graph will appear in a new panel

### Basic Controls

- **Double-click a node**: Jump to function definition
- **Use mouse wheel**: Zoom in/out
- **Click and drag**: Move the node

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

- Visual Studio Code 1.99.1 or higher
- Language Server Protocol (LSP) support for your programming language
  - For C/C++: Install "C/C++" extension (ms-vscode.cpptools)
  - For Python: Install "Python" extension (ms-python.python)

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Cytoscape.js](https://js.cytoscape.org/) for graph visualization
- VS Code Extension API
- Language Server Protocol

---

**Note**: This extension is currently in active development. Some features may change or be added in future updates.
