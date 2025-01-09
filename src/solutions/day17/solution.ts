import { getInputAsLines } from "../../helpers/read-inputs";

interface IProgramState {
  registerA: number;
  registerB: number;
  registerC: number;
  instructions: number[];
  pointer: number;
  output: number[];
}

interface IOperation {
  instructionCode: number;
  operand: number;
  end?: boolean;
}

export function y2024d17p1(): string {
  const input = getInputAsLines(17).body;
  
  const program = initializeProgram(input);

  let operation = readOperation(program);
  while (!operation.end) {
    runOperation(program, operation);
    operation = readOperation(program);
  }
  console.log(program);
  return program.output.join(',');
}

export function y2024d17p2(): number {
  const input = getInputAsLines(17).body;

  const testProgram = initializeProgram(input);
  let solution = Math.pow(8,15);
  let power = 15;
  while (power >= 0) {
    const program = initializeProgram(input, solution);
    let operation = readOperation(program);
    while (!operation.end) {
      runOperation(program, operation);
      operation = readOperation(program);
    }
    if (solution === Math.pow(8,15)) {
      console.log(`===INITIAL===`);
      console.log(`Out: ${program.output}`);
      console.log(`Ins: ${program.instructions}`);
    } else {
      console.log(`Out: ${program.output}`);
      console.log(`Ins: ${program.instructions}`);
      console.log('');
    }

    if (outputMatchesInstructions(program)) {
      console.log(program);
      return solution;
    }

    // Check nth last digit of output.
    if (program.output[power] === program.instructions[power]) {
      console.log(`Matched ${power}. ${program.output[power]} === ${program.instructions[power]}`);
      console.log(`Out: ${program.output}`);
      console.log(`Ins: ${program.instructions}`);
      power--;
    } else {
      solution += Math.ceil(Math.pow(8, power - 2));
      console.log(`===ADDED 8 ** ${power - 2}===`);
    }
  }
  throw new Error(`Never got there chief.`);
}

function initializeProgram(input: string[], part2?: number): IProgramState {
  const program: IProgramState = {
    registerA: part2 || +input[0].split(': ')[1],
    registerB: +input[1].split(': ')[1],
    registerC: +input[2].split(': ')[1],
    instructions: input[4].split(': ')[1].split(',').map((v) => +v),
    pointer: 0,
    output: [],
  }

  return program;
}

// Fetch operation and increment pointer
function readOperation(program: IProgramState): IOperation {
  if (program.pointer > program.instructions.length - 2) {
    return {
      instructionCode: 0,
      operand: 0,
      end: true,
    };
  }

  const operation: IOperation = {
    instructionCode: program.instructions[program.pointer],
    operand: program.instructions[program.pointer + 1],
  }

  program.pointer += 2;

  return operation;
}
/**
  * 0 - adv - Division - Numerator is Register A. Denominator is 2 ^ Combo Operand. Truncate to integrater and store in A
  * 1 - bxl - Bitwise XOR - Register B and LITERAL operand. Store in B
  * 2 - bst - Lowest Bits - Combo Operand Mod 8. Store in B
  * 3 - jnz - Jump != 0 - Nothing if A === 0. Otherwise, set instruction pointer to Literal operand. If Jump, do not increase by 2 after operation.
  * 4 - bxc - Bitwise XOR - Register B and C. Store in B. Read but ignore Operand.
  * 5 - out - OUTPUT - Combo operand Mod 8. 'output' value. CSV.
  * 6 - bdv - Division - Numerator is Register A. Denominator is 2 ^ Combo Operand. Truncate to integrater and store in B
  * 7 - cdv - Division - Numerator is Register A. Denominator is 2 ^ Combo Operand. Truncate to integrater and store in C
 */

function runOperation(program: IProgramState, operation: IOperation): void {
  switch (operation.instructionCode) {
    case 0:
      program.registerA = Math.floor(program.registerA / Math.pow(2, getComboOperand(operation.operand, program)));
      break;
    case 1:
      program.registerB = Number(BigInt(program.registerB) ^ BigInt(operation.operand));
      break;
    case 2:
      program.registerB = getComboOperand(operation.operand, program) % 8;
      break;
    case 3:
      if (program.registerA !== 0) {
        program.pointer = operation.operand;
      }
      break;
    case 4:
      program.registerB = Number(BigInt(program.registerB) ^ BigInt(program.registerC));
      break;
    case 5:
      program.output.push(getComboOperand(operation.operand, program) % 8);
      break;    
    case 6:
      program.registerB = Math.floor(program.registerA / Math.pow(2, getComboOperand(operation.operand, program)));
      break;
    case 7:
      program.registerC = Math.floor(program.registerA / Math.pow(2, getComboOperand(operation.operand, program)));
      break;
    default:
      throw new Error(`Encountered invalid instruction: ${operation.instructionCode}.`);
  }
}

/**
  * Combo Operands are:
  *  0-3 literals
  *  4 Register A
  *  5 Register B
  *  6 Regicer C
  *  7 Reserved. Does not appear in valid programs
 */

function getComboOperand(operand: number, program: IProgramState): number {
  switch (operand) {
    case 0:
    case 1:
    case 2:
    case 3:
      return operand;
    case 4:
      return program.registerA;
    case 5:
      return program.registerB;
    case 6:
        return program.registerC;
    default:
      throw new Error(`Encountered unexpected combo operand: ${operand}.`);
  }
}

function outputMatchesInstructions(program: IProgramState): boolean {
  if (program.instructions.length !== program.output.length) {
    return false;
  }

  for (let i = 0; i < program.instructions.length; i++) {
    if (program.output[i] !== program.instructions[i]) {
      return false;
    }
  }
  return true;
}
