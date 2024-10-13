import type {MeasureOptions} from './model/measure.ts'

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
console.log(`\n`);

  // TODO: Need to define this dependant on options
  const inputCallback = (i: number) => {
    return { index: i };
  };

  if (options.time) {
    const { measureTime } = await import('./time.ts');
    await measureTime(options.algorithmPath, options.iterations, {
      inputCallback,
      precision: options.precision
    });
  }
  if (options.memory) {
    const { measureMemory } = await import('./memory.ts');
    await measureMemory(options.algorithmPath, options.iterations, {
      inputCallback,
      samplingInterval: options.samplingInterval,
      precision: options.precision,
    });
  }
}

