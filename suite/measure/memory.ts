import type {RunOptions, ChildMessage} from './model/memory.ts'
import {fork, ChildProcess} from 'child_process';
import {getPath} from '../../scripts/utils/getPath.ts';

export async function measureMemory(
  algorithmPath: string,
  iterations: number,
  options: RunOptions
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const child: ChildProcess = fork(
      getPath('./scripts/runner/memory.ts'),
      [algorithmPath, iterations.toString(), (options.samplingInterval > 0 ? options.samplingInterval : 10).toString()],
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

    child.on('exit', (code: number | null) => {
      if (code !== 0) {
        reject(new Error(`Child process exited with code ${code}`));
      }
    });

    child.send({
      type: 'start',
      options: {
        inputCallback: typeof options.inputCallback === 'function' ? options.inputCallback.toString() : null,
      },
    });
  });
}
