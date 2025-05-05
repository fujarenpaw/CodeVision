# Contributing to Code Vision

Thank you for your interest in contributing to Code Vision! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read it before contributing.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps to reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include screenshots if possible
- Include the version of VS Code and the extension
- Include the operating system you're using

### Suggesting Enhancements

If you have a suggestion for a new feature or enhancement, please include as much detail as possible:

- Use a clear and descriptive title
- Provide a detailed description of the proposed functionality
- Explain why this enhancement would be useful
- List any similar features in other extensions

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher
- Visual Studio Code Extension Development Tools

## Development Setup

1. Clone the repository
   ```bash
   git clone https://github.com/fujarenpaw/CodeVision.git
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

## Coding Standards

- Use TypeScript for all new code
- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Write unit tests for new features

### TypeScript Guidelines

- Use strict type checking
- Avoid using `any` type
- Use interfaces for object shapes
- Use enums for fixed sets of values
- Use async/await instead of raw promises

## Commit Messages

Please follow these guidelines for commit messages:

- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the documentation with any new features
3. Make sure all tests pass

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

- `bug` - Issues that are bugs
- `enhancement` - Issues that are feature requests
- `documentation` - Issues that need documentation updates
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed

## Questions?

Feel free to open an issue for any questions you might have about contributing. 