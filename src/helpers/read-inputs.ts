import { readFileSync } from 'node:fs';

/**
   * @test reads from the test input file. Defaults to false.
   * @id selects a specific number test input file. Defaults to 0.
   * @headerLenght removes provided number of  header lines from input. Default 0.
   * @separator string used to separate chunks of input. Default to '\r\n'
   */
export interface InputReadOptions {
  test?: boolean;
  id?: number;
  headerLength?: number;
  separator?: string;
}

export interface ReadOutput {
  header: string[],
  body: string[],
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

export function getInputAsLines(day: number, options?: InputReadOptions): ReadOutput {
  return getInputAsChunks(day, {
    ...options,
    separator: '\r\n',
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
      const endOfLineIndex = input.indexOf('\r\n', newLineIndex);
      output.header.push(input.slice(newLineIndex, endOfLineIndex).trim());
      newLineIndex = endOfLineIndex + 2;
    }
    input = input.slice(newLineIndex);
  }

  output.body = input.split(options?.separator ? options.separator : '\r\n');
  return output;
}
