export interface IMathOptions {
  compareProp?: string;
}

export function getPairDistance(number1: number, number2: number): number {
  return Math.abs(number1 - number2);
}

export function countSpecific<T>(input: T[], target: any, options?: IMathOptions): number {
  if (typeof input[0] === typeof target) {
    for (const v of input) {
      if (typeof v !== typeof target) {
        throw new Error(`Multiple different types detected in array: ${input}.`);
      }
    }
    return input.reduce((prev, cur) => prev += cur === target ? 1 : 0, 0);
  }

  let values: any[] = [];
  if (input[0] instanceof Object) {
    if (!options || !options.compareProp) {
      throw new Error('Property to sort by not provided for object.');
    }

    const props = Object.keys(input[0]);
    if (!props.includes(options.compareProp)) {
      throw new Error(`Property provided: '${options.compareProp}' was not found on object.`);
    }

    values = input.map((ob) => {
      const v = ob[options.compareProp as keyof T];
      if (typeof v === typeof target) {
        return v;
      }
      throw new Error(`Type of ${ob[options.compareProp as keyof T]}: ${typeof options.compareProp} does not match type of ${target}: ${typeof target}.`);
    });
  }

  return values.reduce((prev, cur) => prev += cur === target ? 1 : 0, 0);
}
