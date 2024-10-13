export interface ParentMessage {
  type: string;
  options?: ChildOptions;
}

interface ChildOptions {
  inputCallback?: string | null;
}

export interface TimeStats {
  totalDuration: number;
  minDuration: number;
  maxDuration: number;
  averageDuration: number;
}