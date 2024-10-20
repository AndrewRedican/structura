import {readFileSync, writeFileSync} from 'fs';
import {join} from 'path';
import {getPath} from '../utils/getPath.ts';
import {getLatestVersionFile, srcDir} from '../version/version.ts';

const stableFile = getPath('./src/stable.ts');

export function promote(): void {
  const latestVersionFile = getLatestVersionFile();

  if (!latestVersionFile) {
    console.error('\nNo versioned file found to promote.');
    return;
  }

  const latestVersionFilePath = join(srcDir, latestVersionFile);
  const fileContent = readFileSync(latestVersionFilePath, 'utf-8');

  writeFileSync(stableFile, fileContent);
  console.log(`\nPromoted: ${latestVersionFile} to stable.ts`);
}