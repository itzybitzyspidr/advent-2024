import { getInputAsGrid } from "../../helpers/read-inputs";

interface ILocation {
  coords: ICoordinate;
  height: number;
  trails?: number;
}

interface ICoordinate {
  row: number;
  col: number;
}

export function y2024d10p1(): number {
  const input = getInputAsGrid(10).body;
  
  const locations: ILocation[] = [];
  for (const [row, line] of input.entries()) {
    for (const [col, char] of line.entries()) {
      locations.push({
        coords: {
          col,
          row,
        },
        height: +char,
      });
    }
  }

  let total = 0;
  const cache = new Map<string, Set<ICoordinate>>();

  for (const location of locations) {
    if (location.height === 0) {
      total += getConnectedTrailCount(location, locations, cache).size
    }
  }

  return total;
}

export function y2024d10p2(): number {
  const input = getInputAsGrid(10).body;
  
  const locations: ILocation[] = [];
  for (const [row, line] of input.entries()) {
    for (const [col, char] of line.entries()) {
      locations.push({
        coords: {
          col,
          row,
        },
        height: +char,
      });
    }
  }

  let total = 0;
  const cache = new Map<string, number>();

  for (const location of locations) {
    if (location.height === 0) {
      total += getValidTrails(location, locations, cache);
    }
  }

  return total;
}

function getConnectedTrailCount(coord: ILocation, grid: ILocation[], cache: Map<string, Set<ICoordinate>>): Set<ICoordinate> {
  if (coord.height === 9) {
    return new Set<ICoordinate>([coord.coords]);
  }

  const cachedRes = cache.get(`${coord.coords.row}-${coord.coords.col}`);

  if (cachedRes) {
    return cachedRes;
  }

  const reachableCoords = new Set<ICoordinate>();
  const neighbours = getValidNeighbours(coord, grid);
  for (const neighbour of neighbours) {
    for (const crd of getConnectedTrailCount(neighbour, grid, cache).values()) {
      reachableCoords.add(crd);
    }
  }

  cache.set(`${coord.coords.row}-${coord.coords.col}`, reachableCoords);
  return reachableCoords;
}

function getValidTrails(coord: ILocation, grid: ILocation[], cache: Map<string, number>): number {
  if (coord.height === 9) {
    return 1;
  }

  const cachedRes = cache.get(`${coord.coords.row}-${coord.coords.col}`);

  if (cachedRes) {
    return cachedRes;
  }

  let trailCount = 0;
  const neighbours = getValidNeighbours(coord, grid);
  for (const neighbour of neighbours) {
      trailCount += getValidTrails(neighbour, grid, cache);
  }

  cache.set(`${coord.coords.row}-${coord.coords.col}`, trailCount);
  return trailCount;
}

function getValidNeighbours(coord: ILocation, grid: ILocation[]): ILocation[] {
  const neighbours = grid.filter((location) => {
    return (
      (location.coords.col === coord.coords.col && Math.abs(location.coords.row - coord.coords.row) === 1) ||
      (location.coords.row === coord.coords.row && Math.abs(location.coords.col - coord.coords.col) === 1)
    );
  });

  const res: ILocation[] = [];
  for (const neighbour of neighbours) {
    if (neighbour && neighbour.height === coord.height + 1) {
      res.push(neighbour);
    }
  }

  return res;
}
