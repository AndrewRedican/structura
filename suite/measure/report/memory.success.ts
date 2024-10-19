import type {Algorithm} from '../model/algorithm.ts';
import type {ChildMessage, RunOptions} from '../model/memory.ts';
import type {Logger} from '../model/logging.ts';
import {existsSync, appendFileSync} from 'fs';
import {resolve, join} from 'path';
import {getPath} from '../../../scripts/utils/getPath.ts';
import {ensureDirectoryExists} from '../../../scripts/utils/ensureDirectoryExists.ts';
import {green, cyan, MB, ms} from './utils.ts'

export function reportSuccess(logger: Logger, algorithm: Algorithm, timestamp: string, message: ChildMessage, options: RunOptions): void {
  if (message.type !== 'result') return;
  logger.log(`\nMemory Usage Test: ${green('✓ Completed Successfully')}`);
  const peakMemoryUsageMB = message.peakMemoryUsage / 1024 / 1024;
  logger.log(`Details:
 • Total Iterations: ${cyan(options.iterations)}
 • Peak Memory Usage: ${cyan(`${MB(peakMemoryUsageMB)} at a sampling interval of ${ms(options.samplingInterval)}`)}`);
  try {
    const reportDir = resolve(getPath('./performance/raw'), algorithm.fileName);
    ensureDirectoryExists(reportDir);
    const reportFilePath = join(reportDir, `${algorithm.sha}.memory.csv`);
    if (!existsSync(reportFilePath)) {
      appendFileSync(reportFilePath, 'Timestamp,Total Iterations,Peak Memory Usage (MB)\n');
    }
    appendFileSync(reportFilePath, `${timestamp},${options.iterations},${peakMemoryUsageMB}\n`);
    logger.log(` • Performance Report: ${cyan(reportFilePath)}`);
  } catch (error) {
    throw new Error('Could not generate memoery usage report.\n' + error);
  }
}