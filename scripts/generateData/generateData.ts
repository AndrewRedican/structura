import type {DataGeneratorName, DataGenerator} from './model.ts';
import {join, dirname} from 'path';
import {existsSync, statSync, readFileSync, writeFileSync} from 'fs';
import {ensureDirectoryExists} from '../utils/ensureDirectoryExists.ts';
import {convertJsonArrayToNdjson} from '../utils/convertJsonArrayToNdjson.ts';
import {getPath} from '../utils/getPath.ts';
import {generate} from './generators/index.ts';

interface DataCache {
  [DataGeneratorName: string]: number;
}

export function generateData(numEntries: number, dataType: DataGeneratorName): void {
  const generators = generate()
  if (typeof numEntries !== 'number' || isNaN(numEntries) || numEntries <= 0) {
    console.error(`Invalid number of entries: ${numEntries}. Must be greater than zero.`);
    return;
  }
  const dataTypes = Object.keys(generators);
  if (typeof dataType !== 'string' || !dataTypes.includes(dataType)) {
    console.error(`Unknown data type: ${dataType}. Valid types are: ${dataTypes.join(', ')}.`);
  }
  const dataGenerator = generators[dataType];
  const fileName = `${dataType}.json`;
  const dataDir = getPath('./data');
  const finalFilePath = join(dataDir, fileName);
  const cacheFilePath = join(dataDir, '.cache.json');
  ensureDirectoryExists(dataDir);
  let dataCache: DataCache = {};
  if (existsSync(cacheFilePath) && statSync(cacheFilePath).isFile()) {
    try {
      const cacheContent = readFileSync(cacheFilePath, 'utf-8');
      dataCache = JSON.parse(cacheContent);
    } catch (error) {
      console.warn(
        `Warning: Failed to read cache file at ${cacheFilePath}. Proceeding without cache.`
      );
    }
  }
  const existingEntries = dataCache[dataType] || 0;
  if (existingEntries >= numEntries) {
    console.log(`\nData for type ${dataType} already exists with ${existingEntries} entries, which is sufficient. Skipping data generation.`);
    return;
  }
  console.log(`Generating ${numEntries} fake entries of ${dataType} type data...`);
  console.log(`Output file path: ${finalFilePath}`);
  const data = generateDataArray(numEntries, dataGenerator);
  writeDataToFile(finalFilePath, data);
  convertJsonArrayToNdjson(dataType);
  dataCache[dataType] = data.length;
  writeFileSync(cacheFilePath, JSON.stringify(dataCache, null, 2));
  console.log(`Generated and stored ${numEntries} fake entries successfully.`);
};

function generateDataArray(numEntries: number, generator: DataGenerator): any[] {
  const data: any[] = [];
  for (let i = 0; i < numEntries; i+=1) {
    data.push(generator());
  }
  return data;
};

function writeDataToFile(filePath: string, data: any[]): void {
  let existingData: any[] = [];
  ensureDirectoryExists(dirname(filePath));
  if (existsSync(filePath) && statSync(filePath).isFile()) {
    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      existingData = JSON.parse(fileContent);
    } catch (error) {
      console.warn(`Warning: Failed to read existing data from ${filePath}. Starting with a new array.`);
    }
  }
  existingData.push(...data);
  writeFileSync(filePath, JSON.stringify(existingData, null, 2));
};
