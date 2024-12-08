import { getInputAsLines } from "../../helpers/read-inputs";

export function y2024d4p1(): number {
  const input = getInputAsLines(4).body;
  const grid = input.map((line) => line.split('').map((v) => v));

  let total = 0;
  for (const [y, row] of grid.entries()) {
    for (const [x, char] of row.entries()) {
      if (char === 'X') {
        total += lookAround(x, y, grid);
      }
    }
  }
  return total;
}

function lookAround(x: number, y: number, grid: string[][]): number {
  let total = 0;
  for (let xdir = -1; xdir < 2; xdir++) {
    for (let ydir = -1; ydir < 2; ydir++) {
      let valid = true;
      const expected = ['X', 'M', 'A', 'S'];
      for (const [dist, char] of expected.entries()) {
        if (y + ydir * dist < 0 ||
          y + ydir * dist >= grid.length ||
          x + xdir * dist < 0 ||
          x + xdir * dist >= grid[0].length ||
          grid[y + ydir * dist][x + xdir * dist] !== char) {

          valid = false;
          break;
        }
      }
    if (valid) {
      total++;
    }
    }
  }
  return total;
}

export function y2024d4p2(): number {
  const input = getInputAsLines(4).body;
  const grid = input.map((line) => line.split('').map((v) => v));

  let total = 0;
  for (let y = 1; y < grid.length - 1; y++) {
    for (let x = 1; x < grid[0].length - 1; x++) {
      if (grid[y][x] === 'A') {
        total += isXmas(x, y, grid) ? 1 : 0;
      }
    }
  }

  return total;
}

function isXmas(x: number, y: number, grid: string[][]): boolean {
  return isMas(grid[y - 1][x - 1], grid[y + 1][x + 1]) && isMas(grid[y + 1][x - 1], grid[y - 1][x + 1]);
}

function isMas(a: string, b: string): boolean {
  if (a === 'S') {
    return b === 'M';
  } else if (a === 'M') {
    return b === 'S';
  }
  return false;
}
