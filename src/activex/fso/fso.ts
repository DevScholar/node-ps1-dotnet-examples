// Run: node start.js src/activex/fso/fso.ts
//
// Demonstrates COM / ActiveX usage via node-ps1-dotnet.
// Uses Scripting.FileSystemObject to read a file and enumerate directory contents.
import { ActiveXObject, Enumerator } from '@devscholar/node-ps1-dotnet/activex';

const fso = new ActiveXObject('Scripting.FileSystemObject');

// Check if package.json exists
const exists = fso.FileExists('package.json');
console.log('package.json exists:', exists);

// Read the first line
if (exists) {
    const ts = fso.OpenTextFile('package.json', 1); // 1 = ForReading
    const firstLine = ts.ReadLine();
    ts.Close();
    console.log('First line:', firstLine);
}

// Enumerate files using explicit Enumerator() helper
const folder = fso.GetFolder('.');
console.log('\nFiles (via Enumerator):');
for (const file of Enumerator(folder.Files)) {
    console.log(' ', file.Name, '-', file.Size, 'bytes');
}

// for..of also works directly on COM collections
console.log('\nFiles (via for..of):');
for (const file of folder.Files) {
    console.log(' ', file.Name);
}
