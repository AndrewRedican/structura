import type {RunOptions, ChildMessage} from './model/time.ts';
import type {MeasurementOptions} from './model/measurement.ts';
import {createMeasurement} from './createMeasurement.ts';

export const measureTime = createTimeMeasurement(
  async (info, timestamp, message, options) => {
    const {reportSuccess} = await import('./report/time.success.ts');
    await reportSuccess(info, timestamp, message, options);
  },
  async (info, timestamp, snapshotFilePath, message) => {
    const {reportError} = await import('./report/time.error.ts');
    await reportError(info, timestamp, snapshotFilePath, message);
  }
);

export const measureTimeQuietly = createTimeMeasurement(async () => void 0, async () => void 0);

function createTimeMeasurement(onResult: MeasurementOptions<RunOptions, ChildMessage>['onResult'], onError: MeasurementOptions<RunOptions, ChildMessage>['onError']): (algorithmPath: string, options: RunOptions) => Promise<ChildMessage> {
  return async (algorithmPath, options) => createMeasurement<RunOptions, ChildMessage>({
    algorithmPath,
    options,
    runnerScript: './scripts/runner/time.ts',
    runnerArgs: (info, options) => [
      info.fullPath,
      options.iterations.toString(),
      options.dataType,
    ],
    onResult,
    onError
  });
}