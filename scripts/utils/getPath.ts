import {resolve} from 'path'
import {getRootDir} from './getRootDir.ts'

export function getPath(relativePath: string): string {
  if (typeof relativePath !== 'string') {
    throw new Error('Relative path must be a string')
  }
  return resolve(getRootDir(), relativePath);
}