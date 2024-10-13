export interface RunOptions {
  inputCallback?: (iteration: number) => any;
  precision: number;
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