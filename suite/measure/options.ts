import type {MeasureOptions} from './model/measure.ts'
import {exitWithError} from '../../scripts/utils/exitWithError.ts'
import {getPath} from '../../scripts/utils/getPath.ts'

export function getOptions(): MeasureOptions {
  const args = process.argv.slice(2);
  const options = { time: false, memory: false } as MeasureOptions;
  for (let i = 0; i < args.length; i+= 1) {
    switch (args[i]) {
      case '-t': case '--time':
        options.time = true;
        break;
      case '-m': case '--memory':
        options.memory = true;
        break;
      case '-a': case '--algorithm':
        options.algorithmPath = args[++i];
        break;
      case '-i': case '--iterations':
        options.iterations = parseInt(args[++i], 10);
        break;
      case '-p': case '--precision':
        options.precision = parseInt(args[++i], 10);
        break;
      case '-s': case '--sampling-interval':
        options.samplingInterval = parseInt(args[++i], 10);
        break;
      case '-d': case '--data-type':
        options.dataType = args[++i] as MeasureOptions['dataType'];
        break;
      default:
        exitWithError(`Unknown argument: ${args[i]}`);
    }
  }
  if (typeof options.algorithmPath !== 'string' || options.algorithmPath.length === 0) {
    exitWithError(
      'Algorithm path is required',
      'Use -a or --algorithm to specify the path algorithm under test relative to the root directory of the project.'
    );
  } else {
    options.algorithmPath = resolvePath(options.algorithmPath);
  }
  if (!options.time && !options.memory) {
    exitWithError(
      'Measurement option is required.',
      'Use -t or --time to measure execution time.',
      'Use -m or --memory to measure memory usage.'
    );
  }
  if (typeof options.iterations !== 'number' || isNaN(options.iterations) || options.iterations <= 0) {
    exitWithError(
      'Iterations is required.',
      'Use -i or --iterations the number of records and times to run the algorithm against.'
    )
  }
  if (typeof options.precision !== 'number' || isNaN(options.precision) || options.precision <= 0) {
    exitWithError(
      'Precision is required.',
      'Use -p or --precision to specify the number of significant digits.'
    )
  }
  if (typeof options.precision !== 'number' || isNaN(options.precision) || options.precision <= 0) {
    exitWithError(
      'Precision is required.',
      'Use -p or --precision to specify the number of significant digits.'
    )
  }
  if (options.memory) {
    if (typeof options.samplingInterval !== 'number' || isNaN(options.samplingInterval) || options.samplingInterval <= 0) {
      exitWithError(
        'Sampling interval is required when tracking memory usage.',
        'Use -s or --sampling-interval to specify the time between memory usage sample taking in milliseconds'
      )
    }
  }
  if (typeof options.dataType !== 'string' || options.dataType.length === 0) {
    exitWithError(
      'Data type is required.',
      'Use -d or --data-type to type of data used for performance tests.',
      'The following are supported out of the box: small, standard, complex, varied.'
    )
  }
  return options;
}

function resolvePath(path: string): string {
  path = getPath(path.startsWith('./src') ? path : !path.startsWith('./') ? `./src/${path}` : `./src/${path.slice(2)}`);
  if (path.split('/').pop()?.indexOf('.') === -1) {
    path += '.ts';
  }
  return path
}