import type {DataGeneratorName} from '../generateData/model.ts';
import {execSync} from 'child_process';
import {resolve} from 'path';
import {getPath} from '../utils/getPath.ts';

export function convertJsonArrayToNdjson(dataType: DataGeneratorName): void {
  if (typeof dataType !== 'string' || dataType.length === 0) {
    throw new Error('Cannot conver json into ndjson file without a valid dataType.');
  }
  const dataDir = getPath('./data');
  const inputFilePath = resolve(dataDir, `${dataType}.json`);
  const outputFilePath = resolve(dataDir, `${dataType}.ndjson`);
  const command = `jq -c '.[]' "${inputFilePath}" > "${outputFilePath}"`;
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`Converted ${inputFilePath} to NDJSON format at ${outputFilePath}`);
  } catch (error) {
    console.error(`Failed to convert JSON to NDJSON for dataType: ${dataType}`, error);
  }
}