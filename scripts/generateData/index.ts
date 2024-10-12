import type {DataGeneratorName} from './model.ts'
import {generateData} from './generateData.ts'

const ENTRIES_ARG = parseInt(process.argv[4], 10);
const DATE_TYPE = process.argv[3] as DataGeneratorName;

generateData(ENTRIES_ARG, DATE_TYPE);