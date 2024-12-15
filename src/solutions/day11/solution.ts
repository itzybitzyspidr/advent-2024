import { getInputAsString } from "../../helpers/read-inputs"

export function y2024d11p1(blinks?: number): number {
  const input = getInputAsString(11);
  let stoneMap = buildStones(input);
  const BLINKS = blinks || 25;
  for (let i = 0; i < BLINKS; i++) {
    stoneMap = updateStones(stoneMap);
  }

  let total = 0;
  for (const count of stoneMap.values()) {
    total += count;
  }

  return total;
}

export function y2024d11p2(): number {
  return y2024d11p1(75);
}

function buildStones(input: string): Map<number, number> {
  const stoneMap = new Map<number, number>();
  for (const strval of input.split(' ')) {
    const stoneCount = stoneMap.get(+strval) || 0;
    stoneMap.set(+strval, stoneCount + 1);
  }
  return stoneMap;
}

function updateStones(stoneMap: Map<number, number>): Map<number, number> {
  const newStoneMap = new Map<number, number>();
  for (const [stoneVal, stoneCount] of stoneMap.entries()) {
    if (stoneVal === 0) {
      const existing = newStoneMap.get(1) || 0;
      newStoneMap.set(1, existing + stoneCount);
    } else if (!(stoneVal.toString().length % 2)) {
      const strStoneVal = stoneVal.toString();
      const [left, right] = [+strStoneVal.slice(0, strStoneVal.length / 2), +strStoneVal.slice(strStoneVal.length / 2)];
      const leftCount = newStoneMap.get(left) || 0;
      newStoneMap.set(left, leftCount + stoneCount);
      const rightCount = newStoneMap.get(right) || 0;
      newStoneMap.set(right, rightCount + stoneCount);
    } else {
      const newVal = stoneVal * 2024;
      const existing = newStoneMap.get(newVal) || 0;
      newStoneMap.set(newVal, existing + stoneCount);
    }
  }

  return newStoneMap;
}
