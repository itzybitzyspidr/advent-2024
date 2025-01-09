import { getInputAsLines } from "../../helpers/read-inputs";

export function y2024d19p1(): number {
  const input = getInputAsLines(19, {
    headerLength: 1,
  });

  const options = input.header[0].split(', ');
  const requirements = input.body;

  const guts = '(?:' + options.join('|') + ')+';
  const regex = new RegExp('^' + guts + '$');
  let total = 0;
  console.log(regex);
  for (const towel of requirements) {
    const valid = towel.match(regex);
    if (valid) {
      total++;
    }
  }
  return total;
}

/**
 * Will need to actually solve the problem now. Can use method form part 1 to remove any impossible lines to save time.
 * Remove towels from the front of the arrangement and multiply by subproblems.
 * Cache results for all subproblems
 */
export function y2024d19p2(): number {
  const input = getInputAsLines(19, {
    headerLength: 1,
  });

  const options = input.header[0].split(', ');
  const requirements = input.body;

  // Filter out impossible sequences.
  const guts = '(?:' + options.join('|') + ')+';
  const regex = new RegExp('^' + guts + '$');
  const possibleRequirements = requirements.filter((requirement) => {
    return !!requirement.match(regex);
  });

  // Cache contains the number of possible arrangements for a given string entry that was previously calculated.
  const cache = new Map<string, number>();
  let totalArrangements = 0;
  for (const arrangement of possibleRequirements) {
    totalArrangements += calculatePossibleArrangements(arrangement, options, cache);
  }
  return totalArrangements;
}

function calculatePossibleArrangements(arrangement: string, options: string[], cache: Map<string, number>): number {
  if (arrangement === '') {
    return 1;
  }

  const cachedResult = cache.get(arrangement);
  if (cachedResult) {
    return cachedResult;
  }

  const validNextArrangements = getValidNextArrangements(arrangement, options);
  let subtotal = 0;
  for (const nextArrangement of validNextArrangements) {
    subtotal += calculatePossibleArrangements(nextArrangement, options, cache);
  }
  cache.set(arrangement, subtotal);
  return subtotal;
}

function getValidNextArrangements(arrangement: string, options: string[]): string[] {
  const arrangements: string[] = [];
  for (const option of options) {
    if (arrangement.indexOf(option) === 0) {
      arrangements.push(arrangement.slice(option.length));
    }
  }

  return arrangements;
}
