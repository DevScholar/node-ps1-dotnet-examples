// Run: node start.js src/activex/wscript-shell/wscript-shell.ts
//
// Demonstrates WScript.Shell COM object via node-ps1-dotnet.
// Shows a native Windows popup dialog and runs a command.
import { ActiveXObject } from '@devscholar/node-ps1-dotnet/activex';

const shell = new ActiveXObject('WScript.Shell');

// Show a popup dialog (native Windows MessageBox)
// Popup(text, secondsToWait, title, type)
//   type: 4 = vbYesNo, 32 = vbQuestion
//   returns: 6 = Yes, 7 = No, -1 = Timeout
const btnCode = shell.Popup(
    'Do you feel alright?',
    7,                          // auto-close after 7 seconds
    'Answer This Question:',
    4 + 32                      // Yes/No + Question icon
);

switch (btnCode) {
    case 6:
        console.log('Glad to hear you feel alright.');
        break;
    case 7:
        console.log("Hope you're feeling better soon.");
        break;
    case -1:
        console.log('Is there anybody out there?');
        break;
}

// Environment variable access
const windir = shell.ExpandEnvironmentStrings('%WINDIR%');
console.log('Windows directory:', windir);
