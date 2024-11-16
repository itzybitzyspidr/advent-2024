export interface ISortOptions {
  dir?: 'asc' | 'desc';
  compareProp?: string;
}

/**
 * Returns the index of a number from a sorted list. Returns -1 if number not in list.
 * @param nums array to search
 * @param target value of target
 */
export function binarySearch(nums: number[], target: number): number {
  if (!isSorted(nums)) {
    throw new Error('Array is not sorted');
  }

  let lb = 0;
  let ub = nums.length - 1;

  while (lb !== ub) {
  const mp = Math.floor((ub - lb) / 2) + lb;
    if (nums[mp] === target) {
      return mp;
    } else if (nums[mp] < target) {
      lb = mp + 1;
    } else {
      ub = mp;
    }
  }
  return -1;
}

export function isSorted<T>(input: T[], options?: ISortOptions): boolean {
  if (input.length < 2) {
    return true;
  }

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

  if (options && options.dir && options.dir === 'desc') {
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
