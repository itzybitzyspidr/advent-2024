import { getInputAsLines } from "../../../../helpers/read-inputs";

interface IRange {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
}

interface ILightInstruction {
  range: IRange;
  instruction: 'turn on' | 'toggle' | 'turn off';
}

export function d6p1(): number {
  const lines = getInputAsLines(6).body;

  const lightMap = new Map<string, number>();
  for (let x = 0; x < 1000; x++) {
    for (let y = 0; y < 1000; y++) {
      lightMap.set(`${x}-${y}`, 0);
    }
  }
  const instructionsList = interpretLightingInstructions(lines);

  for (const line of instructionsList) {
    for (let x = line.range.xmin; x <= line.range.xmax; x++) {
      for (let y = line.range.ymin; y <= line.range.ymax; y++) {
        if (line.instruction === 'turn on') {
          turnOn(`${x}-${y}`, lightMap);
        } else if (line.instruction === 'turn off') {
          turnOff(`${x}-${y}`, lightMap);
        } else {
          toggle(`${x}-${y}`, lightMap);
        }
      }
    }
  }

  return countLightsOn(lightMap);
}

function turnOff(lightId: string, lightMap: Map<string, number>): void {
  lightMap.set(lightId, Math.max(lightMap.get(lightId)! - 1, 0));
}

function turnOn(lightId: string, lightMap: Map<string, number>): void {
  lightMap.set(lightId, lightMap.get(lightId)! + 1);
}

function toggle(lightId: string, lightMap: Map<string, number>): void {
  lightMap.set(lightId, lightMap.get(lightId)! + 2);
}

function interpretLightingInstructions(lines: string[]): ILightInstruction[] {
  return lines.map((line) => {
    const instruction = line.match(/turn on|toggle|turn off/);
    const identifiedNumbers = line.match(/\d+/g);

    if (!instruction || !identifiedNumbers || identifiedNumbers.length < 4) {
      throw new Error(`Couldn't create instruction for ${line}.`);
    }

    return {
      instruction: instruction.toString() as 'turn on' | 'toggle' | 'turn off',
      range: {
        xmin: +identifiedNumbers[0],
        ymin: +identifiedNumbers[1],
        xmax: +identifiedNumbers[2],
        ymax: +identifiedNumbers[3],
      },
    };
  });
}

function countLightsOn(lightMap: Map<string, number>): number {
  let total = 0;
  for (const value of lightMap.values()) {
    total += value;
  }
  return total;
}
