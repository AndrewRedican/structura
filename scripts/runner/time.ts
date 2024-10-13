import type {ParentMessage, TimeStats} from './model/time.ts'
import {performance} from 'perf_hooks';
import {functionName} from '../utils/functionName.ts'

process.on('message', async (message: ParentMessage) => {
  if (message.type !== 'start' || typeof message.options !== 'object') {
    return;
  }
  const getInputData: ((iteration: number) => any) = message.options.inputCallback ? eval(`(${message.options.inputCallback})`) : () => void 0;
  const algorithmPath = process.argv[2];
  const iterations = parseInt(process.argv[3], 10);
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
    for (; i < iterations; i += 1) {
      inputData = getInputData(i);
      const startTime = performance.now();
      await algorithm(inputData);
      const endTime = performance.now();
      const duration = endTime - startTime;
      timeStats.totalDuration += duration;
      if (duration > timeStats.maxDuration) timeStats.maxDuration = duration;
      if (duration < timeStats.minDuration) timeStats.minDuration = duration;
    }
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
      errorStack: (error as Error).stack || 'Unavailable'
    });
    process.exit(1);
  }
});
