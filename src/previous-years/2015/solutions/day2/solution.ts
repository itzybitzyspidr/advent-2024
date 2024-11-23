import { sortBy } from "../../../../helpers/algorithms";
import { getInputAsLines } from "../../../../helpers/read-inputs";

export function d2p1(): number {
  const lines = getInputAsLines(2).body;
  const dimsList: number[][] = lines.map((line) => line.trim().split('x').map((value) => +value));

  let total = 0;

  for (const dims of dimsList) {
    const sortedDims = sortBy(dims);
    total += 3 * sortedDims[0] * sortedDims[1];
    total += 2 * sortedDims[0] * sortedDims[2];
    total += 2 * sortedDims[1] * sortedDims[2];
  }

  return total;
}

export function d2p2(): number {
  const lines = getInputAsLines(2, { lineEnding: '\n' }).body;
  const dimsList: number[][] = lines.map((line) => line.trim().split('x').map((value) => +value));

  let total = 0;
  for (const dims of dimsList) {
    const sortedDims = sortBy(dims);
    total += 2 * sortedDims[0] + 2 * sortedDims[1];
    total += sortedDims[0] * sortedDims[1] * sortedDims[2];
  }

  return total;
}
