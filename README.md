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
node start.js src/winforms/blocking-dialog/blocking-dialog.ts
```

### WPF Examples

```bash
node start.js src/wpf/counter/counter.ts
node start.js src/wpf/drag-box/drag-box.ts
node start.js src/wpf/webview2-browser/webview2-browser.ts
node start.js src/wpf/blocking-dialog/blocking-dialog.ts
```

### Specifying a Runtime

You can also specify a runtime:

```bash
deno run --allow-all start.js src/winforms/counter/counter.ts --runtime=deno
bun start.js src/winforms/counter/counter.ts --runtime=bun
node start.js src/winforms/counter/counter.ts --runtime=node
```

## Examples

| Example | Description |
|---------|-------------|
| `console/console-input` | Console input demo |
| `console/await-delay` | Demo of async/await with .NET |
| `winforms/counter` | WinForms counter application |
| `winforms/drag-box` | WinForms draggable box demo |
| `winforms/blocking-dialog` | WinForms blocking dialog demo - shows a modal dialog that blocks Node.js execution until closed |
| `wpf/counter` | WPF counter application |
| `wpf/drag-box` | WPF draggable box demo |
| `wpf/webview2-browser` | WPF WebView2 browser demo |
| `wpf/blocking-dialog` | WPF blocking dialog demo - shows a modal dialog that blocks Node.js execution until closed |

## Blocking Dialog vs Regular Window

A **blocking dialog** uses `ShowDialog()` instead of `Application.Run()`. This is a key difference:

- **`ShowDialog()`** - Opens a modal dialog that blocks the calling code until the dialog is closed. The Node.js code waits for the user's input and then continues execution. This is useful for input forms, confirmation dialogs, etc.

- **`Application.Run()`** - Starts a message pump and runs the application until the window is closed. The code after `Run()` doesn't execute until the application exits.

The blocking dialog examples demonstrate how to get user input from a GUI dialog and process it in Node.js after the dialog closes.
