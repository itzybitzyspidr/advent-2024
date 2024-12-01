export interface IMatchSearchOptions {
  /**
   * If set, getMatches will validate the number of found results and throw if the resulting array length differs.
   */
  expectedResultLength?: number;
}

export function getMatches(input: string, regEx: RegExp, options?: IMatchSearchOptions): RegExpMatchArray {
  const matches = input.match(regEx);

  if (!matches) {
    throw new Error(`Null result for match on '${input}' with '${regEx}'.`);
  }

  if (options && options.expectedResultLength !== undefined) {
    if (matches.length !== options.expectedResultLength) {
      throw new Error(`Expected ${options.expectedResultLength} matches, but found ${matches.length}: ${matches}`);
    }
  }

  return matches
}
