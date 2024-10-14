import type {DataGeneratorName} from '../../../scripts/generateData/model.ts';

export interface RunOptions {
  samplingInterval: number;
  precision: number;
  iterations: number;
  dataType: DataGeneratorName;
}

export interface ChildMessage {
  type: string;
  algorithmName: string;
  iteration: number;
  peakMemoryUsage: number;
}