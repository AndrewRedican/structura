import type {DataGeneratorName} from '../../../scripts/generateData/model.ts';

export interface MeasureOptions {
  time: boolean;
  memory: boolean;
  algorithmPath: string;
  iterations: number;
  precision: number;
  samplingInterval: number;
  dataType: DataGeneratorName;
};
