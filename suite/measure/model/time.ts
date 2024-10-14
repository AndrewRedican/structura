import type {DataGeneratorName} from '../../../scripts/generateData/model.ts';

export interface RunOptions {
  precision: number;
  iterations: number;
  dataType: DataGeneratorName;
}

export interface TimeStats {
  totalDuration: number;
  minDuration: number;
  maxDuration: number;
  averageDuration: number;
}

export interface ChildMessage {
  type: string;
  algorithmName?: string;
  algorithmBody?: string;
  timeStats?: TimeStats;
  iteration?: number;
  inputData?: string;
  errorMessage?: string;
  errorStack?: string;
}