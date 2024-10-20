import {existsSync, readFileSync} from 'fs';
import {exitWithError} from '../../scripts/utils/exitWithError.ts';
import {getPath} from '../../scripts/utils/getPath.ts';

export function createConfigFileReader<T extends Object>(path: string, name: string): () => T {
  return () => {
    const configPath = getPath(path);
    if (existsSync(configPath)) {
      try {
        return JSON.parse(readFileSync(configPath, 'utf8'));
      } catch (error) {
        exitWithError(`Failed to read or parse ${name} file.`, (error as Error)?.message);
      }
    }
    return {};
  }
}
