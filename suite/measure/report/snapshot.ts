import type {Algorithm} from '../model/algorithm.ts';
import {existsSync, writeFileSync} from 'fs';
import {resolve, join, extname} from 'path';
import {getPath} from '../../../scripts/utils/getPath.ts';
import {ensureDirectoryExists} from '../../../scripts/utils/ensureDirectoryExists.ts';

export function generateSnapshot(algorithm: Algorithm): string {
  const dir = resolve(getPath('./snapshots'), algorithm.fileName);
  ensureDirectoryExists(dir);
  const fullPath = join(dir, algorithm.sha + extname(algorithm.fullPath));
  if (!existsSync(fullPath)) {
    writeFileSync(fullPath, algorithm.content);
  }
  return fullPath;
}