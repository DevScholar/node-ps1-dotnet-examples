// Run: node ../node-ps1-dotnet/start.js src/winforms/blocking-dialog/blocking-dialog.ts
import dotnet from '@devscholar/node-ps1-dotnet';

dotnet.load('System.Windows.Forms');
dotnet.load('System.Drawing');

const System = dotnet.System as any;
const Forms = System.Windows.Forms;
const Drawing = System.Drawing;

Forms.Application.EnableVisualStyles();
Forms.Application.SetCompatibleTextRenderingDefault(false);

const form = new Forms.Form();
form.Text = "Computer Brand Input";
form.Width = 400;
form.Height = 200;
form.StartPosition = 1;
form.FormBorderStyle = 2;
form.MaximizeBox = false;
form.MinimizeBox = false;
form.AcceptButton = null;
form.CancelButton = null;

const label = new Forms.Label();
label.Text = "Please enter your computer brand:";
label.Font = new Drawing.Font("Segoe UI", 10);
label.AutoSize = true;
label.Location = new Drawing.Point(20, 20);
form.Controls.Add(label);

const textBox = new Forms.TextBox();
textBox.Width = 340;
textBox.Location = new Drawing.Point(20, 50);
textBox.Font = new Drawing.Font("Segoe UI", 10);
form.Controls.Add(textBox);

const okButton = new Forms.Button();
okButton.Text = "OK";
okButton.Width = 100;
okButton.Location = new Drawing.Point(100, 100);
okButton.DialogResult = 1;
form.Controls.Add(okButton);
form.AcceptButton = okButton;

const cancelButton = new Forms.Button();
cancelButton.Text = "Cancel";
cancelButton.Width = 100;
cancelButton.Location = new Drawing.Point(220, 100);
cancelButton.DialogResult = 2;
form.Controls.Add(cancelButton);
form.CancelButton = cancelButton;

console.log("--- Blocking Dialog Example ---");
console.log("Showing dialog to get user input...\n");

const result = await form.ShowDialog();

if (result === 1) {
    const brand = String(textBox.Text).trim();
    if (brand !== "") {
        console.log(`You are using a ${brand} computer.`);
    } else {
        console.log("You didn't enter a computer brand.");
    }
} else {
    console.log("Dialog was cancelled.");
}

console.log("\nProgram ended.");
