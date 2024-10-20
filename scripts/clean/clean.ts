import {existsSync, rmSync} from 'fs';
import {getPath} from '../utils/getPath.ts';

export function cleanPathsSync(...pathsToClean: string[]): void {
  for (const path of pathsToClean) {
    const fullPath = getPath(path);
    if (existsSync(fullPath)) {
      try {
        rmSync(fullPath, { recursive: true, force: true });
        console.log(`Removed data from: ${fullPath}`);
      } catch (error) {
        console.error(`Error cleaning directory ${fullPath}:`, (error as Error)?.message);
      }
    } else {
      console.log(`Directory does not exist: ${fullPath}`);
    }
  }
}
