import type {Algorithm} from '../model/algorithm.ts';
import type {TimeRunnerMessage, RunOptions} from '../model/time.ts';
import type {Logger} from '../model/logging.ts';
import {existsSync, appendFileSync} from 'fs';
import {resolve, join} from 'path';
import {getPath} from '../../../scripts/utils/getPath.ts';
import {ensureDirectoryExists} from '../../../scripts/utils/ensureDirectoryExists.ts';
import {green, cyan, ms} from './utils.ts'

export function reportSuccess(logger: Logger, algorithm: Algorithm, timestamp: string, message: TimeRunnerMessage, options: RunOptions): void {
  if (message.type !== 'result') return;
  logger.log(`\nExecution Time Test: ${green('✓ Completed Successfully')}`);
  const precision = typeof options.precision === 'number' && options.precision > 0 ? options.precision : 4
  const totalDuration = message.totalDuration.toFixed(precision);
  const minDuration = message.minDuration.toFixed(precision);
  const maxDuration = message.maxDuration.toFixed(precision);
  const averageDuration = message.averageDuration.toFixed(precision);
  logger.log(`Details:
 • Total Iterations: ${cyan(options.iterations)}
 • Total Duration: ${cyan(ms(totalDuration))}
 • Min Duration: ${cyan(ms(minDuration))}
 • Max Duration: ${cyan(ms(maxDuration))}
 • Average Duration: ${cyan(ms(averageDuration))}`);
  try {
    const reportDir = resolve(getPath('./performance/raw'), algorithm.fileName);
    ensureDirectoryExists(reportDir);
    const reportFilePath = join(reportDir, `${algorithm.sha}.time.csv`);
    if (!existsSync(reportFilePath)) {
      appendFileSync(reportFilePath, 'Timestamp,Total Iterations,Total Duration (ms),Min Duration (ms),Max Duration (ms),Average Duration (ms)\n');
    }
    appendFileSync(reportFilePath, `${timestamp},${options.iterations},${totalDuration},${minDuration},${maxDuration},${averageDuration}\n`);
    logger.log(` • Performance Report: ${cyan(reportFilePath)}`);
  } catch (error) {
    throw new Error('Could not generate execution time report.\n' + error);
  }
}