import type {DataGeneratorName} from '../generateData/model.ts';
import {existsSync} from 'fs';
import {resolve} from 'path';
import {ensureDirectoryExists} from './ensureDirectoryExists.ts';
import {convertJsonArrayToNdjson} from './convertJsonArrayToNdjson.ts';

export function ensureNdjsonFile(dataType: DataGeneratorName): void {
  if (typeof dataType !== 'string' || dataType.length === 0) {
    throw new Error('Cannot ensure ndjson file exists without a valid dataType.');
  }
  const dataDir = resolve('data');
  ensureDirectoryExists(dataDir);
  const jsonFilePath = resolve(dataDir, `${dataType}.json`);
  const ndjsonFilePath = resolve(dataDir, `${dataType}.ndjson`);
  if (!existsSync(jsonFilePath)) {
    throw new Error(`JSON data file does not exist: ${jsonFilePath}`);
  }
  if (!existsSync(ndjsonFilePath)) {
    convertJsonArrayToNdjson(dataType);
  }
}