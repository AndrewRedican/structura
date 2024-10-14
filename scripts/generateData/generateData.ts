import type {DataGeneratorName, DataGenerator} from './model.ts';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';
import {existsSync, statSync, readFileSync, writeFileSync} from 'fs';
import {ensureDirectoryExists} from '../utils/ensureDirectoryExists.ts';
import {convertJsonArrayToNdjson} from '../utils/convertJsonArrayToNdjson.ts';
import {generate} from './generators/index.ts';

export function generateData(numEntries: number, dataType: DataGeneratorName): void {
  const generators = generate()
  if (typeof numEntries !== 'number' || isNaN(numEntries) || numEntries <= 0) {
    console.error(`Unknown number of entries: ${numEntries}. Must be greater than zero.`);
    return;
  }
  if (typeof dataType !== 'string' || !Object.keys(generators).includes(dataType)) {
    console.error(`Unknown data type: ${dataType}. Valid types are: none, small, standard, complex, varied.`);
  }
  const dataGenerator = generators[dataType];
  const fileName = `${dataType}.json`;
  const dataDir = join(dirname(fileURLToPath(import.meta.url)), '../../', 'data');
  const finalFilePath = join(dataDir, fileName);
  console.log(`Generating ${numEntries} fake entries of ${dataType} type data...`);
  console.log(`Output file path: ${finalFilePath}`);
  const data = generateDataArray(numEntries, dataGenerator);
  writeDataToFile(finalFilePath, data);
  convertJsonArrayToNdjson(dataType);
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

