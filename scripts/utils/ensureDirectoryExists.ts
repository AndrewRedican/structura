import { existsSync, mkdirSync } from 'fs';

export function ensureDirectoryExists(dirPath: string) {
  if (typeof dirPath !== 'string' || dirPath.length === 0) {
    throw new Error('dirPath must be a valid string')
  }
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
};