export function getPairDistance(number1: number, number2: number): number {
  return Math.abs(number1 - number2);
}

// Todo - Include support for objects and nested comparisons
export function countSpecific<T>(input: T[], target: T): number {
  return input.reduce((prev, cur) => prev += cur === target ? 1 : 0, 0);
}
