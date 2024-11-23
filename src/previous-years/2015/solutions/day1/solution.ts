import { getInputAsString } from "../../../../helpers/read-inputs";

export function d1p1(): number {
  const readOutput = getInputAsString(1, { headerLength: 0 });
  const inputArr = readOutput.split('');
  return inputArr.filter((char) => char === '(').length - inputArr.filter((char) => char === ')').length;
}

export function d1p2(): number {
  const readOutput = getInputAsString(1, { headerLength: 0 });
  let floor = 0;
  for (const [index, char] of readOutput.split('').entries()) {
    if (char === '(') {
      floor++;
    } else {
      floor--;
      if (floor < 0) {
        return index + 1;
      }
    }
  }
  return -1;
}
