import type {RunOptions, ChildMessage} from './model/memory.ts'
import {fork, ChildProcess} from 'child_process';
import {getPath} from '../../scripts/utils/getPath.ts';
import {ensureNdjsonFile} from '../../scripts/utils/ensureNdjsonFile.ts';

export async function measureMemory(
  algorithmPath: string,
  options: RunOptions
): Promise<void> {
  ensureNdjsonFile(options.dataType);
  const {getAlgorithmInfo} = await import('./info.ts');
  const info = getAlgorithmInfo(algorithmPath);
  const {generateSnapshot} = await import('./report/snapshot.ts');
  const snapshotFilePath = generateSnapshot(info);
  const timestamp = new Date().toISOString();
  return new Promise<void>((resolve, reject) => {
    const child: ChildProcess = fork(
      getPath('./scripts/runner/memory.ts'),
      [info.fullPath, options.iterations.toString(), options.dataType, options.samplingInterval.toString()],
      { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] }
    );

    child.on('message', (message: ChildMessage) => {
      if (message.type === 'result' && typeof message.peakMemoryUsage === 'number') {
        const peakMemoryUsageMB = message.peakMemoryUsage / 1024 / 1024;
        console.log('\n\n\nPerformance test completed successfully.');
        console.log(
          `Peak Memory Usage: ${peakMemoryUsageMB.toFixed(typeof options.precision === 'number' && options.precision > 0 ? options.precision : 4)} MB`
        );
        resolve();
      }
    });

    child.on('exit', () => resolve());

    child.send({ type: 'start' });
  });
}
