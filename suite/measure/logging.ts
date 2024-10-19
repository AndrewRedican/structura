import type {LogFunction, Logger} from './model/logging.ts';

const noop = () => void 0;

export const createLogger = (log: LogFunction = console.log, error: LogFunction = console.error, warn: LogFunction = console.warn): Logger => ({
  log,
  error,
  warn
})

export const defaultLogger = createLogger();

export const silentLogger = createLogger(noop, noop, noop);