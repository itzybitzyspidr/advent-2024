import { binarySearch, isSorted } from "../helpers/algorithms";

describe('the binarySearch function', () => {
  const sortedNums = [-12, -3, 0, 5, 12, 14, 15, 16, 20, 500, 650, 1000];
  const unsortedNums = [-12, -3, 0, 5, 12, 14, 15, 16, 500, 20, 650, 1000];

  it('finds the index of target number if present', () => {
    expect(binarySearch(sortedNums, 12)).toBe(4);
  });

  it('returns -1 if number not present', () => {
    expect(binarySearch(sortedNums, 7)).toBe(-1);
  });

  it('throws an error if list is not ordered', () => {
    expect(() => binarySearch(unsortedNums, 0)).toThrow();
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

describe('the isSorted function with array of valid objects', () => {
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

  it('returns true when property provided for sorted list', () => {
    expect(isSorted(sortedObjects, { compareProp: 'a' })).toBe(true);
  });

  it('returns false when property provided for unsorted list', () => {
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
