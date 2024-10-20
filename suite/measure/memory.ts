import type {RunOptions, MemoryRunnerMessage} from './model/memory.ts';
import type {Logger} from './model/logging.ts';
import {defaultLogger, silentLogger} from './logging.ts';
import {createMeasurement} from './createMeasurement.ts';

export const measureMemory = createMemoryMeasurement(defaultLogger);

export const measureMemoryQuietly = createMemoryMeasurement(silentLogger);

function createMemoryMeasurement(logger: Logger): (algorithmPath: string, options: RunOptions) => Promise<MemoryRunnerMessage> {
  return async (algorithmPath, options) => createMeasurement<RunOptions, MemoryRunnerMessage>({
    algorithmPath,
    options,
    runnerScript: './scripts/runner/memory.ts',
    runnerArgs: (info, options) => [
      info.fullPath,
      options.iterations.toString(),
      options.dataType,
      options.samplingInterval.toString(),
    ],
    onResult: async (logger, info, timestamp, message, options) => {
      const {reportSuccess} = await import('./report/memory.success.ts');
      await reportSuccess(logger, info, timestamp, message, options);
    },
    onError: async (logger, info, timestamp, snapshotFilePath, message) => {
      const {reportError} = await import('./report/memory.error.ts');
      await reportError(logger, info, timestamp, snapshotFilePath, message);
    }
  }, logger);
}
