import { sortBy } from "../../helpers/algorithms";
import { countEntries } from "../../helpers/mappers";
import { getPairDistance } from "../../helpers/math";
import { getInputAsLines } from "../../helpers/read-inputs";
import { getMatches } from "../../helpers/search";


export function y2024d1p1(): number {
  const lines = getInputAsLines(1).body;
  const regEx = /[\d]+/g;
  const matches = lines.map((line) => getMatches(line, regEx, { expectedResultLength: 2 }));

  const [left, right] = [matches.map((arr) => arr[0]), matches.map((arr) => arr[1])];

  const sortedPairs: number[][] = sortBy(left.map((v) => +v)).map((v, i) => {
    return [+v, sortBy(right.map((v) => +v))[i]];
  });

  return sortedPairs.reduce((prev, cur) => prev += getPairDistance(cur[0], cur[1]), 0);
} 

export function y2024d1p2(): number {
  const lines = getInputAsLines(1).body;
  const regEx = /[\d]+/g;
  const matches = lines.map((line) => getMatches(line, regEx, { expectedResultLength: 2 }));

  const [left, right] = [matches.map((arr) => arr[0]), matches.map((arr) => arr[1])];

  const leftCounts = countEntries(left);
  const rightCounts = countEntries(right);

  let totalSimilarity = 0;
  for (const [key, count] of leftCounts.entries()) {
    const rightCount = rightCounts.get(key);
    if (rightCount) {
      totalSimilarity += count * +key * rightCount;
    }
  }

  return totalSimilarity;
}
