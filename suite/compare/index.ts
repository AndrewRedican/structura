import type {CompareOptions, ComparisonResult} from '../compare/model/compare.ts';
import {generateData} from '../../scripts/generateData/generateData.ts';

export async function compare(options: CompareOptions) {
  const measurement = [options.time ? 'execution duration (time in milliseconds)' : '', options.memory ? 'peak memory usage': ''].filter(s => s).join(' and ')
  console.log(`
Comparing performance ${measurement}:
 • Algorithm A path: ${options.algorithmPathA}
 • Algorithm B path: ${options.algorithmPathA}
 • Iterations: ${options.iterations}
 • Precision: ${options.precision}
 • Data Type: ${options.dataType}`);
  if (options.samplingInterval) {
    console.log(` • Sampling Interval: ${options.samplingInterval}`);
  }
  generateData(options.iterations, options.dataType);
  const comparison = { time: [], memory: [] } as unknown as ComparisonResult;
  const measurements: ((algorithmPath: string, options: any) => Promise<any>)[] = [];
  if (options.time) {
    const {measureTimeQuietly} = await import('../measure/time.ts');
    measurements.push(measureTimeQuietly);
  }
  if (options.memory) {
    const {measureMemoryQuietly} = await import('../measure/memory.ts');
    measurements.push(measureMemoryQuietly);
  }
  const paths = Object.freeze([options.algorithmPathA, options.algorithmPathB]);
  const list: ({ fn: (algorithmPath: string, options: any) => Promise<any>, path: string })[] = [];
  const results = await Promise.all(
    measurements.reduce((process, fn) => (paths.forEach(path => process.push({ fn, path })), process), list)
    .map(({fn, path }) => fn(path, options))
  );
  options.time && (comparison.time = results.splice(0, 2) as ComparisonResult['time']);
  options.memory && (comparison.memory = results.splice(0, 2) as ComparisonResult['memory']);
  logComparison(comparison, options);
}

function logComparison(comparison: ComparisonResult, options: CompareOptions): void {
  const headers = ['Metric', 'Algorithm A', 'Algorithm B'];
  const rows: string[][] = [];

  if (options.time && comparison.time) {
    const timeA = (comparison.time[0].totalDuration).toFixed(options.precision);
    const timeB = (comparison.time[1].totalDuration).toFixed(options.precision);
    rows.push(['Total Time (ms)', timeA, timeB]);
    const avgTimeA = (comparison.time[0].averageDuration).toFixed(options.precision);
    const avgTimeB = (comparison.time[1].averageDuration).toFixed(options.precision);
    rows.push(['Average Time per Iteration (ms)', avgTimeA, avgTimeB]);
    const minTimeA = (comparison.time[0].minDuration).toFixed(options.precision);
    const minTimeB = (comparison.time[1].minDuration).toFixed(options.precision);
    rows.push(['Min Time (ms)', minTimeA, minTimeB]);
    const maxTimeA = (comparison.time[0].maxDuration).toFixed(options.precision);
    const maxTimeB = (comparison.time[1].maxDuration).toFixed(options.precision);
    rows.push(['Max Time (ms)', maxTimeA, maxTimeB]);
  }

  if (options.memory && comparison.memory) {
    const memA = (comparison.memory[0].peakMemoryUsage / (1024 * 1024)).toFixed(options.precision);
    const memB = (comparison.memory[1].peakMemoryUsage / (1024 * 1024)).toFixed(options.precision);
    rows.push(['Peak Memory (MB)', memA, memB]);
  }

  // Calculate the maximum width of each column
  const colWidths = headers.map((header, i) => {
    return Math.max(
      header.length,
      ...rows.map((row) => row[i].length)
    );
  });

  // Function to format a row with proper spacing
  const formatRow = (row: string[]) => {
    return row
      .map((cell, i) => cell.padEnd(colWidths[i]))
      .join(' | ');
  };

  // Build the table
  const separator = colWidths.map((width) => '-'.repeat(width)).join('-|-');
  const table = [
    formatRow(headers),
    separator,
    ...rows.map(formatRow),
  ];

  console.log(`\n\n${table.join('\n')}`);
}