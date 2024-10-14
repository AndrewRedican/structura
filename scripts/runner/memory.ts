import type {ParentMessage} from './model/memory.ts';
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
  const samplingInterval = parseInt(process.argv[5], 10);
  const dataFilePath = resolve(getPath('data'), `${dataType}.ndjson`);
  const algorithmModule = await import(algorithmPath);
  const algorithm: (inputData: any) => Promise<void> = algorithmModule.default;
  let peakMemoryUsage = 0;
  const memoryInterval: NodeJS.Timeout = setInterval(() => {
    const currentMemory = process.memoryUsage().heapUsed;
    if (currentMemory > peakMemoryUsage) {
      peakMemoryUsage = currentMemory;
    }
  }, samplingInterval);
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
      await algorithm(inputData);
      i += 1;
    }
    rl.close();
    clearInterval(memoryInterval);
    process.send?.({ type: 'result', peakMemoryUsage });
    process.exit(0);
  } catch (error) {
    process.send?.({
      type: 'error',
      peakMemoryUsage,
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
