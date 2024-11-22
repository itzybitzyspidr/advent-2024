import { binarySearch, isSorted, sortBy } from "../helpers/algorithms";

describe('the binarySearch function', () => {
  const sortedNums = [-12, -3, 0, 5, 12, 14, 15, 16, 20, 500, 650, 1000];
  const unsortedNums = [-12, -3, 0, 5, 12, 14, 15, 16, 500, 20, 650, 1000];
  const sortedDescNums = [1000, 999, 888, 666, 444, 222, 123, 5, -2000];

  it('finds the index of target number if present', () => {
    expect(binarySearch(sortedNums, 12)).toBe(4);
  });

  it('returns -1 if number not present for ascending', () => {
    expect(binarySearch(sortedNums, 7)).toBe(-1);
  });

  it('can search a list sorted in descending order', () => {
    expect(binarySearch(sortedDescNums, 222, { dir: 'desc' })).toBe(5);
  });

  it('returns -1 if number not present for descending', () => {
    expect(binarySearch(sortedDescNums, 0, { dir: 'desc' })).toBe(-1);
  });

  it('throws an error if list is not ordered', () => {
    expect(() => binarySearch(unsortedNums, 0)).toThrow();
  });

  it('can search a list of objects based on a specified property', () => {
    const sortedObjs = [
      { a: 1, pineapple: 'pizza' },
      { a: 3 },
      { a: 10 },
      { a: 100 },
      { a: 101 },
      { a: 1234, b: 0 },
    ];

    expect(binarySearch(sortedObjs, 3,  { compareProp: 'a' })).toBe(1);
  });
});

describe('the isSorted function with array of numbers', () => {
  const ascNums = [-12, -3, 0, 5, 12, 14, 15, 16, 20, 500, 650, 1000];
  const descNums = [1000, 650, 500, 20, 16, 15, 14, 12, 5, 0, -3, -12];
  const unsortedNums = [-12, -3, 0, 5, 12, 14, 15, 16, 500, 20, 650, 1000];

  it('returns true if list is sorted in ascending order when no dir provided', () => {
    expect(isSorted(ascNums)).toBe(true);
  });

  it('returns true if list has fewer than 2 elements', () => {
    expect(isSorted([1])).toBe(true);
    expect(isSorted([])).toBe(true);
  });

  it('returns true if list is sorted in ascending order when dir === asc', () => {
    expect(isSorted(ascNums, { dir: 'asc' })).toBe(true);
  });
  
  it('returns false if list is not in ascending order when no dir provided', () => {
    expect(isSorted(unsortedNums)).toBe(false);
    expect(isSorted(descNums)).toBe(false);
  });

  it('returns true if list is sorted in descending order when dir === desc', () => {
    expect(isSorted(descNums, { dir: 'desc' })).toBe(true);
  });

  it('returns false if list is not in descending order when dir === desc', () => {
    expect(isSorted(unsortedNums, { dir: 'desc' })).toBe(false);
    expect(isSorted(ascNums, { dir: 'desc' })).toBe(false);
  });
});

describe('the isSorted function with array of objects', () => {
  const sortedObjects = [
    { a: -2 },
    { a: 4 },
    { a: 6 },
    { a: 500 },
  ];

  const unsortedObjects = [
    { a: -2 },
    { a: 4 },
    { a: 6 },
    { a: 500 },
    { a: 40 }
  ];

  const nonNumericObjects = [
    { a: 'beans' },
    { a: true },
  ];

  it('returns true when valid property provided for sorted list', () => {
    expect(isSorted(sortedObjects, { compareProp: 'a' })).toBe(true);
  });

  it('returns false when valid property provided for unsorted list', () => {
    expect(isSorted(unsortedObjects, { compareProp: 'a' })).toBe(false);
  });

  it('throws an error if no property provided', () => {
    expect(() => isSorted(sortedObjects)).toThrow();
  });

  it('throws an error if property not found on object', () => {
    expect(() => isSorted(sortedObjects, { compareProp: 'b' })).toThrow();
  });

  it('throws an error if property is not numeric', () => {
    expect(() => isSorted(nonNumericObjects, { compareProp: 'a' })).toThrow();
  });
});

describe('the sortBy function', () => {
  const unsortedNums = [1, 8, 3, 6, 0, -1, 10];
  const unsortedObjs = [
    { a: 1 },
    { a: 15, goat: true },
    { a: -6 },
    { a: 3 },
  ];

  it('sorts an array of numbers ascending', () => {
    expect(sortBy(unsortedNums)).toEqual([-1, 0, 1, 3, 6, 8, 10]);
  });

  it('sorts an array of numbers descending', () => {
    expect(sortBy(unsortedNums, { dir: 'desc' } )).toEqual([10, 8, 6, 3, 1, 0, -1]);
  });

  it('sorts an array of objects with numerical property ascending', () => {
    expect(sortBy(unsortedObjs, { compareProp: 'a' })).toEqual([{ a: -6 }, { a: 1 }, { a: 3 }, { a: 15, goat: true }]);
  });

  it('sorts an array of objects with numerical property descending', () => {
    expect(sortBy(unsortedObjs, { compareProp: 'a', dir: 'desc' })).toEqual([{ a: 15, goat: true }, { a: 3 }, { a: 1 }, { a: -6 }]);
  });

  it('does not mutate the original list', () => {
    const sortedList = sortBy(unsortedNums);
    expect(unsortedNums).toEqual([1, 8, 3, 6, 0, -1, 10]);
    expect(sortedList).toEqual([-1, 0, 1, 3, 6, 8, 10]);
  });

  it('throws an error if property is not provided for object sorting', () => {
    expect(() => sortBy(unsortedObjs, { dir: 'desc' })).toThrow();
  });
});
