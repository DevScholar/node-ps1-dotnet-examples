// Run: node start.js src/wpf/webview2-custom-protocol/webview2-custom-protocol.ts
//
// Demonstrates WebView2 custom protocol support using node-ps1-dotnet.
// Mirrors: https://www.meziantou.net/supporting-custom-protocols-in-webview2.htm
//
// Key patterns used:
//   - CoreWebView2CustomSchemeRegistration + CoreWebView2EnvironmentOptions
//     (requires IList<T> property setter support added to node-ps1-dotnet)
//   - CoreWebView2Environment.CreateAsync() → dotnet.awaitTask()
//   - webView.EnsureCoreWebView2Async(env) → dotnet.awaitTask()
//   - webView.addSync_WebResourceRequested() for synchronous response
//     (C# thread blocked until JS sets e.Response — same semantics as C# event handler)

import dotnet from '@devscholar/node-ps1-dotnet';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.join(__dirname, '..', '..', '..');
const RUNTIMES_DIR = path.join(PROJECT_ROOT, 'runtimes', 'webview2');
const currentVersionFile = path.join(RUNTIMES_DIR, 'current.txt');

let webview2LibPath: string;
if (fs.existsSync(currentVersionFile)) {
    const version = fs.readFileSync(currentVersionFile, 'utf-8').trim();
    webview2LibPath = path.join(RUNTIMES_DIR, version);
} else {
    webview2LibPath = path.join(__dirname, 'WebView2Libs');
    console.log('\x1b[33mWarning: WebView2 not installed. Run: node scripts/webview2-install.js install\x1b[0m');
}

const coreDllPath = path.join(webview2LibPath, 'Microsoft.Web.WebView2.Core.dll');
const wpfDllPath = path.join(webview2LibPath, 'Microsoft.Web.WebView2.Wpf.dll');

if (!fs.existsSync(coreDllPath) || !fs.existsSync(wpfDllPath)) {
    console.error('\x1b[31mError: WebView2 DLLs not found!\x1b[0m');
    console.error('Please run: node scripts/webview2-install.js install');
    process.exit(1);
}

const System = dotnet.System as any;
const Windows = System.Windows;
const Controls = System.Windows.Controls;

const CoreAssembly = System.Reflection.Assembly.LoadFrom(coreDllPath);
const WebView2WpfAssembly = System.Reflection.Assembly.LoadFrom(wpfDllPath);

const WebView2Type = WebView2WpfAssembly.GetType('Microsoft.Web.WebView2.Wpf.WebView2');
const CoreWebView2EnvironmentType = CoreAssembly.GetType('Microsoft.Web.WebView2.Core.CoreWebView2Environment');
const CoreWebView2EnvironmentOptionsType = CoreAssembly.GetType('Microsoft.Web.WebView2.Core.CoreWebView2EnvironmentOptions');
const CoreWebView2CustomSchemeRegistrationType = CoreAssembly.GetType('Microsoft.Web.WebView2.Core.CoreWebView2CustomSchemeRegistration');
const CoreWebView2WebResourceContextType = CoreAssembly.GetType('Microsoft.Web.WebView2.Core.CoreWebView2WebResourceContext');

// CoreWebView2WebResourceContext.All enum value
const CoreWebView2WebResourceContextAll = CoreWebView2WebResourceContextType.All;

// Build custom scheme registration for "myapp://"
const schemeReg = new CoreWebView2CustomSchemeRegistrationType('myapp');
schemeReg.TreatAsSecure = true;        // avoid mixed content errors
schemeReg.HasAuthorityComponent = false;

// CoreWebView2EnvironmentOptions.CustomSchemeRegistrations is IList<T> —
// node-ps1-dotnet now supports IList<T> in property setters.
const envOptions = new CoreWebView2EnvironmentOptionsType();
envOptions.CustomSchemeRegistrations = [schemeReg];

const webView = new WebView2Type();

const browserWindow = new Windows.Window();
browserWindow.Title = 'WebView2 Custom Protocol';
browserWindow.Width = 700;
browserWindow.Height = 500;
browserWindow.WindowStartupLocation = Windows.WindowStartupLocation.CenterScreen;

const grid = new Controls.Grid();
browserWindow.Content = grid;
grid.Children.Add(webView);

browserWindow.add_Closed((_sender: any, _e: any) => {
    process.exit(0);
});

// Start WPF application in background (polling mode).
// app.Run() returns immediately in JS while WPF runs in background.
const app = new Windows.Application();
app.Run(browserWindow);

// After Application.Run() we can do async setup.
// EnsureCoreWebView2Async with a custom environment MUST be called before
// the WebView2 auto-initializes (i.e. before setting Source).
const env = await dotnet.awaitTask(
    CoreWebView2EnvironmentType.CreateAsync(null, envOptions)
);
await dotnet.awaitTask(webView.EnsureCoreWebView2Async(env));

const coreWebView2 = webView.CoreWebView2;

// Register the filter — all requests under myapp://
coreWebView2.AddWebResourceRequestedFilter('myapp://*', CoreWebView2WebResourceContextAll);

// addSync_WebResourceRequested: C# blocks the WebView2 thread until our handler
// returns, exactly like a synchronous C# event handler.  We can safely set
// e.Response before returning without needing GetDeferral().
coreWebView2.add_WebResourceRequested((_sender: any, e: any) => {
    const method: string = e.Request.Method;
    const uri: string   = e.Request.Uri;

    let html: string;

    if (method === 'GET' && uri === 'myapp://home/') {
        html = `<!DOCTYPE html>
<html>
<body>
  <h1>Custom Protocol: myapp://</h1>
  <p>This page is served from the Node.js process via a custom WebView2 protocol.</p>
  <a href="myapp://page2/">Go to Page 2</a>
</body>
</html>`;
    } else if (method === 'GET' && uri === 'myapp://page2/') {
        html = `<!DOCTYPE html>
<html>
<body>
  <h1>Page 2</h1>
  <p>You navigated here via the custom protocol.</p>
  <a href="myapp://home/">Back to Home</a>
</body>
</html>`;
    } else {
        // 404 for unknown paths
        html = `<h1>404 Not Found</h1><p>${uri}</p>`;
        const notFoundBytes = System.Text.Encoding.UTF8.GetBytes(html);
        const notFoundStream = new System.IO.MemoryStream(notFoundBytes);
        e.Response = coreWebView2.Environment.CreateWebResourceResponse(
            notFoundStream, 404, 'Not Found', 'Content-Type: text/html; charset=utf-8'
        );
        return;
    }

    // GetBytes returns a .NET byte[] which becomes a JS number array.
    // MemoryStream constructor accepts byte[] — ConvertArgsForMethod handles the conversion.
    const bytes = System.Text.Encoding.UTF8.GetBytes(html);
    const stream = new System.IO.MemoryStream(bytes);

    e.Response = coreWebView2.Environment.CreateWebResourceResponse(
        stream, 200, 'OK', 'Content-Type: text/html; charset=utf-8'
    );
});

// Navigate to our custom protocol home page
const homeUri = new System.Uri('myapp://home/');
webView.Source = homeUri;

console.log('WebView2 custom protocol example running. Navigate to myapp://home/');
