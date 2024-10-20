import type {DataGeneratorName} from '../../../scripts/generateData/model.ts';
import type {TimeRunnerMessage} from '../../measure/model/time.ts';
import type {MemoryRunnerMessage} from '../../measure/model/memory.ts';

export interface CompareOptions {
  time: boolean;
  memory: boolean;
  algorithmPathA: string;
  algorithmPathB: string;
  iterations: number;
  precision: number;
  samplingInterval: number;
  dataType: DataGeneratorName;
};

export interface ComparisonResult {
  time?: [TimeRunnerMessage, TimeRunnerMessage];
  memory?: [MemoryRunnerMessage, MemoryRunnerMessage];
}