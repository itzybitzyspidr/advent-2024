import { getInputAsChunks } from "../../helpers/read-inputs";

export function y2024d5p1(): number {
  const body = getInputAsChunks(5, {separator: '\n\n'}).body;
  const rules = body[0].split('\n').map((rule) => {
    return rule.split('|').map((v) => +v);
  });
  const updates = body[1].split('\n').map((update) => {
    return update.split(',').map((v) => +v);
  });

  const orderMap = buildOrderMap(rules);

  let total = 0;
  for (const update of updates) {
    if (isOrdered(orderMap, update)) {
      total += update[Math.floor(update.length / 2)];
    }
  }
  return total;
}

export function y2024d5p2(): number {
  const time = Date.now();
  const body = getInputAsChunks(5, {separator: '\n\n'}).body;
  const rules = body[0].split('\n').map((rule) => {
    return rule.split('|').map((v) => +v);
  });
  const updates = body[1].split('\n').map((update) => {
    return update.split(',').map((v) => +v);
  });

  const orderMap = buildOrderMap(rules);

  let total = 0;
  for (const [i, update] of updates.entries()) {
    console.log(`${i + 1} of ${updates.length}`);
    if (!isOrdered(orderMap, update)) {
      let newUpdate = update.slice()
      while (!isOrdered(orderMap, newUpdate)) {
        const badPair = findBadPair(orderMap, newUpdate);
        newUpdate = swapPair(badPair[0], badPair[1], newUpdate);
      }
      total += newUpdate[Math.floor(update.length / 2)];
    }
  }
  console.log(Date.now() - time);
  return total;
}

// Builds a map where all values in the set come BEFORE the key.
function buildOrderMap(pairs: number[][]): Map<number, Set<number>> {
  const orderMap = new Map<number, Set<number>>();
  for (const pair of pairs) {
    // const firstNode = orderMap.get(pair[0]) || new Set<number>();
    const secondNode = orderMap.get(pair[1]) || new Set<number>();

    secondNode.add(pair[0]);
    orderMap.set(pair[1], secondNode);
  }

  return orderMap;
}

function isOrdered(orderMap: Map<number, Set<number>>, update: number[]): boolean {
  for (const [idx, num] of update.entries()) {
    const beforeSet = orderMap.get(num);
    if (!beforeSet) {
      continue;
    }
    for (const remaining of update.slice(idx)) {
      if (beforeSet.has(remaining)) {
        // console.log(`${update} failed because ${num} came before ${remaining}`);
        return false;
      }
    }
  }
  return true;
}

function findBadPair(orderMap: Map<number, Set<number>>, update: number[]): number[] {
  for (const [idx, num] of update.entries()) {
    const beforeSet = orderMap.get(num);
    if (!beforeSet) {
      continue;
    }
    for (const [idx2, remaining] of update.slice(idx).entries()) {
      if (beforeSet.has(remaining)) {
        // console.log(`${update} failed because ${num} came before ${remaining}`);
        return [idx, idx + idx2];
      }
    }
  }
  return [];
}

function swapPair(i: number, j: number, nums: number[]): number[] {
  const tmp = nums[i];
  nums[i] = nums[j];
  nums[j] = tmp;
  return nums;
}
