import type {MeasureOptions} from './model/measure.ts';
import {generateData} from '../../scripts/generateData/generateData.ts';

export async function measure(options: MeasureOptions) {
  const measurement = [options.time ? 'execution duration (time in milliseconds)' : '', options.memory ? 'peak memory usage': ''].filter(s => s).join(' and ')
  console.log(`
Measuring performance ${measurement}:
 • Algorithm path: ${options.algorithmPath}
 • Iterations: ${options.iterations}
 • Precision: ${options.precision}
 • Data Type: ${options.dataType}`);
  if (options.samplingInterval) {
    console.log(` • Sampling Interval: ${options.samplingInterval}`);
  }
  generateData(options.iterations, options.dataType);
  if (options.time) {
    const {measureTime} = await import('./time.ts');
    await measureTime(options.algorithmPath, options);
  }
  if (options.memory) {
    const {measureMemory} = await import('./memory.ts');
    await measureMemory(options.algorithmPath, options);
  }
}

