import type {MeasurementOptions} from './model/measurement.ts';
import type {Logger} from './model/logging.ts';
import {fork, ChildProcess} from 'child_process';
import {getPath} from '../../scripts/utils/getPath.ts';
import {ensureNdjsonFile} from '../../scripts/utils/ensureNdjsonFile.ts';
import {getAlgorithmInfo} from './info.ts';
import {generateSnapshot} from './report/snapshot.ts';

export async function createMeasurement<RunOptions, ChildMessage>(measurementOptions: MeasurementOptions<RunOptions, ChildMessage>, logger: Logger): Promise<ChildMessage> {
  const {algorithmPath, options, runnerScript, runnerArgs, onResult, onError} = measurementOptions;
  ensureNdjsonFile(options.dataType);
  const info = getAlgorithmInfo(algorithmPath);
  const snapshotFilePath = generateSnapshot(info);
  const timestamp = new Date().toISOString();
  return new Promise<ChildMessage>((resolve) => {
    const child: ChildProcess = fork(
      getPath(runnerScript),
      runnerArgs(info, options),
      { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] }
    );
    child.on('message', async (message: any) => {
      const type = message.type;
      if (type === 'result') {
        await onResult(logger, info, timestamp, message, options);
        resolve(message);
      } else if (type === 'error') {
        await onError(logger, info, timestamp, snapshotFilePath, message);
        resolve(void 0 as any);
      }
    });
    child.on('exit', resolve);
    child.send({ type: 'start' });
  });
}
