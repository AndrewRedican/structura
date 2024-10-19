import type {RunOptions, ChildMessage} from './model/memory.ts';
import {createMeasurement} from './createMeasurement.ts';

export async function measureMemory(
  algorithmPath: string,
  options: RunOptions
): Promise<void> {
  createMeasurement<RunOptions, ChildMessage>({
    algorithmPath,
    options,
    runnerScript: './scripts/runner/memory.ts',
    runnerArgs: (info, options) => [
      info.fullPath,
      options.iterations.toString(),
      options.dataType,
      options.samplingInterval.toString(),
    ],
    onResult: async (info, timestamp, message, options) => {
      const {reportSuccess} = await import('./report/memory.success.ts');
      await reportSuccess(info, timestamp, message, options);
    },
    onError: async (info, timestamp, snapshotFilePath, message) => {
      const {reportError} = await import('./report/memory.error.ts');
      await reportError(info, timestamp, snapshotFilePath, message);
    },
  });
}
