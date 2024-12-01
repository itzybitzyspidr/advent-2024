import { getInputAsLines } from "../../../../helpers/read-inputs";

export function d8p1(): number {
  const lines = getInputAsLines(8).body;

  let inCode = 0;
  let inMemory = 0;
  for (const line of lines) {
    const singleMatches = line.match(/\\(x[a-f0-9]{2}|"|\\)/g);

    const delta = calculateExtras(singleMatches);
    inMemory += line.length + 4 + delta;
    inCode += line.length;
  } 

  return inMemory - inCode;
}

function calculateExtras(inputArray: RegExpMatchArray | null): number {
  if (!inputArray) {
    return 0;
  }

  let total = 0;
  for (const input of inputArray) {
    if (input.includes('x')) {
      total += 1;
    } else {
      total += 2;
    }
  }
  return total;
}
