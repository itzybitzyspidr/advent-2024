import { createWriteStream } from 'node:fs';
import { getInputAsLines } from "../../helpers/read-inputs";

interface IRobot {
  x0: number;
  y0: number;
  dx: number;
  dy: number;
}

export async function y2024d14p1(): Promise<number> {
  const input = getInputAsLines(14).body;
  const robots: IRobot[] = input.map((line) => {
    const matches = line.match(/-?[\d]+/g);
    if (!matches || matches.length < 4) {
      throw new Error(`Couldn't process robots for line: ${line}.`);
    }
    return {
      x0: +matches[0],
      y0: +matches[1],
      dx: +matches[2],
      dy: +matches[3],
    };
  });

  const WIDTH = 101;
  const HEIGHT = 103;
  // const TIME = 100;
  const safetyRatings: number[] = [];

  for (let time = 0; time < WIDTH * HEIGHT; time++) {
    const quadrantCounts = [0, 0, 0, 0];
    for (const robot of robots) {
      const x = positiveMod(robot.x0 + time * robot.dx, WIDTH);
      const y = positiveMod(robot.y0 + time * robot.dy, HEIGHT);
      if (x !== Math.floor(WIDTH / 2) && y !== Math.floor(HEIGHT / 2)) {
        quadrantCounts[getQuadrant(x, y, WIDTH, HEIGHT)]++;
      }
    }
    safetyRatings.push(quadrantCounts.reduce((prev, cur) => prev *= cur, 1));
  }

  const min = Math.min(...safetyRatings);
  const minIdx = safetyRatings.findIndex((el) => el === min);
  await writeTree(robots, WIDTH, HEIGHT, minIdx);
  return minIdx;
  // return quadrantCounts.reduce((prev, cur) => prev *= cur, 1);
}

function positiveMod(num: number, quotient: number): number {
  return (num % quotient + quotient) % quotient;
}

function getQuadrant(x: number, y: number, W: number, H: number): number {
  return (x < Math.floor(W / 2) ? 0 : 1) + (y < Math.floor(H / 2) ? 0 : 2);
}

async function writeTree(robots: IRobot[], W: number, H: number, idx: number): Promise<void> {
  const grid: string[][] = [];
  for (let i = 0; i < H; i++) {
    grid.push(new Array<string>(W).fill('.'));
  }

  for (const robot of robots) {
    const x = positiveMod(robot.x0 + idx * robot.dx, W);
    const y = positiveMod(robot.y0 + idx * robot.dy, H);

    grid[y][x] = 'X';
  }

  const f = createWriteStream(`./src/outputs/day14/tree-${idx}.txt`);
  for (const line of grid) {
    for (const char of line) {
      f.write(char);
    }
    f.write('\n');
  }

  f.end();
  await new Promise(resolve => f.on("close", resolve));
  return;
}
