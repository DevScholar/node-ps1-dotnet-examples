// Run: node ../node-ps1-dotnet/start.js src/wpf/webview2-browser/webview2-browser.ts
import dotnet from '@devscholar/node-ps1-dotnet';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RUNTIMES_DIR = path.join(__dirname, '..', '..', '..', 'runtimes', 'webview2');
const currentVersionFile = path.join(RUNTIMES_DIR, 'current');

let webview2LibPath: string;

if (fs.existsSync(currentVersionFile)) {
    const version = fs.readFileSync(currentVersionFile, 'utf-8').trim();
    webview2LibPath = path.join(RUNTIMES_DIR, version);
} else {
    webview2LibPath = path.join(__dirname, 'WebView2Libs');
    
    console.log('\x1b[33mWarning: WebView2 not installed via webview2-install.js\x1b[0m');
    console.log('Please run:');
    console.log('  node scripts/webview2-install.js install');
    console.log('Or manually ensure DLLs exist in:', webview2LibPath);
    console.log('');
}

const System = dotnet.System as any;
const Windows = System.Windows;
const Controls = System.Windows.Controls;

const coreDllPath = path.join(webview2LibPath, 'Microsoft.Web.WebView2.Core.dll');
const wpfDllPath = path.join(webview2LibPath, 'Microsoft.Web.WebView2.Wpf.dll');

if (!fs.existsSync(coreDllPath) || !fs.existsSync(wpfDllPath)) {
    console.error('\x1b[31mError: WebView2 DLLs not found!\x1b[0m');
    console.error('Please run: node ../node-ps1-dotnet/scripts/webview2-install.js install');
    process.exit(1);
}

try {
    System.Reflection.Assembly.LoadFrom(coreDllPath);
    System.Reflection.Assembly.LoadFrom(wpfDllPath);
} catch (e) {
    console.error("WebView2 Dll Load Failed:", e);
    process.exit(1);
}

const WebView2WpfAssembly = System.Reflection.Assembly.LoadFrom(wpfDllPath);

import os from 'node:os';
const USER_DATA_FOLDER = fs.mkdtempSync(path.join(os.tmpdir(), 'webview2-'));
const COUNTER_HTML_PATH = path.join(__dirname, 'counter.html');

console.log('--- Initializing WebView2 (Counter App) ---');
console.log('User data folder:', USER_DATA_FOLDER);

process.on('exit', () => {
    try {
        if (fs.existsSync(USER_DATA_FOLDER)) {
            fs.rmSync(USER_DATA_FOLDER, { recursive: true, force: true });
            console.log('Cleaned up temp folder:', USER_DATA_FOLDER);
        }
    } catch (e) { }
});

process.on('SIGINT', () => {
    try {
        if (fs.existsSync(USER_DATA_FOLDER)) {
            fs.rmSync(USER_DATA_FOLDER, { recursive: true, force: true });
        }
    } catch (e) { }
    process.exit(0);
});

const WebView2Type = WebView2WpfAssembly.GetType('Microsoft.Web.WebView2.Wpf.WebView2');
const webView = new WebView2Type();

const CreationPropertiesType = WebView2WpfAssembly.GetType('Microsoft.Web.WebView2.Wpf.CoreWebView2CreationProperties');
const props = new CreationPropertiesType();
props.UserDataFolder = USER_DATA_FOLDER;
props.Language = "zh-CN";
webView.CreationProperties = props;

const browserWindow = new Windows.Window();
browserWindow.Title = 'Counter App - WebView2';
browserWindow.Width = 500;
browserWindow.Height = 400;
browserWindow.WindowStartupLocation = Windows.WindowStartupLocation.CenterScreen;

const grid = new Controls.Grid();
browserWindow.Content = grid;
grid.Children.Add(webView);

webView.add_CoreWebView2InitializationCompleted((sender: any, e: any) => {
    if (e.IsSuccess) {
        console.log('WebView2 Initialized Successfully');

        const coreWebView2 = webView.CoreWebView2;

        coreWebView2.add_WebMessageReceived((sender2: any, e2: any) => {
            const message = e2.TryGetWebMessageAsString();
            if (message) {
                console.log('[WebView2] ' + message);
            }
        });

        const script = `
            (function() {
                var originalLog = console.log;
                console.log = function(msg) {
                    originalLog(msg);
                    if (window.chrome && window.chrome.webview) {
                        window.chrome.webview.postMessage(msg);
                    }
                };
            })();
        `;
        coreWebView2.ExecuteJavaScript(script);
    } else {
        console.error('FAILURE: Init failed', e.InitializationException?.Message);
    }
});

webView.add_NavigationCompleted((sender: any, e: any) => {
    console.log('Page Loaded Successfully');
});

webView.Source = new System.Uri(COUNTER_HTML_PATH);

browserWindow.add_Closed((sender: any, e: any) => {
    process.exit(0);
});

const app = new Windows.Application();
app.Run(browserWindow);
