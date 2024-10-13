export interface RunOptions {
  inputCallback?: (iteration: number) => any;
  samplingInterval: number;
  precision: number;
}

export interface ChildMessage {
  type: string;
  algorithmName: string;
  iteration: number;
  peakMemoryUsage: number;
}