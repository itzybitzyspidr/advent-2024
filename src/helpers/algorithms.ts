export interface IHelperOptions {
  /**
   * Specified sort direction of list. Defaults to ascending
   */
  dir?: 'asc' | 'desc';
  /**
   * The property of provided object to be compared.
   */
  compareProp?: string;
}

/**
 * Returns the index of a number from a sorted list. Returns -1 if number not in list.
 * @param list array to search
 * @param target value of target
 * @returns Index of target number, or -1 if not present.
 */
export function binarySearch<T>(list: T[], target: number, options?: IHelperOptions): number {
  if (!isSorted(list, options)) {
    throw new Error('Array is not sorted');
  }

  const comparablePropertyList = mapComparableProperty(list, options);
  if (options?.dir === 'desc') {
    return binSearchDescending(comparablePropertyList, target);
  }
  return binSearchAscending(comparablePropertyList, target);
}

function binSearchAscending(list: number[], target: number): number {
  let lb = 0;
  let ub = list.length - 1;
  while (lb !== ub) {
  const mp = Math.floor((ub - lb) / 2) + lb;
    if (list[mp] === target) {
      return mp;
    } else if (list[mp] < target) {
      lb = mp + 1;
    } else {
      ub = mp;
    }
  }
  return -1;
}

function binSearchDescending(list: number[], target: number): number {
  let lb = 0;
  let ub = list.length - 1;
  while (lb !== ub) {
  const mp = Math.floor((ub - lb) / 2) + lb;
    if (list[mp] === target) {
      return mp;
    } else if (list[mp] > target) {
      lb = mp + 1;
    } else {
      ub = mp;
    }
  }
  return -1;
}

/**
 * Checks if an array is sorted based on some property.
 * @param input Array of numbers or objects with numeric property
 * @param options Set of IHelperOptions specified for comparison
 * @returns True or false based on if array meets sorting conditions
 */
export function isSorted<T>(input: T[], options?: IHelperOptions): boolean {
  if (input.length < 2) {
    return true;
  }

  const nums = mapComparableProperty(input, options);

  if (options?.dir === 'desc') {
    for (let i = 0; i < nums.length - 1; i++) {
      if (nums[i] <= nums[i + 1]) {
        return false;
      }
    }
  } else {
    for (let i = 0; i < nums.length - 1; i++) {
      if (nums[i] >= nums[i + 1]) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Extracts specified parameter from an object for comparrison or search.
 * @param input Array of numbers or objects to be compared.
 * @param options List of IHelperOptions to describe how list should be interrogated.
 * @returns List of numbers for comparrison or search.
 */
function mapComparableProperty<T>(input: T[], options?: IHelperOptions): number[] {
  let nums: number[] = [];

  if (typeof input[0] === 'number') {
    nums = input.map((v) => +v);
  }

  if (input[0] instanceof Object) {
    if (!options || !options.compareProp) {
      throw new Error('Property to sort by not provided for object.');
    }

    const props = Object.keys(input[0]);
    if (!props.includes(options.compareProp)) {
      throw new Error(`Property provided: ${options.compareProp} was not found on object.`);
    }

    nums = input.map((ob) => {
      const v = ob[options.compareProp as keyof T];
      if (typeof v === 'number') {
        return v;
      }
      throw new Error(`Value of ${ob[options.compareProp as keyof T]} is not a number.`);
    });
  }
  return nums;
}

/**
 * Sorts a list by some numerical property. If no options are provided, attempts to sort as list of numbers.
 * @param input List of numbers / objects to be sorted.
 * @param options List of IHelperOptions to define how list should be sorted.
 * @returns New list of sorted numbers / objects.
 */
export function sortBy<T>(input: T[], options?: IHelperOptions): T[] {
  if (typeof input[0] === 'number') {
    if (options?.dir === 'desc') {
      return input.slice().sort((a, b) => +b - +a);
    }
    return input.slice().sort((a, b) => +a - +b);
  }

  if (!options?.compareProp) {
    throw new Error('No compareProp provided for sorting.');
  }

  if (options.dir === 'desc') {
    return input.slice().sort((a, b) => {
      return +b[options.compareProp as keyof T] - +a[options.compareProp as keyof T];
    });
  }

  return input.slice().sort((a, b) => {
    return +a[options.compareProp as keyof T] - +b[options.compareProp as keyof T];
  });
}
