import { readFileSync } from 'node:fs';

/**
   * @test reads from the test input file. Defaults to false.
   * @id selects a specific number test input file. Defaults to 0.
   * @excludeHeader removes provided number of  header lines from input. Default 0.
   * @separator string used to separate chunks of input. Default to '\r\n'
   */
export interface InputReadOptions {
  test?: boolean;
  id?: number;
  excludeHeader?: number;
  separator?: string;
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

export function getInputAsLines(day: number, options?: InputReadOptions): string[] {
  return getInputAsChunks(day, {
    ...options,
    separator: '\r\n',
  });
}

export function getInputAsChunks(day: number, options?: InputReadOptions): string[] {
  let input = readInput(day, options);

  if (options?.excludeHeader) {
    let newLineIndex = 0;
    for (let i = 0; i < options.excludeHeader; i++) {
      newLineIndex = input.indexOf('\r\n', newLineIndex) + 2;
    }
    input = input.slice(newLineIndex);
  }

  const chunks = input.split(options?.separator ? options.separator : '\r\n');
  return chunks;
}
