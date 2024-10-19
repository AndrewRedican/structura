import type {ChildMessage} from '../model/memory.ts'
import type {Algorithm} from '../model/algorithm.ts';
import type {Logger} from '../model/logging.ts';
import {writeFileSync} from 'fs';
import {resolve, join} from 'path';
import {getPath} from '../../../scripts/utils/getPath.ts';
import {ensureDirectoryExists} from '../../../scripts/utils/ensureDirectoryExists.ts';
import {red, cyan} from './utils.ts'

export function reportError(logger: Logger, algorithm: Algorithm, timestamp: string, snapshotFilePath: string, message: ChildMessage): void {
  if (message.type !== 'error') return;
  logger.log(`\nMemory Usage Test: ${red('✗ Failed')}`);
  const errorDetails = `Details
 • Execution Timestamp: ${timestamp}
 • Error Timestamp: ${new Date().toISOString()}
 • Iteration: ${message.currentIteration}
 • Input Data: ${message.currentInputData}
 • Error Message: ${message.errorMessage}
 • Error Stack Trace: ${message.errorStack}
 • Snapshot File: ${snapshotFilePath}
 • Function Name: ${message.algorithmName}
 • Function Body:
${message.algorithmBody}
`;
  try {
    const errorDir = resolve(getPath('./errors'), algorithm.fileName);
    const errorFilePath = join(errorDir, `${algorithm.sha}.log`);
    ensureDirectoryExists(errorDir);
    writeFileSync(errorFilePath, errorDetails);
    logger.error(` • Error details have been logged at: ${cyan(errorFilePath)}\n\n`);
  } catch (error) {
    throw new Error('Could not generate execution time report.\n' + error);
  }
}