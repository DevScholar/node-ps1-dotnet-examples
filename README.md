# node-ps1-dotnet Examples

Examples demonstrating how to use the `node-ps1-dotnet` library to build Windows desktop applications with Node.js and .NET.

## Prerequisites

- Windows 10/11
- Node.js 22+
- PowerShell 5.1 (built-in on Windows)
- .NET Framework 4.5+ (pre-installed on Windows 10/11)

## Installation

```bash
npm install
```

This will install the `@devscholar/node-ps1-dotnet` package as a local dependency from `../node-ps1-dotnet`.

## Running Examples

### Using npm scripts

```bash
npm run console-input       # Console input demo
npm run await-delay         # Console await delay demo
npm run winforms-counter    # WinForms Counter App
npm run winforms-drag-box   # WinForms Draggable Box
npm run wpf-counter         # WPF Counter App
npm run wpf-drag-box        # WPF Draggable Box
npm run wpf-webview2        # WPF WebView2 Browser
```

### Using node directly

```bash
node ../node-ps1-dotnet/start.js src/winforms/counter/counter.ts
```

You can also specify a runtime:

```bash
node ../node-ps1-dotnet/start.js src/winforms/counter/counter.ts --runtime=deno
node ../node-ps1-dotnet/start.js src/winforms/counter/counter.ts --runtime=bun
node ../node-ps1-dotnet/start.js src/winforms/counter/counter.ts --runtime=node
```

## Examples

| Example | Description |
|---------|-------------|
| `console/console-input` | Console input demo |
| `console/await-delay` | Demo of async/await with .NET |
| `winforms/counter` | WinForms counter application |
| `winforms/drag-box` | WinForms draggable box demo |
| `wpf/counter` | WPF counter application |
| `wpf/drag-box` | WPF draggable box demo |
| `wpf/webview2-browser` | WPF WebView2 browser demo |
