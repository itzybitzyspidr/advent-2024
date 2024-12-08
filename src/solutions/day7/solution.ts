import { getInputAsLines } from "../../helpers/read-inputs";

interface ITest {
  target: number;
  elements: number[];
}

export function y2024d7p2(): number {
  const lines = getInputAsLines(7).body;

  const tests: ITest[] = lines.map((line) => {
    const [target, elements] = line.split(': ');
    return {
      target: +target,
      elements: elements.split(' ').map((v) => +v),
    };
  });

  let total = 0;
  for (const test of tests) {
    total += isValidTest(test) ? test.target : 0;
  }

  return total;
}

function isValidTest(test: ITest): boolean {
  let operators = new Array<string>(test.elements.length - 1).fill('+');

  while (true) {
    if (testOperators(test, operators)) {
      return true;
    }
    if (!operators.includes('+') && !operators.includes('*')) {
      return false;
    }
    operators = updateOperators(operators);
  }
}

function testOperators(test: ITest, operators: string[]): boolean {
  let total = test.elements[0];
  for (let i = 1; i < test.elements.length; i++) {
    if (operators[i - 1] === '+') {
      total += test.elements[i];
    } else if (operators[i - 1] === '*') {
      total *= test.elements[i];
    } else {
      total =  +(total.toString() + test.elements[i].toString());
    }
  }
  return total === test.target;
}

export function updateOperators(operators: string[]): string[] {
  const l = operators.length;

  // Convert operators to a number. Increment. Convert back to array of ['*', '+']
  const numOperators = parseInt(operators.map((ch) => {
    return ch === '+' ? 0 : ch === '*' ? 1 : 2;
  }).join(''), 3) + 1;

  const binOperators = numOperators.toString(3);
  const res = binOperators.split('').map((ch) => ch === '0' ? '+' : ch === '1' ? '*' : '||');
  while (res.length < l) {
    res.unshift('+');
  }

  return res;
}
