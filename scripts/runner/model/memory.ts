export interface ParentMessage {
  type: string;
}

export interface MemoryStats {
  peakMemoryUsage: number;
  samplingInterval: number;
  memoryInterval: NodeJS.Timeout;
}