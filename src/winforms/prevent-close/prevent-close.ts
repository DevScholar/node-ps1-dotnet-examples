// Run: node ../node-ps1-dotnet/start.js src/winforms/prevent-close/prevent-close.ts
//
// Demonstrates WinForms FormClosing event as an onbeforeunload equivalent.
//
// Setting e.Cancel = true inside FormClosing prevents the window from closing —
// the same mechanism real WinForms apps use to intercept the × button.
// The Quit button sets a JS flag to allow the close, then calls form.Close().
import dotnet from '@devscholar/node-ps1-dotnet';

dotnet.load('System.Windows.Forms');
dotnet.load('System.Drawing');

const System = dotnet.System as any;
const Forms = System.Windows.Forms;
const Drawing = System.Drawing;

console.log("--- WinForms Prevent Close Demo ---");

Forms.Application.EnableVisualStyles();
Forms.Application.SetCompatibleTextRenderingDefault(false);

const form = new Forms.Form();
form.Text = "Prevent Close Demo";
form.Width = 400;
form.Height = 220;
form.StartPosition = 1; // CenterScreen

const statusLabel = new Forms.Label();
statusLabel.Text = "The × button is disabled.\nUse the \"Quit\" button to close.";
statusLabel.Font = new Drawing.Font("Segoe UI", 11);
statusLabel.AutoSize = false;
statusLabel.Width = 340;
statusLabel.Height = 60;
statusLabel.Location = new Drawing.Point(20, 30);
statusLabel.TextAlign = 32; // MiddleCenter
form.Controls.Add(statusLabel);

const quitButton = new Forms.Button();
quitButton.Text = "Quit";
quitButton.Font = new Drawing.Font("Segoe UI", 11);
quitButton.Width = 120;
quitButton.Height = 36;
quitButton.Location = new Drawing.Point(120, 110);
form.Controls.Add(quitButton);

let allowClose = false;

// Clicking the dedicated Quit button allows the window to close.
quitButton.add_Click((sender: any, e: any) => {
    console.log('Quit button clicked — closing window.');
    allowClose = true;
    form.Close();
});

// FormClosing: set e.Cancel = true to block the × button.
// This is the WinForms equivalent of window.onbeforeunload in the browser.
form.add_FormClosing((sender: any, e: any) => {
    if (!allowClose) {
        console.log('FormClosing intercepted — window close blocked.');
        e.Cancel = true;
        statusLabel.Text = 'Close blocked!\nUse the "Quit" button.';
    }
});

console.log("Window ready. Try clicking × — it will be blocked.");
console.log("Click 'Quit' to actually close the window.");

Forms.Application.Run(form);
