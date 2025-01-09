import { readFileSync } from 'node:fs';

/**
   * @test reads from the test input file. Defaults to false.
   * @id selects a specific number test input file. Defaults to 0.
   * @headerLength removes provided number of  header lines from input. Default 0.
   * @separator string used to separate chunks of input. Default to '\n'.
   * @lineEnding used to split newlines without using '\n'.
   */
export interface InputReadOptions {
  test?: boolean;
  id?: number;
  headerLength?: number;
  separator?: string;
  lineEnding?: string;
}

export interface ReadOutput {
  header: string[];
  body: string[];
}

export interface ReadOutputGrid {
  header: string[];
  body: string[][];
}

function readInput(day: number, options?: InputReadOptions): string {
  let path = `src/inputs/day${day}/`;

  if (options?.test) {
    options.id = options.id ?? 0;
    path += `test-${options.id}.txt`;
  } else {
    path += `raw.txt`;
  }

  return readFileSync(path).toString().trim();
}

export function getInputAsString(day: number, options?: InputReadOptions): string {
  const readOutput = getInputAsChunks(day, {
    ...options,
    separator: 'THISISASEPARATORTHATWONTCOMEUP',
  });
  return readOutput.body[0];
}

export function getInputAsLines(day: number, options?: InputReadOptions): ReadOutput {
  return getInputAsChunks(day, {
    ...options,
    separator: options?.lineEnding ?? '\n',
  });
}

export function getInputAsChunks(day: number, options?: InputReadOptions): ReadOutput {
  let input = readInput(day, options);

  const output: ReadOutput = {
    header: [],
    body: [],
  };

  if (options?.headerLength) {
    let newLineIndex = 0;
    for (let i = 0; i < options.headerLength; i++) {
      const endOfLineIndex = input.indexOf('\n', newLineIndex);
      output.header.push(input.slice(newLineIndex, endOfLineIndex).trim());
      newLineIndex = endOfLineIndex + 2;
    }
    input = input.slice(newLineIndex);
  }

  output.body = input.split(options?.separator ? options.separator : '\n');
  return output;
}

export function getInputAsGrid(day: number, options?: InputReadOptions): ReadOutputGrid {
  const readOutput = getInputAsLines(day, options);
  const res: ReadOutputGrid = {
    header: readOutput.header,
    body: readOutput.body.map((line) => line.split('')),
  }

  return res;
}
