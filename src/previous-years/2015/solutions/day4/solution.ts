import { getInputAsString } from "../../../../helpers/read-inputs";
import { createHash } from 'node:crypto';

export function d4p1(): number {
  const inputStr = getInputAsString(4);

  let i = 1;
  while (i < 1e9) {
    const hash = createHash('md5').update(inputStr + i).digest('hex');
    if (checkHash(hash, '000000')) {
      return i;
    }
    i++;
  }

  throw new Error('lol');
}

function checkHash(hash: string, compareStr: string): boolean {
  return hash.slice(0, compareStr.length) === compareStr;
}
