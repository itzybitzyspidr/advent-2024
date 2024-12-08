import { getInputAsString } from "../../helpers/read-inputs";
import { getMatches } from "../../helpers/search";

export function y2024d3p1(): number {
  const input = getInputAsString(3);
  const muls = getMatches(input, /mul\([\d]{1,3},[\d]{1,3}\)/g);
  let tot = 0;
  for (const mul of muls) {
    const [l, r] = getMatches(mul, /[\d]+/g);
    tot += +l * +r;
  }
  return tot;
}

export function y2024d3p2(): number {
  const input = getInputAsString(3);
  const doRegex = /do\(\)/;
  const mulOrDontRegex = /don\'t\(\)|mul\([\d]{1,3},[\d]{1,3}\)/;

  let idx = 0;
  let enabled = true;
  let tot = 0;
  while (idx < input.length) {
    if (enabled) {
      const nextInstruction = mulOrDontRegex.exec(input.slice(idx));

      if (!nextInstruction) {
        return tot;
      }

      if (nextInstruction[0].includes('mul')) {
        const [l, r] = getMatches(nextInstruction[0], /[\d]+/g);
        tot += +l * +r;
      } else {
        enabled = !enabled;
      }
      idx += nextInstruction.index + 1;
    } else  {
      const nextInstruction = doRegex.exec(input.slice(idx));
      if (!nextInstruction) {
        return tot;
      }

      enabled = !enabled;
      idx += nextInstruction.index + 1;
    }
  }
  return tot;
}
