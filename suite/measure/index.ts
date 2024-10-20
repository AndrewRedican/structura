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
  const measurements: ((algorithmPath: string, options: any) => Promise<any>)[] = [];
  if (options.time) {
    const {measureTime} = await import('./time.ts');
    measurements.push(measureTime);
  }
  if (options.memory) {
    const {measureMemory} = await import('./memory.ts');
    measurements.push(measureMemory);
  }
  await Promise.all(measurements.map(fn => fn(options.algorithmPath, options)));
}

