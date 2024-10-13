import type {Algorithm} from './model/algorithm.ts'
import {readFileSync} from 'fs';
import {createHash} from 'crypto';
import {basename, extname} from 'path';

export function getAlgorithmInfo(fullPath: string): Algorithm {
  const content = readFileSync(fullPath);
  return {
    fileName: basename(fullPath, extname(fullPath)),
    fullPath,
    content: content,
    sha: createHash('sha256').update(content).digest('hex')
  }
}