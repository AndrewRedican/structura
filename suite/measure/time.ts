import type {RunOptions, ChildMessage} from './model/time.ts';
import {fork, ChildProcess} from 'child_process';
import {getPath} from '../../scripts/utils/getPath.ts';
import {ensureNdjsonFile} from '../../scripts/utils/ensureNdjsonFile.ts';

export async function measureTime(
  algorithmPath: string,
  options: RunOptions
): Promise<void> {
  ensureNdjsonFile(options.dataType);
  const {getAlgorithmInfo} = await import('./info.ts');
  const info = getAlgorithmInfo(algorithmPath);
  const {generateSnapshot} = await import('./report/snapshot.ts');
  const snapshotFilePath = generateSnapshot(info);
  const timestamp = new Date().toISOString();
  return new Promise<void>((resolve) => {
    const child: ChildProcess = fork(
      getPath('./scripts/runner/time.ts'),
      [info.fullPath, options.iterations.toString(), options.dataType],
      { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] }
    );
    child.on('message', async (message: ChildMessage) => {
      if (message.type === 'result' && typeof message.timeStats === 'object') {
        const { reportSuccess } = await import('./report/time.success.ts');
        await reportSuccess(info, timestamp, message, options);
        resolve();
      } else if (message.type === 'error') {
        const { reportError } = await import('./report/time.error.ts');
        await reportError(info, timestamp, snapshotFilePath, message);
        resolve();
      }
    });
    child.on('exit', resolve);
    child.send({ type: 'start' });
  });
}
