// Run: node ../node-ps1-dotnet/start.js src/winforms/drag-box/drag-box.ts
import dotnet from '@devscholar/node-ps1-dotnet';

dotnet.load('System.Windows.Forms');
dotnet.load('System.Drawing');

const System = dotnet.System as any;
const Forms = System.Windows.Forms;
const Drawing = System.Drawing;

console.log("--- WinForms Canvas Drawing ---");

Forms.Application.EnableVisualStyles();
Forms.Application.SetCompatibleTextRenderingDefault(false);

const form = new Forms.Form();
form.Text = "Draggable Box Example (Canvas)";
form.Width = 800;
form.Height = 600;
form.StartPosition = 1; // CenterScreen

// PictureBox as canvas, docked to fill the entire form client area.
const canvas = new Forms.PictureBox();
canvas.Dock = 5; // DockStyle.Fill
form.Controls.Add(canvas);

// Draw into a Bitmap and assign it as the PictureBox image.
// This avoids the Paint event re-entry issue: if we handled addSync_Paint and called
// g.FillRectangle() inside it, C# would deadlock (blocked waiting for JS, while JS
// is blocked waiting for C# to handle the draw call).
let bitmap = new Drawing.Bitmap(800, 600);
let g = Drawing.Graphics.FromImage(bitmap);
canvas.Image = bitmap;

const boxW = 100;
const boxH = 100;
let boxX = 350;
let boxY = 250;

let isDragging = false;
let startDragOffsetX = 0;
let startDragOffsetY = 0;

// Pre-create brushes to avoid GDI handle churn on every redraw.
const brushRed     = new Drawing.SolidBrush(Drawing.Color.Red);
const brushDarkRed = new Drawing.SolidBrush(Drawing.Color.DarkRed);

function redraw() {
    g.Clear(Drawing.Color.White);
    g.FillRectangle(isDragging ? brushDarkRed : brushRed, boxX, boxY, boxW, boxH);
    canvas.Invalidate();
}

redraw();

canvas.add_MouseDown((sender: any, e: any) => {
    const mx = e.X;
    const my = e.Y;
    if (mx >= boxX && mx < boxX + boxW && my >= boxY && my < boxY + boxH) {
        isDragging = true;
        startDragOffsetX = mx - boxX;
        startDragOffsetY = my - boxY;
        redraw();
    }
});

canvas.add_MouseUp((sender: any, e: any) => {
    if (isDragging) {
        isDragging = false;
        redraw();
    }
});

canvas.add_MouseMove((sender: any, e: any) => {
    if (isDragging) {
        boxX = e.X - startDragOffsetX;
        boxY = e.Y - startDragOffsetY;
        redraw();
    }
});

console.log("Initialization complete. Try dragging the red box!");

// Recreate the bitmap when the form is resized so the canvas always fills the window.
form.add_Resize((sender: any, e: any) => {
    const w = canvas.Width;
    const h = canvas.Height;
    if (w > 0 && h > 0) {
        g.Dispose();
        bitmap = new Drawing.Bitmap(w, h);
        g = Drawing.Graphics.FromImage(bitmap);
        canvas.Image = bitmap;
        redraw();
    }
});

Forms.Application.Run(form);
