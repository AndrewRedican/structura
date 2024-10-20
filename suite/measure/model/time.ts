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

export interface TimeRunnerMessage extends TimeStats {
  type: 'result' | 'error';
  algorithmName?: string;
  algorithmBody?: string;
  currentIteration?: number;
  currentInputData?: string;
  errorMessage?: string;
  errorStack?: string;
}