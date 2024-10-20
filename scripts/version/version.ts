import {readdirSync, readFileSync, writeFileSync, existsSync} from 'fs';
import {join} from 'path';
import {getPath} from '../utils/getPath.ts';

export const srcDir = getPath('./src');

export function createVersionedFile(): void {
  const nextVersionFile = getNextVersionFile();
  const nextVersionFunction = nextVersionFile.replace('.ts', ''); // e.g. 'v3'

  const latestVersionFile = readdirSync(srcDir).find((file) => file === `v${parseInt(nextVersionFunction.slice(1)) - 1}.ts`);

  let fileContent: string;

  if (latestVersionFile && existsSync(join(srcDir, latestVersionFile))) {
    fileContent = readFileSync(join(srcDir, latestVersionFile), 'utf-8');
  } else {
    fileContent = `
export default async function ${nextVersionFunction}(inputData: any): Promise<void> {
  // Uncomment to print data passed into the function
  // console.log(inputData);

  // Uncomment to test some memory usage
  // const data = new Array(1000).fill('x');

  // Uncomment to test time execution by simulating processing delay
  // await new Promise((resolve) => setTimeout(resolve, 10));
}
`;
  }

  const filePath = join(srcDir, nextVersionFile);
  writeFileSync(filePath, fileContent.trim());
  console.log(`Created: ${nextVersionFile}`);
}

export function getNextVersionFile(): string {
  const files = readdirSync(srcDir).filter((file) => /^v\d+\.ts$/.test(file));
  if (files.length === 0) return 'v1.ts';
  const latestVersion = Math.max(...files.map((file) => {
    const versionMatch = file.match(/^v(\d+)\.ts$/);
    return versionMatch ? parseInt(versionMatch[1], 10) : 0;
  }));
  return `v${latestVersion + 1}.ts`;
}


export function getLatestVersionFile(): string | null {
  const files = readdirSync(srcDir).filter((file) => /^v\d+\.ts$/.test(file));
  if (files.length === 0) return null;
  const latestVersion = Math.max(...files.map((file) => {
    const versionMatch = file.match(/^v(\d+)\.ts$/);
    return versionMatch ? parseInt(versionMatch[1], 10) : 0;
  }));
  return `v${latestVersion}.ts`;
}