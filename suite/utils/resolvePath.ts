import {getPath} from '../../scripts/utils/getPath.ts';

export function resolvePath(path: string): string {
  path = getPath(path.startsWith('./src') ? path : !path.startsWith('./') ? `./src/${path}` : `./src/${path.slice(2)}`);
  if (path.split('/').pop()?.indexOf('.') === -1) {
    path += '.ts';
  }
  return path
}