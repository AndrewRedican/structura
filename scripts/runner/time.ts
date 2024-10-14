import type {ParentMessage, TimeStats} from './model/time.ts';
import {performance} from 'perf_hooks';
import {createReadStream} from 'fs';
import {createInterface} from 'readline';
import {resolve} from 'path';
import {functionName} from '../utils/functionName.ts';
import {getPath} from '../utils/getPath.ts';

process.on('message', async (message: ParentMessage) => {
  if (message.type !== 'start') {
    return;
  }
  const algorithmPath = process.argv[2];
  const iterations = parseInt(process.argv[3], 10);
  const dataType = process.argv[4];
  const dataFilePath = resolve(getPath('data'), `./${dataType}.ndjson`);
  const algorithmModule = await import(algorithmPath);
  const algorithm: (inputData: any) => Promise<void> = algorithmModule.default;
  const timeStats: TimeStats = {
    totalDuration: 0,
    minDuration: Infinity,
    maxDuration: 0,
    averageDuration: 0,
  };
  let i = 0;
  let inputData: any;
  try {
    const rl = createInterface({ input: createReadStream(dataFilePath), crlfDelay: Infinity });
    const iterator = rl[Symbol.asyncIterator]();
    while (i < iterations) {
      const { value: line, done } = await iterator.next();
      if (done) {
        console.error(`Insufficient data. Required: ${iterations}, Available: ${i}`);
        process.exit(1);
      }
      inputData = JSON.parse(line);
      const startTime = performance.now();
      await algorithm(inputData);
      const endTime = performance.now();
      const duration = endTime - startTime;
      timeStats.totalDuration += duration;
      if (duration > timeStats.maxDuration) timeStats.maxDuration = duration;
      if (duration < timeStats.minDuration) timeStats.minDuration = duration;
      i += 1;
    }
    rl.close();
    if (iterations > 0) {
      timeStats.averageDuration = timeStats.totalDuration / iterations;
    }
    process.send?.({ type: 'result', timeStats });
    process.exit(0);
  } catch (error) {
    process.send?.({
      type: 'error',
      timeStats,
      algorithmName: functionName(algorithm),
      algorithmBody: algorithm?.toString() || 'Unavailable',
      iteration: i,
      inputData: JSON.stringify(inputData ?? 'Unavailable'),
      errorMessage: (error as Error).message || 'Unavailable',
      errorStack: (error as Error).stack || 'Unavailable',
    });
    process.exit(1);
  }
});
