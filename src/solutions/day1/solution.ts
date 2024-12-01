import { sortBy } from "../../helpers/algorithms";
import { getInputAsLines } from "../../helpers/read-inputs";

export function y2024d1p1(): number {
  const lines = getInputAsLines(1).body;
  const left: number[] = [];
  const right: number[] = [];
  for (const line of lines) {
    const matches = line.match(/[\d]+/g);
    if (!matches || matches.length < 2) {
      throw new Error(`Couldn't read 2 inputs from line: ${line}.`);
    }
    left.push(+matches[0]);
    right.push(+matches[1]);
  }

  const sortedLeft = sortBy(left);
  const sortedRight = sortBy(right);

  if (sortedLeft.length !== sortedRight.length) {
    throw new Error(`Left list length: ${sortedLeft.length} was different from Right list length: ${sortedRight.length}.`);
  }

  let totalDistance = 0;
  for (let i = 0; i < sortedLeft.length; i++) {
    totalDistance += Math.abs(sortedLeft[i] - sortedRight[i]);
  }

  return totalDistance;
} 

export function y2024d1p2(): number {
  const lines = getInputAsLines(1).body;

  const leftCounts = new Map<number, number>();
  const rightCounts = new Map<number, number>();

  for (const line of lines) {
    const matches = line.match(/[\d]+/g);
    if (!matches || matches.length < 2) {
      throw new Error(`Couldn't read 2 inputs from line: ${line}.`);
    }
    const leftCount =  leftCounts.get(+matches[0]) || 0;
    leftCounts.set(+matches[0], leftCount + 1);

    const rightCount =  rightCounts.get(+matches[1]) || 0;
    rightCounts.set(+matches[1], rightCount + 1);
  }

  console.log(rightCounts);

  let totalSimilarity = 0;
  for (const [key, count] of leftCounts.entries()) {
    const rightCount = rightCounts.get(key);
    if (rightCount) {
      totalSimilarity += count * key * rightCount;
    }
  }

  return totalSimilarity;
}
