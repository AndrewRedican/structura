import {fileURLToPath} from 'url';
import {resolve} from 'path'

export function getRootDir(): string {
  return resolve(fileURLToPath(import.meta.url), '../../../')
}