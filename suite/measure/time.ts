import type {RunOptions, ChildMessage} from './model/time.ts'
import {fork, ChildProcess} from 'child_process';
import {getPath} from '../../scripts/utils/getPath.ts';

export async function measureTime(algorithmPath: string, iterations: number, options: RunOptions): Promise<void> {
  const {getAlgorithmInfo: getAlgorithmDetails} = await import('./info.ts');
  const info = getAlgorithmDetails(algorithmPath);
  const {generateSnapshot} = await import('./report/snapshot.ts');
  const snapshotFilePath = await generateSnapshot(info.fileName, info.sha, info.fullPath, info.content);
  const timestamp = new Date().toISOString();
  return new Promise<void>((resolve) => {
    const child: ChildProcess = fork(
      getPath('./scripts/runner/time.ts'),
      [info.fullPath, iterations.toString()],
      { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] }
    );

    child.on('message', async (message: ChildMessage) => {
      if (message.type === 'result' && message.timeStats) {
        const {reportSuccess} = await import('./report/time.success.ts');
        await reportSuccess(info, iterations, timestamp, message, options);
        resolve();
      }
    });

    child.on('message', async (message: ChildMessage) => {
      if (message.type === 'error' && message.timeStats) {
        const {reportError} = await import('./report/time.error.ts');
        await reportError(info, timestamp, snapshotFilePath, message);
        resolve();
      }
    });

    child.on('exit', () => resolve());

    child.send({
      type: 'start',
      options: {
        inputCallback: typeof options.inputCallback === 'function' ? options.inputCallback.toString() : null,
      },
    });
  });
}
