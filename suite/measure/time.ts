import type {RunOptions, ChildMessage} from './model/time.ts';
import {createMeasurement} from './createMeasurement.ts';

export async function measureTime(
  algorithmPath: string,
  options: RunOptions
): Promise<void> {
  createMeasurement<RunOptions, ChildMessage>({
    algorithmPath,
    options,
    runnerScript: './scripts/runner/time.ts',
    runnerArgs: (info, options) => [
      info.fullPath,
      options.iterations.toString(),
      options.dataType,
    ],
    onResult: async (info, timestamp, message, options) => {
      const {reportSuccess} = await import('./report/time.success.ts');
      await reportSuccess(info, timestamp, message, options);
    },
    onError: async (info, timestamp, snapshotFilePath, message) => {
      const {reportError} = await import('./report/time.error.ts');
      await reportError(info, timestamp, snapshotFilePath, message);
    },
  });
}
