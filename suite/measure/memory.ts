import type {RunOptions, ChildMessage} from './model/memory.ts';
import type {MeasurementOptions} from './model/measurement.ts';
import {createMeasurement} from './createMeasurement.ts';

export const measureMemory = createMemoryMeasurement(
  async (info, timestamp, message, options) => {
    const { reportSuccess } = await import('./report/memory.success.ts');
    await reportSuccess(info, timestamp, message, options);
  },
  async (info, timestamp, snapshotFilePath, message) => {
    const { reportError } = await import('./report/memory.error.ts');
    await reportError(info, timestamp, snapshotFilePath, message);
  }
);

export const measureMemoryQuietly = createMemoryMeasurement(async () => void 0, async () => void 0);

function createMemoryMeasurement(
  onResult: MeasurementOptions<RunOptions, ChildMessage>['onResult'],
  onError: MeasurementOptions<RunOptions, ChildMessage>['onError']
): (algorithmPath: string, options: RunOptions) => Promise<ChildMessage> {
  return async (algorithmPath, options) =>
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
      onResult,
      onError,
    });
}
