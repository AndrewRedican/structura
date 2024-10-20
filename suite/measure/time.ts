import type {RunOptions, TimeRunnerMessage} from './model/time.ts';
import type {Logger} from './model/logging.ts';
import {defaultLogger, silentLogger} from './logging.ts';
import {createMeasurement} from './createMeasurement.ts';

export const measureTime = createTimeMeasurement(defaultLogger);

export const measureTimeQuietly = createTimeMeasurement(silentLogger);

function createTimeMeasurement(logger: Logger): (algorithmPath: string, options: RunOptions) => Promise<TimeRunnerMessage> {
  return async (algorithmPath, options) => createMeasurement<RunOptions, TimeRunnerMessage>({
    algorithmPath,
    options,
    runnerScript: './scripts/runner/time.ts',
    runnerArgs: (info, options) => [
      info.fullPath,
      options.iterations.toString(),
      options.dataType,
    ],
    onResult: async (logger, info, timestamp, message, options) => {
      const {reportSuccess} = await import('./report/time.success.ts');
      await reportSuccess(logger, info, timestamp, message, options);
    },
    onError: async (logger, info, timestamp, snapshotFilePath, message) => {
      const {reportError} = await import('./report/time.error.ts');
      await reportError(logger, info, timestamp, snapshotFilePath, message);
    }
  }, logger);
}