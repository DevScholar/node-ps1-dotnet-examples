using System;
using System.Windows;
using System.Windows.Forms;

class Test {
    static void Main() {
        // WPF DialogResult
        var wpfWindow = new Window();
        wpfWindow.DialogResult = true;
        Console.WriteLine($"WPF DialogResult type: {wpfWindow.DialogResult.GetType()}");
        Console.WriteLine($"WPF DialogResult value: {wpfWindow.DialogResult}");
        
        // WinForms DialogResult
        var winformsForm = new Form();
        winformsForm.DialogResult = DialogResult.OK;
        Console.WriteLine($"WinForms DialogResult type: {winformsForm.DialogResult.GetType()}");
        Console.WriteLine($"WinForms DialogResult value: {winformsForm.DialogResult}");
        Console.WriteLine($"WinForms DialogResult.OK value: {(int)DialogResult.OK}");
    }
}
