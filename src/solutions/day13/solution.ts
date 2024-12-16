import { getInputAsChunks } from "../../helpers/read-inputs";

interface IClawMachine {
  Ax: number;
  Ay: number;
  Bx: number;
  By: number;
  Tx: number;
  Ty: number;
}

export function y2024d13p1(offset = 0): number {
  const chunks = getInputAsChunks(13, { separator: '\n\n'}).body;
  const clawMachines = buildClawMachines(chunks, offset);

  let total = 0;
  for (const claw of clawMachines) {
    const coefficients = getCoefficients(claw);
    if (coefficients[0] === Math.floor(coefficients[0]) && coefficients[1] === Math.floor(coefficients[1])) {
      total += coefficients[0] * 3 + coefficients[1]; 
    }
  }

  return total;
}

export function y2024d13p2(): number {
  return y2024d13p1(10e12);
}

function buildClawMachines(chunks: string[], offset: number): IClawMachine[] {
  return chunks.map((chunk) => {
    const aMatches = chunk.match(/A: X\+([\d]+), Y\+([\d]+)/);
    const bMatches = chunk.match(/B: X\+([\d]+), Y\+([\d]+)/);
    const tMatches = chunk.match(/Prize: X\=([\d]+), Y\=([\d]+)/)
    if (!aMatches || !bMatches || !tMatches) {
      throw new Error(`Couldn't read input for ${chunk}.`);
    }

    return {
      Ax: +aMatches[1],
      Ay: +aMatches[2],
      Bx: +bMatches[1],
      By: +bMatches[2],
      Tx: offset + +tMatches[1],
      Ty: offset + +tMatches[2],
    };
  });
}

function getCoefficients(claw: IClawMachine): number[] {
  const coeffB = (claw.Ay * claw.Tx - claw.Ty * claw.Ax) / (claw.Bx * claw.Ay - claw.Ax * claw.By);
  const coeffA = (claw.Ty - coeffB * claw.By) / claw.Ay;

  return [coeffA, coeffB];
}
