// Run: node ../node-ps1-dotnet/start.js src/console/await-delay/await-delay.ts
import dotnet from '@devscholar/node-ps1-dotnet';

const System = dotnet.System as any;
const Console = System.Console;
const Task = System.Threading.Tasks.Task;
const Path = System.IO.Path;

Console.WriteLine('0s');
await Task.Delay(1000);
await Console.Out.WriteLineAsync("1s");
await Task.Delay(1000);
await Console.Out.WriteLineAsync("2s");
await Task.Delay(1000);
