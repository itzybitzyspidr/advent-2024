import { getInputAsGrid } from "../../helpers/read-inputs";

interface INeighbour {
  direction: string;
  node: IPlot;
}

interface IPlot {
  row: number;
  col: number;
  id: string;
  neighbours: INeighbour[];
  region?: number;
}

interface IPlotSpaceDescription {
  area: number;
  perimeter: number;
}

export function y2024d12p1(p2?: boolean): number {
  const grid = getInputAsGrid(12).body;
  const plots: IPlot[] = [];
  for (const [row, line] of grid.entries()) {
    for (const [col, char] of line.entries()) {
      plots.push({
        col,
        row,
        id: char,
        neighbours: [],
      });
    }
  }

  populateNeighbours(plots);

  const regionMap = new Map<number, IPlotSpaceDescription>();
  populateRegions(plots, regionMap);

  console.log(regionMap);

  for (const plot of plots) {
    if (plot.region === undefined) {
      throw new Error(`Region not found for plot: ${plot.row}-${plot.col}.`);
    }

    const plotSpaceDescription = regionMap.get(plot.region);

    if (!plotSpaceDescription) {
      throw new Error(`Description not found for region: ${plot.region}.`);
    }

    regionMap.set(plot.region, {
      area: plotSpaceDescription.area + 1,
      perimeter: plotSpaceDescription.perimeter + 4 - plot.neighbours.filter((neighbour) => neighbour.node.region === plot.region).length,
    });
  }

  // Counts shared sides within a region and subtracts them from perimeter to get total number of sides.
  if (p2) {
    for (const plot of plots) {
      for (const neighbour of plot.neighbours) {
        // Single direction so no duplicate counting
        if (neighbour.node.col > plot.col || neighbour.node.row > plot.row) {
          const sharedCount = countSharedSides(neighbour.node, plot);
          if (sharedCount) {
            const region = regionMap.get(plot.region!);
            region!.perimeter -= sharedCount;
          }
        }
      }
    }
  }

  let total = 0;
  for (const [region, plotDescription] of regionMap.entries()) {
    total += plotDescription.area * plotDescription.perimeter;
    console.log(`Plot ${region} ---- Area: ${plotDescription.area}, Perimeter: ${plotDescription.perimeter}`);
  }

  return total;
}

export function y2024d12p2(): number {
  return y2024d12p1(true);
}

function populateNeighbours(plots: IPlot[]): void {
  for (const plot of plots) {
    const up = {direction: 'up', node: plots.find((p) => p.row === plot.row - 1 && p.col === plot.col) };
    const down = {direction: 'down', node: plots.find((p) => p.row === plot.row + 1 && p.col === plot.col) };
    const left = {direction: 'left', node: plots.find((p) => p.row === plot.row && p.col === plot.col - 1) };
    const right = {direction: 'right', node: plots.find((p) => p.row === plot.row && p.col === plot.col + 1) };

    for (const n of [up, down, left, right]) {
      if (n.node !== undefined) {
        plot.neighbours.push({
          direction: n.direction,
          node: n.node,
        });
      }
    }
  }
}

function populateRegions(plots: IPlot[], regionMap: Map<number, IPlotSpaceDescription>): void {
  let regionId = 0;
  for (const plot of plots) {
    if (plot.region === undefined) {
      plot.region = regionId;
      regionMap.set(plot.region, { area: 0, perimeter: 0 });
      populateLocalRegion(plot);
      regionId++; 
    }
  }
}

function populateLocalRegion(plot: IPlot): void {
  for (const neighbour of plot.neighbours) {
    if (neighbour.node.id === plot.id && neighbour.node.region === undefined) {
      neighbour.node.region = plot.region;
      populateLocalRegion(neighbour.node);
    }
  }
}

function countSharedSides(nodeA: IPlot, nodeB: IPlot): number {
  let sharedSides = 0;
  if (nodeA.region === nodeB.region) {
    for (const direction of ['up', 'down', 'left', 'right']) {
      const neighbourA = nodeA.neighbours.find((n) => n.direction === direction);
      // Edge boundary
      if (!neighbourA) {
        const neighbourB = nodeB.neighbours.find((n)=> n.direction === direction);
        if (!neighbourB) {
          sharedSides++;
        }
      } else if (neighbourA.node.region !== nodeA.region) {
        const neighbourB = nodeB.neighbours.find((n) => n.direction === neighbourA.direction);
        if (neighbourB && neighbourB.node.region !== nodeB.region) {
          sharedSides++;
        }
      }
    }
  }
  return sharedSides;
}
