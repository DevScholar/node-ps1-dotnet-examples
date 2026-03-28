// Run: node ../node-ps1-dotnet/start.js src/wpf/blocking-dialog/blocking-dialog.ts
import dotnet from '@devscholar/node-ps1-dotnet';

dotnet.load('PresentationFramework');
dotnet.load('PresentationCore');
dotnet.load('WindowsBase');

const System = dotnet.System as any;
const Windows = System.Windows;
const Controls = System.Windows.Controls;

const dialog = new Windows.Window();
dialog.Title = "Computer Brand Input";
dialog.Width = 400;
dialog.Height = 200;
dialog.WindowStartupLocation = Windows.WindowStartupLocation.CenterScreen;
dialog.ResizeMode = Windows.ResizeMode.NoResize;

const stackPanel = new Controls.StackPanel();
stackPanel.Margin = new Windows.Thickness(20);

const label = new Controls.Label();
label.Content = "Please enter your computer brand:";
label.FontSize = 14;
label.Margin = new Windows.Thickness(0, 0, 0, 10);
stackPanel.Children.Add(label);

const textBox = new Controls.TextBox();
textBox.FontSize = 14;
textBox.Padding = new Windows.Thickness(5);
textBox.Margin = new Windows.Thickness(0, 0, 0, 20);
stackPanel.Children.Add(textBox);

const buttonPanel = new Controls.StackPanel();
buttonPanel.Orientation = Windows.Controls.Orientation.Horizontal;
buttonPanel.HorizontalAlignment = Windows.HorizontalAlignment.Center;

const okButton = new Controls.Button();
okButton.Content = "OK";
okButton.Width = 80;
okButton.Margin = new Windows.Thickness(0, 0, 10, 0);
okButton.Padding = new Windows.Thickness(10, 5, 10, 5);
okButton.IsDefault = true;
okButton.add_Click(() => {
    dialog.DialogResult = true;
});
buttonPanel.Children.Add(okButton);

const cancelButton = new Controls.Button();
cancelButton.Content = "Cancel";
cancelButton.Width = 80;
cancelButton.Padding = new Windows.Thickness(10, 5, 10, 5);
cancelButton.IsCancel = true;
buttonPanel.Children.Add(cancelButton);

stackPanel.Children.Add(buttonPanel);

dialog.Content = stackPanel;

console.log("--- WPF Blocking Dialog Example ---");
console.log("Showing dialog to get user input...\n");

const result = dialog.ShowDialog();

if (result === true) {
    const brand = textBox.Text;
    if (brand && brand.trim() !== "") {
        console.log(`You are using a ${brand.trim()} computer.`);
    } else {
        console.log("You didn't enter a computer brand.");
    }
} else {
    console.log("Dialog was cancelled.");
}

console.log("\nProgram ended.");
