import {run} from '../scripts/run.ts'

// Run example algorithm
await run(exampleAlgorithm, 5, 4, exampleInputCallback);

// Example usage:
async function exampleAlgorithm(inputData: any) {
  if (inputData === 'error') {
    throw new Error('Simulated error for testing');
  }
  // Simulate some processing
  await new Promise((resolve) => setTimeout(resolve, 500));
}

// Example input callback
function exampleInputCallback(iteration: number) {
  return iteration % 2 === 0 ? 'data' : 'error'; // Alternates between 'data' and 'error'
}