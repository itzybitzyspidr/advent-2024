import { getInputAsLines } from "../../../../helpers/read-inputs";

export function d5p2(): number {
  const lines = getInputAsLines(5).body;
  const REPEATED_TWO_LETTERS_REGEX = /(.{2}).*\1/;
  const GAP_REGEX = /(.)(.)\1/;

  let niceStrings = 0;
  for (const line of lines) {
    if (line.match(GAP_REGEX) && line.match(REPEATED_TWO_LETTERS_REGEX)) {
      niceStrings++;
    };
  }

  return niceStrings;
}
