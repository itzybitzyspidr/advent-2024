export function countEntries<T>(input: T[]): Map<T, number> {
  const outputMap = new Map<T, number>();
  for (const entry of input) {
    const count = outputMap.get(entry) || 0;
    outputMap.set(entry, count + 1);
  }
  
  return outputMap;
}
