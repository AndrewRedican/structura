import type {RunnerOptions, InternalContext} from './model/runner.ts';
import {createReadStream} from 'fs';
import {createInterface} from 'readline';
import {resolve} from 'path';
import {getPath} from '../utils/getPath.ts';
import {functionName} from '../utils/functionName.ts';

export async function createRunner<TContext>(options: RunnerOptions<TContext & InternalContext>, context: TContext) {
  const {onStart, onIterationStart, onIterationEnd, onEnd, onError} = {
    onStart: () => void 0,
    onIterationStart: () => void 0,
    onIterationEnd: () => void 0,
    onEnd: () => void 0,
    onError: () => void 0,
    ...options
  };

  process.on('message', async (message: any) => {
    if (message.type !== 'start') return;
    const algorithmPath = process.argv[2];
    const iterations = parseInt(process.argv[3], 10);
    const dataType = process.argv[4];
    const dataFilePath = resolve(getPath('data'), `./${dataType}.ndjson`);
    const ctx: TContext & InternalContext = {
      ...context,
      algorithmPath,
      iterations,
      dataType,
      dataFilePath,
      currentIteration: 0,
      currentInputData: void 0
    };
    const algorithmModule = await import(algorithmPath);
    const algorithm: (inputData: any) => Promise<void> = algorithmModule.default;
    try {
      await onStart(ctx);
      const rl = createInterface({ input: createReadStream(dataFilePath), crlfDelay: Infinity });
      const iterator = rl[Symbol.asyncIterator]();
      while (ctx.currentIteration < iterations) {
        const { value: line, done } = await iterator.next();
        if (done) {
          console.error(`Insufficient data. Required: ${iterations}, Available: ${ctx.currentIteration}`);
          process.exit(1);
        }
        // @ts-expect-error ignore readonly
        ctx.currentInputData = JSON.parse(line);
        await onIterationStart(ctx);
        await algorithm(ctx.currentInputData);
        await onIterationEnd(ctx);
        // @ts-expect-error ignore readonly
        ctx.currentIteration += 1;
      }
      rl.close();
      await onEnd(ctx);
      process.send?.({ type: 'result', ...ctx });
      process.exit(0);
    } catch (error) {
      const e = (error || {}) as Error;
      await onError(e, ctx);
      const NA = 'Unavailable'
      process.send?.({
        ...ctx,
        type: 'error',
        currentIteration: ctx.currentIteration + 1,
        currentInputData: JSON.stringify(ctx.currentInputData ?? NA),
        errorMessage: e.message || NA,
        errorStack: e.stack || NA,
        algorithmName: functionName(algorithm),
        algorithmBody: algorithm.toString()
      });
      process.exit(1);
    }
  });
}
