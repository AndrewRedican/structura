export interface ParentMessage {
  type: string;
}

export interface TimeStats {
  totalDuration: number;
  minDuration: number;
  maxDuration: number;
  averageDuration: number;
}