import type {TimeStats} from './model/time.ts';
import {performance} from 'perf_hooks';
import {createRunner} from './createRunner.ts';

const context: TimeStats = {
  totalDuration: 0,
  minDuration: Infinity,
  maxDuration: 0,
  averageDuration: 0,
  _st: 0
}

createRunner<TimeStats>({
  onIterationStart: async (ctx) => ctx._st = performance.now(),
  onIterationEnd: async (ctx) => {
    const endTime = performance.now();
    const duration = endTime - ctx._st;
    ctx.totalDuration += duration;
    if (duration > ctx.maxDuration) ctx.maxDuration = duration;
    if (duration < ctx.minDuration) ctx.minDuration = duration;
  },
  onEnd: async (ctx) => (ctx.iterations > 0 && (ctx.averageDuration = ctx.totalDuration / ctx.iterations))
}, context);
