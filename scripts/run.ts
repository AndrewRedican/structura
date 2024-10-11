import * as fs from 'fs';
import { fileURLToPath } from 'url';
import * as path from 'path';
import * as crypto from 'crypto';
import { performance } from 'perf_hooks';

export async function run(algorithm: Function, iterations: number, precision: number, inputCallback?: Function) {
  const timestamp = new Date().toISOString();
  const callerFilePath = fileURLToPath(import.meta.url);
  const fileName = path.basename(callerFilePath, path.extname(callerFilePath));
  const fileBuffer = fs.readFileSync(callerFilePath);
  const sha = crypto.createHash('sha256').update(fileBuffer).digest('hex');
  const stats = { count: 0, total: 0, max: 0, min: Infinity, average: 0 };
  const snapshotDir = path.resolve('./snapshots', fileName);
  const snapshotFilePath = path.join(snapshotDir, sha + path.extname(callerFilePath));
  if (!fs.existsSync(snapshotFilePath)) {
    fs.mkdirSync(snapshotDir, { recursive: true });
    fs.writeFileSync(snapshotFilePath, fileBuffer);
  }
  const reportDir = path.resolve('./performance/raw', fileName);
  const reportFilePath = path.join(reportDir, `${sha}.csv`);
  fs.mkdirSync(reportDir, { recursive: true });
  let inputData: any
  try {
    for (let i = 0; i < iterations; i += 1) {
      inputData = inputCallback ? inputCallback(i) : void 0;
      const startTime = performance.now();
      await algorithm(inputData);
      const duration = performance.now() - startTime;
      stats.count += 1;
      stats.total += duration;
      stats.max = Math.max(stats.max, duration);
      stats.min = Math.min(stats.min, duration);
      stats.average = stats.total / stats.count;
    }
    const entry = `${timestamp},${stats.total.toFixed(precision)},${stats.count},${stats.min.toFixed(precision)},${stats.max.toFixed(precision)},${stats.average.toFixed(precision)}\n`;
    if (!fs.existsSync(reportFilePath)) {
      fs.appendFileSync(reportFilePath, 'Timestamp,Duration (ms),Count,Min (ms),Max (ms),Average (ms)\n');
    }
    fs.appendFileSync(reportFilePath, entry);
    console.log('\n\n\nPerformance test completed successfully.');
    console.log(`Details:\n  Total Duration: ${stats.total.toFixed(precision)} ms\n  Count: ${stats.count}\n  Min: ${stats.min.toFixed(precision)} ms\n  Max: ${stats.max.toFixed(precision)} ms\n  Average: ${stats.average.toFixed(precision)} ms`);
    console.log(`Performance report generated at: ${reportFilePath}`);
  } catch (error) {
    const errorDetails = `
=== Error Log ===
Algorithm: ${algorithm?.name || 'Unknown'}
Execution Timestamp: ${timestamp}
Error Timestamp: ${new Date().toISOString()}
Iteration: ${stats.count}
Input Data: ${JSON.stringify(inputData ?? 'Unavailable')}
Error Message: ${(error as Error)?.message}
Stack Trace: ${(error as Error)?.stack}
Snapshot File: ${snapshotFilePath}
Algorithm Definition:
${algorithm?.toString()}
`;
    const errorDir = path.resolve('./errors', fileName);
    const errorFilePath = path.join(errorDir, `${sha}.log`);
    fs.mkdirSync(errorDir, { recursive: true });
    fs.writeFileSync(errorFilePath, errorDetails);
    console.error('\n\n\nAn error occurred during the performance test.');
    console.error(`Iteration: ${stats.count}`);
    console.error(`Input Data: ${JSON.stringify(inputData)}`);
    console.error(`Error details have been logged at: ${errorFilePath}`);
  }
}
