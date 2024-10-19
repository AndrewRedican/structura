import type {DataGeneratorName} from '../../../scripts/generateData/model.ts';

export interface RunOptions {
  samplingInterval: number;
  precision: number;
  iterations: number;
  dataType: DataGeneratorName;
}

export interface ChildMessage {
  type: 'result' | 'error';
  algorithmName?: string;
  algorithmBody?: string;
  peakMemoryUsage: number;
  currentIteration?: number;
  currentInputData?: string;
  errorMessage?: string;
  errorStack?: string;
}