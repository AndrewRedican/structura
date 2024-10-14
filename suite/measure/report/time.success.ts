import type {Algorithm} from '../model/algorithm.ts';
import type {ChildMessage, RunOptions} from '../model/time.ts';
import {existsSync, appendFileSync} from 'fs';
import {resolve, join} from 'path';
import {getPath} from '../../../scripts/utils/getPath.ts';
import {ensureDirectoryExists} from '../../../scripts/utils/ensureDirectoryExists.ts';
import {green, cyan, ms} from './utils.ts'

export function reportSuccess(algorithm: Algorithm, timestamp: string, message: ChildMessage, options: RunOptions): void {
  if (message.type !== 'result' || typeof message.timeStats !== 'object') {
    return;
  }
  console.log(`\nExecution Time Test: ${green('✓ Completed Successfully')}`);
  const precision = typeof options.precision === 'number' && options.precision > 0 ? options.precision : 4
  const totalDuration = message.timeStats.totalDuration.toFixed(precision);
  const minDuration = message.timeStats.minDuration.toFixed(precision);
  const maxDuration = message.timeStats.maxDuration.toFixed(precision);
  const averageDuration = message.timeStats.averageDuration.toFixed(precision);
  console.log(`Details:
 • Total Iterations: ${cyan(options.iterations)}
 • Total Duration: ${cyan(ms(totalDuration))}
 • Min Duration: ${cyan(ms(minDuration))}
 • Max Duration: ${cyan(ms(maxDuration))}
 • Average Duration: ${cyan(ms(averageDuration))}`);
  try {
    const reportDir = resolve(getPath('./performance/raw'), algorithm.fileName);
    ensureDirectoryExists(reportDir);
    const reportFilePath = join(reportDir, `${algorithm.sha}.csv`);
    if (!existsSync(reportFilePath)) {
      appendFileSync(reportFilePath, 'Timestamp,Total Iterations,Total Duration (ms),Min Duration (ms),Max Duration (ms),Average Duration (ms)\n');
    }
    appendFileSync(reportFilePath, `${timestamp},${options.iterations},${totalDuration},${minDuration},${maxDuration},${averageDuration}\n`);
    console.log(` • Performance Report: ${cyan(reportFilePath)}`);
  } catch (error) {
    throw new Error('Could not generate execution time report.\n' + error);
  }
}