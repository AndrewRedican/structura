import {existsSync, writeFileSync} from 'fs';
import {resolve, join, extname} from 'path';
import {getPath} from '../../../scripts/utils/getPath.ts';
import {ensureDirectoryExists} from '../../../scripts/utils/ensureDirectoryExists.ts';

export function generateSnapshot(fileName: string, sha: string, algorithmPath: string, fileBuffer: Buffer): string {
  const dir = resolve(getPath('./snapshots'), fileName);
  ensureDirectoryExists(dir);
  const fullPath = join(dir, sha + extname(algorithmPath));
  if (!existsSync(fullPath)) {
    writeFileSync(fullPath, fileBuffer);
  }
  return fullPath;
}