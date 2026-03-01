# node-ps1-dotnet Examples

Examples demonstrating how to use the `node-ps1-dotnet` library to build Windows desktop applications with Node.js and .NET.

## Prerequisites

- Windows 10/11
- Node.js 18+ (LTS version recommended)
- PowerShell 5.1 (built-in on Windows)
- .NET Framework 4.5+ (pre-installed on Windows 10/11)

## Installation

```bash
npm install
```

This will install the `@devscholar/node-ps1-dotnet` package from npm.

## Running Examples

### Console Examples

```bash
node start.js src/console/console-input/console-input.ts
node start.js src/console/await-delay/await-delay.ts
```

### WinForms Examples

```bash
node start.js src/winforms/counter/counter.ts
node start.js src/winforms/drag-box/drag-box.ts
```

### WPF Examples

```bash
node start.js src/wpf/counter/counter.ts
node start.js src/wpf/drag-box/drag-box.ts
node start.js src/wpf/webview2-browser/webview2-browser.ts
```

### Specifying a Runtime

You can also specify a runtime:

```bash
node start.js src/winforms/counter/counter.ts --runtime=deno
node start.js src/winforms/counter/counter.ts --runtime=bun
node start.js src/winforms/counter/counter.ts --runtime=node
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
