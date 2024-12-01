import { getInputAsLines } from "../../../../helpers/read-inputs";

interface ILocation {
  id: string;
  visited: boolean;
  neighbours: Map<string, number>;
}

export function d9p1(): number {
  const lines = getInputAsLines(9).body;
  const locationMap = createLocationMap(lines);
  const locationIds = [...locationMap.keys()];

  // const something = recursiveTime(locationIds, locationMap);
  console.log(locationIds);
  return 0;
}

function createLocationMap(lines: string[]): Map<string, ILocation> {
  const locations = new Map<string, ILocation>();
  for (const line of lines) {
    // AlphaCentauri to Snowdin = 4
    const [readLocations, distance] = line.split(' = ');
    const [locAId, locBId] = readLocations.split(' to ');
    const locA: ILocation = locations.get(locAId) ?? { id: locAId, neighbours: new Map<string, number>(), visited: false };
    const locB: ILocation = locations.get(locBId) ?? { id: locBId, neighbours: new Map<string, number>(), visited: false };
    locA.neighbours.set(locBId, +distance);
    locB.neighbours.set(locAId, +distance);
    locations.set(locAId, locA);
    locations.set(locBId, locB);
  }
  return locations;
}

function hashRemainingLocatitons(remainingIds: string[]): string {
  return remainingIds.join('-');
}

/**
 * If 2 locations remain: result is the single 
 */
