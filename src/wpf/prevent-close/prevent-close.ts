// Run: node ../node-ps1-dotnet/start.js src/wpf/prevent-close/prevent-close.ts
//
// Demonstrates WPF Window.Closing event as an onbeforeunload equivalent.
//
// Setting e.Cancel = true inside Closing prevents the window from closing —
// the same mechanism real WPF apps use to intercept the × button.
// The Quit button sets a JS flag to allow the close, then calls app.Shutdown().
import dotnet from '@devscholar/node-ps1-dotnet';

dotnet.load('PresentationFramework');
dotnet.load('PresentationCore');
dotnet.load('WindowsBase');

const System = dotnet.System as any;
const Windows = System.Windows;
const Controls = System.Windows.Controls;
const Media = System.Windows.Media;

console.log("--- WPF Prevent Close Demo ---");

const mainWindow = new Windows.Window();
mainWindow.Title = "Prevent Close Demo";
mainWindow.Width = 400;
mainWindow.Height = 220;
mainWindow.WindowStartupLocation = Windows.WindowStartupLocation.CenterScreen;
mainWindow.ResizeMode = Windows.ResizeMode.CanMinimize;

const stackPanel = new Controls.StackPanel();
stackPanel.Margin = new Windows.Thickness(20);
stackPanel.HorizontalAlignment = Windows.HorizontalAlignment.Center;
stackPanel.VerticalAlignment = Windows.VerticalAlignment.Center;

const statusLabel = new Controls.Label();
statusLabel.Content = "The × button is disabled.\nUse the \"Quit\" button to close.";
statusLabel.FontSize = 14;
statusLabel.FontFamily = new Media.FontFamily("Segoe UI");
statusLabel.HorizontalContentAlignment = Windows.HorizontalAlignment.Center;
statusLabel.Margin = new Windows.Thickness(0, 0, 0, 20);
stackPanel.Children.Add(statusLabel);

const quitButton = new Controls.Button();
quitButton.Content = "Quit";
quitButton.FontSize = 14;
quitButton.Width = 120;
quitButton.Padding = new Windows.Thickness(10, 6, 10, 6);
quitButton.HorizontalAlignment = Windows.HorizontalAlignment.Center;
stackPanel.Children.Add(quitButton);

mainWindow.Content = stackPanel;

let allowClose = false;

// Clicking the dedicated Quit button allows the window to close.
quitButton.add_Click((sender: any, e: any) => {
    console.log('Quit button clicked — closing window.');
    allowClose = true;
    app.Shutdown();
});

// Closing: set e.Cancel = true to block the × button.
// This is the WPF equivalent of window.onbeforeunload in the browser.
mainWindow.add_Closing((sender: any, e: any) => {
    if (!allowClose) {
        console.log('Closing intercepted — window close blocked.');
        e.Cancel = true;
        statusLabel.Content = 'Close blocked!\nUse the "Quit" button.';
    }
});

console.log("Window ready. Try clicking × — it will be blocked.");
console.log("Click 'Quit' to actually close the window.");

const app = new Windows.Application();
app.Run(mainWindow);
