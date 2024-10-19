import type {DataGeneratorName} from '../../../scripts/generateData/model.ts'

export interface MeasurementOptions<RunOptions, ChildMessage> {
  /**
   * Path to the algorithm file to be measured.
   */
  algorithmPath: string;
  /**
   * Options specific to the measurement run (e.g., iterations, dataType).
   */
  options: RunOptions & { dataType: DataGeneratorName };
  /**
   * Path to the runner script that will execute the measurement (e.g., './scripts/runner/time.ts').
   */
  runnerScript: string;
  /**
   * Function that generates the arguments to be passed to the runner script.
   *
   * @param info - Information about the algorithm (from getAlgorithmInfo).
   * @param options - The run options provided to the measurement.
   * @returns An array of string arguments for the runner script.
   */
  runnerArgs: (info: any, options: RunOptions) => string[];
  /**
   * Callback invoked when the child process sends a 'result' message.
   *
   * @param info - Information about the algorithm.
   * @param timestamp - The timestamp when the measurement started.
   * @param message - The message received from the child process.
   * @param options - The run options provided to the measurement.
   */
  onResult: (
    info: any,
    timestamp: string,
    message: ChildMessage,
    options: RunOptions
  ) => Promise<void>;
  /**
   * Callback invoked when the child process sends an 'error' message.
   *
   * @param info - Information about the algorithm.
   * @param timestamp - The timestamp when the measurement started.
   * @param snapshotFilePath - The path to the snapshot file.
   * @param message - The error message received from the child process.
   */
  onError: (
    info: any,
    timestamp: string,
    snapshotFilePath: string,
    message: ChildMessage
  ) => Promise<void>;
}