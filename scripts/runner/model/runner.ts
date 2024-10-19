export interface InternalContext {
  readonly algorithmPath: string;
  readonly iterations: number;
  readonly dataType: string;
  readonly dataFilePath: string;
  readonly currentIteration: number;
  readonly currentInputData: any;
}

export interface RunnerOptions<Context> {
  /**
   * Optional callback invoked before the runner starts processing iterations.
   * Use this to perform any setup required before iterations begin.
   *
   * @returns A promise that resolves when the setup is complete.
   */
  onStart?: (context: Context & InternalContext) => Promise<any>;

  /**
   * Optional callback invoked at the beginning of each iteration.
   * Use this to perform any per-iteration setup or monitoring.
   *
   * @param iteration - The current iteration index (starting from 0).
   * @param inputData - The input data for the current iteration.
   * @returns A promise that resolves when the iteration start logic is complete.
   */
  onIterationStart?: (context: Context & InternalContext) => Promise<any>;

  /**
   * Optional callback invoked at the end of each iteration.
   * Use this to perform any per-iteration teardown or data collection.
   *
   * @param iteration - The current iteration index (starting from 0).
   * @param inputData - The input data for the current iteration.
   * @returns A promise that resolves when the iteration end logic is complete.
   */
  onIterationEnd?: (context: Context & InternalContext) => Promise<any>;

  /**
   * Optional callback invoked after all iterations have been processed.
   * Use this to perform any cleanup or final calculations.
   *
   * @returns A promise that resolves to the statistics or results of type `TStats`.
   */
  onEnd?: (context: Context) => Promise<any>;

  /**
   * Optional callback for handling errors that occur during execution.
   * Use this to log errors, clean up resources, or perform any error-specific logic.
   *
   * @param error - The error that was thrown.
   * @param iteration - The iteration index at which the error occurred.
   * @param inputData - The input data that caused the error.
   * @returns A promise that resolves when the error handling is complete.
   */
  onError?: (error: Error, context: Context & InternalContext) => Promise<void>;

  /**
   * Optional function to parse each line of input data.
   * Use this to customize how input data lines are converted into usable objects.
   *
   * @param line - A single line of input data from the data file.
   * @returns The parsed input data object.
   */
  dataParser?: (line: string) => any;
}
