// Run: node start.js src/activex/wmi/wmi.ts
//
// Demonstrates GetObject() with WMI monikers via node-ps1-dotnet.
// Equivalent to the VBScript pattern:
//   Set wmi = GetObject("winmgmts:")
//   For Each os In wmi.ExecQuery("SELECT * FROM Win32_OperatingSystem") ...
import { GetObject, Enumerator } from '@devscholar/node-ps1-dotnet/activex';

// Bind to the default WMI namespace (root\cimv2)
const wmi = GetObject('winmgmts:');

// Query OS info
console.log('=== Operating System ===');
for (const os of Enumerator(wmi.ExecQuery('SELECT * FROM Win32_OperatingSystem'))) {
    console.log('Name:         ', os.Caption);
    console.log('Version:      ', os.Version);
    console.log('Architecture: ', os.OSArchitecture);
    console.log('Total RAM:    ', Math.round(Number(os.TotalVisibleMemorySize) / 1024), 'MB');
}

// Query CPU info
console.log('\n=== Processor ===');
for (const cpu of Enumerator(wmi.ExecQuery('SELECT * FROM Win32_Processor'))) {
    console.log('Name:   ', cpu.Name);
    console.log('Cores:  ', cpu.NumberOfCores);
    console.log('Logical:', cpu.NumberOfLogicalProcessors);
}

// Query running processes (top 5 by name)
console.log('\n=== Processes (first 5) ===');
const procs = Enumerator(wmi.ExecQuery('SELECT Name, ProcessId FROM Win32_Process'));
for (const p of procs.slice(0, 5)) {
    console.log(' ', String(p.ProcessId).padStart(5), p.Name);
}
