import { getInputAsLines } from "../../helpers/read-inputs";
import { getMatches } from "../../helpers/search";

export function y2024d2p1(): number {
  const reports = getInputAsLines(2).body;
  const parsedReports = reports.map((report) => getMatches(report, /[\d]+/g).map((el) => +el));

  let totalSafe = 0;
  for (const report of parsedReports) {
    if (isSafe(report, 3)) {
      totalSafe++;
    }
  }
  return totalSafe;
}

export function y2024d2p2(): number {
  const reports = getInputAsLines(2).body;
  const parsedReports = reports.map((report) => getMatches(report, /[\d]+/g).map((el) => +el));

  let totalSafe = 0;
  for (const report of parsedReports) {
    if (isSafe(report, 3, true)) {
      totalSafe++;
    }
  }
  return totalSafe;
}

function isSafe(inputs: number[], gradient: number, dampener?: boolean): boolean {
  return (isGradual(inputs, gradient, 'up', dampener) || isGradual(inputs, gradient, 'down', dampener));
}

function isGradual(inputs: number[], gradient: number, direction: 'up' | 'down', dampener?: boolean): boolean {
  for (let i = 0; i < inputs.length - 1; i++) {
    let difference = 1;
    if (direction === 'up') {
      difference = inputs[i + 1] - inputs[i];
    } else {
      difference = inputs[i] - inputs[i + 1];
    }
    if (difference <= 0 || difference > gradient) {
      if (dampener) {
        const firstRemoval = inputs.slice();
        firstRemoval.splice(i, 1);
        const secondRemoval = inputs.slice();
        secondRemoval.splice(i + 1, 1);
        return (isSafe(firstRemoval, gradient) || isSafe(secondRemoval, gradient));
      } else {
        return false;
      }
    }
  }
  return true;
}
