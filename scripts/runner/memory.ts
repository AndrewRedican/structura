import type {MemoryStats} from './model/memory.ts';
import {createRunner} from './createRunner.ts';

const context = { peakMemoryUsage: 0, samplingInterval: 10 } as MemoryStats

createRunner<MemoryStats>({
  onStart: async (ctx) => {
    ctx.samplingInterval = parseInt(process.argv[5], 10);
    ctx.memoryInterval = setInterval(() => {
      const currentMemory = process.memoryUsage().heapUsed;
      if (currentMemory > ctx.peakMemoryUsage) {
        ctx.peakMemoryUsage = currentMemory;
      }
    }, ctx.samplingInterval);
  },
  onEnd: async (ctx) => clearInterval(ctx.memoryInterval),
  onError: async (_, ctx) => clearInterval(ctx.memoryInterval),
}, context);
``