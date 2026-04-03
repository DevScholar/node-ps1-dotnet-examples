// Run: node start.js src/wpf/webview2-custom-protocol/webview2-custom-protocol.ts
//
// Demonstrates WebView2 custom protocol support using node-ps1-dotnet.
// Mirrors: https://www.meziantou.net/supporting-custom-protocols-in-webview2.htm
//
// Key patterns used:
//   - CoreWebView2CustomSchemeRegistration + CoreWebView2EnvironmentOptions
//   - CoreWebView2Environment.CreateAsync() with temp userDataFolder
//   - addSync_WebResourceRequested: handler returns {html, statusCode, reasonPhrase},
//     C# creates the WebResourceResponse directly (no nested IPC calls needed)

import dotnet from '@devscholar/node-ps1-dotnet';
import * as fs from 'node:fs';
import * as os from 'node:os';
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

// Temp directory for WebView2 user data — cleaned up on exit
const USER_DATA_FOLDER = fs.mkdtempSync(path.join(os.tmpdir(), 'webview2-'));

function cleanupUserData() {
    try {
        if (fs.existsSync(USER_DATA_FOLDER)) {
            fs.rmSync(USER_DATA_FOLDER, { recursive: true, force: true });
        }
    } catch {}
}
process.on('exit', cleanupUserData);
process.on('SIGINT', () => { cleanupUserData(); process.exit(0); });

const System = dotnet.System as any;
const Windows = System.Windows;
const Controls = System.Windows.Controls;

const CoreAssembly = System.Reflection.Assembly.LoadFrom(coreDllPath);
const WebView2WpfAssembly = System.Reflection.Assembly.LoadFrom(wpfDllPath);

const WebView2Type = WebView2WpfAssembly.GetType('Microsoft.Web.WebView2.Wpf.WebView2');
const CoreWebView2EnvironmentType = CoreAssembly.GetType('Microsoft.Web.WebView2.Core.CoreWebView2Environment');
const CoreWebView2EnvironmentOptionsType = CoreAssembly.GetType('Microsoft.Web.WebView2.Core.CoreWebView2EnvironmentOptions');
const CoreWebView2CustomSchemeRegistrationType = CoreAssembly.GetType('Microsoft.Web.WebView2.Core.CoreWebView2CustomSchemeRegistration');

const CoreWebView2WebResourceContextAll = 0; // enum CoreWebView2WebResourceContext.All

// Build custom scheme registration for "myapp://"
const schemeReg = new CoreWebView2CustomSchemeRegistrationType('myapp');
schemeReg.TreatAsSecure = true;
schemeReg.HasAuthorityComponent = false;

const envOptions = new CoreWebView2EnvironmentOptionsType(null, null, null, false, [schemeReg]);

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

const app = new Windows.Application();
app.Run(browserWindow);

// Async WebView2 init after Application.Run()
const delayTask = System.Threading.Tasks.Task.Delay(100);
await dotnet.awaitTask(delayTask);

const createAsyncTask = CoreWebView2EnvironmentType.CreateAsync(null, USER_DATA_FOLDER, envOptions);
try {
    const env = await createAsyncTask;
    await webView.EnsureCoreWebView2Async(env);
} catch (err: any) {
    console.error('WebView2 init error:', err.message);
    process.exit(1);
}

const coreWebView2 = webView.CoreWebView2;
coreWebView2.AddWebResourceRequestedFilter('myapp://*', CoreWebView2WebResourceContextAll);

// addSync_WebResourceRequested: handler returns {html, statusCode, reasonPhrase}.
// C# creates the MemoryStream + WebResourceResponse directly — nested IPC calls
// inside sync event handlers deadlock due to pipe write blocking.
coreWebView2.addSync_WebResourceRequested((_sender: any, e: any) => {
    const request = e.Request;
    const method: string = request.Method;
    const uri: string = request.Uri;

    if (method === 'GET' && uri === 'myapp://home/') {
        return {
            statusCode: 200, reasonPhrase: 'OK',
            html: `<!DOCTYPE html>
<html>
<body>
  <h1>Custom Protocol: myapp://</h1>
  <p>This page is served from the Node.js process via a custom WebView2 protocol.</p>
  <a href="myapp://page2/">Go to Page 2</a>
</body>
</html>`
        };
    }

    if (method === 'GET' && uri === 'myapp://page2/') {
        return {
            statusCode: 200, reasonPhrase: 'OK',
            html: `<!DOCTYPE html>
<html>
<body>
  <h1>Page 2</h1>
  <p>You navigated here via the custom protocol.</p>
  <a href="myapp://home/">Back to Home</a>
</body>
</html>`
        };
    }

    return {
        statusCode: 404, reasonPhrase: 'Not Found',
        html: `<h1>404 Not Found</h1><p>${uri}</p>`
    };
});

const homeUri = new System.Uri('myapp://home/');
webView.Source = homeUri;

console.log('WebView2 custom protocol example running.');
