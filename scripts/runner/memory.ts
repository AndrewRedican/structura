import type {ParentMessage} from './model/memory.ts'

process.on('message', async (message: ParentMessage) => {
  if (message.type !== 'start' || typeof message.options !== 'object') {
    return;
  }
  const getInputData: ((iteration: number) => any) = message.options.inputCallback ? eval(`(${message.options.inputCallback})`) : () => void 0;
  const algorithmPath = process.argv[2];
  const iterations = parseInt(process.argv[3], 10);
  const samplingInterval = parseInt(process.argv[4], 10);
  const algorithmModule = await import(algorithmPath);
  const algorithm: (inputData: any) => Promise<void> = algorithmModule.default;
  let peakMemoryUsage = 0;
  const memoryInterval: NodeJS.Timeout = setInterval(() => {
    const currentMemory = process.memoryUsage().heapUsed;
    if (currentMemory > peakMemoryUsage) {
      peakMemoryUsage = currentMemory;
    }
  }, samplingInterval);
  try {
    for (let i = 0; i < iterations; i += 1) {
      const inputData = getInputData(i);
      await algorithm(inputData);
    }
    clearInterval(memoryInterval);
    process.send?.({ type: 'result', peakMemoryUsage });
    process.exit(0);
  } catch (error) {
    console.error('An error occurred:', error);
    process.exit(1);
  }
});
