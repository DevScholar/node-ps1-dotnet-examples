// Run: node ../node-ps1-dotnet/start.js src/wpf/drag-box/drag-box.ts
import dotnet from '@devscholar/node-ps1-dotnet';

dotnet.load('PresentationFramework');
dotnet.load('PresentationCore');
dotnet.load('WindowsBase');

const System = dotnet.System as any;
const Windows = System.Windows;
const Controls = System.Windows.Controls;
const Media = System.Windows.Media;

console.log("--- WPF Draggable Box ---");

const mainWindow = new Windows.Window();
mainWindow.Title = "WPF Draggable Box Example (High Frequency IPC)";
mainWindow.Width = 800;
mainWindow.Height = 600;
mainWindow.WindowStartupLocation = Windows.WindowStartupLocation.CenterScreen;

const canvas = new Controls.Canvas();
canvas.Background = Media.Brushes.LightGray;

const box = new Controls.Border();
box.Width = 100;
box.Height = 100;
box.Background = Media.Brushes.Red;
box.BorderBrush = Media.Brushes.DarkRed;
box.BorderThickness = new Windows.Thickness(2);

const transform = new Media.TranslateTransform();
box.RenderTransform = transform;

transform.X = 350;
transform.Y = 250;

canvas.Children.Add(box);

let isDragging = false;
let startMouseX = 0;
let startMouseY = 0;
let startBoxX = 0;
let startBoxY = 0;

box.add_MouseDown((sender: any, e: any) => {
    console.log('[DEBUG] MouseDown');
    isDragging = true;
    const pos = e.GetPosition(canvas);
    startMouseX = pos.X;
    startMouseY = pos.Y;
    startBoxX = transform.X;
    startBoxY = transform.Y;
    box.Background = Media.Brushes.DarkRed;
    box.CaptureMouse();
});

box.add_MouseUp((sender: any, e: any) => {
    console.log('[DEBUG] MouseUp');
    isDragging = false;
    box.Background = Media.Brushes.Red;
    box.ReleaseMouseCapture();
});

box.add_MouseMove((sender: any, e: any) => {
    if (isDragging) {
        const currentPos = e.GetPosition(canvas);
        
        transform.X = startBoxX + (currentPos.X - startMouseX);
        transform.Y = startBoxY + (currentPos.Y - startMouseY);
    }
});

mainWindow.Content = canvas;
mainWindow.Show();

console.log("Initialization complete. Try dragging the red box!");

const app = new Windows.Application();
app.Run(mainWindow);
