export function functionName(fn: Function): string {
  return fn?.name || 'Unknown'
}