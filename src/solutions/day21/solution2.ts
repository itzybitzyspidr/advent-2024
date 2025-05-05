import { getInputAsLines } from "../../helpers/read-inputs";

interface ICoordinate {
    row: number;
    col: number;
}

type Layout = Record<string, ICoordinate>;
type Sequence = Record<string, Record<string, string>>;
type KeypadState = Record<number, string>;
type Path = Record<string, string>;

const KEYPAD_LAYOUT: Layout = {
    '7': { row: 0, col: 0 },
    '8': { row: 0, col: 1 },
    '9': { row: 0, col: 2 },
    '4': { row: 1, col: 0 },
    '5': { row: 1, col: 1 },
    '6': { row: 1, col: 2 },
    '1': { row: 2, col: 0 },
    '2': { row: 2, col: 1 },
    '3': { row: 2, col: 2 },
    'void': { row: 3, col: 0 },
    '0': { row: 3, col: 1 },
    'A': { row: 3, col: 2 },
};

const DIRECTIONAL_LAYOUT: Layout = {
    'void': { row: 0, col: 0 },
    '^': { row: 0, col: 1 },
    'A': { row: 0, col: 2 },
    '<': { row: 1, col: 0 },
    'v': { row: 1, col: 1 },
    '>': { row: 1, col: 2 },
};

const directionalPathMap: Sequence = {};
const keypadPathMap: Sequence = {};
const keypadState: KeypadState = {};
const distMap = new Map<string, number>();
const basePath: Path = { "foo": '' };

const INTERMEDIATE_DEPTH = 26;

export function y2024d21p2a(): number {
    const codes = getInputAsLines(21).body;

    // 1. Get Code
    // 2. Generate path for first character - this forms the code for the next machine.
    // 3. Generate path for first character - recursively until reaching desired depth.

    let total = 0;
    for (const code of codes) {
        total += calculateComplexity(code);
    }

    return total;
}

function calculateComplexity(code: string): number {
    const steps = countSteps(code, 0);
    const numerical = code.match(/[\d]+/);
    if (!numerical) {
        throw new Error(`Couldn't extract numerical value from ${code}.`);
    }

    return steps * +numerical;
}

function countSteps(path: string, currentDepth: number): number {
    if (currentDepth === INTERMEDIATE_DEPTH) {
        basePath.foo += path;
        return path.length;
    }

    if (!keypadState[currentDepth]) {
        keypadState[currentDepth] = 'A';
    }

    let steps = 0;
    for (const char of path) {
        const newPath = getPath(currentDepth === 0 ? 'key' : 'dir', keypadState[currentDepth], char);
        const newSteps = distMap.get(`${newPath}-${currentDepth + 1}`);
        if (newSteps !== undefined) {
            steps += newSteps
        } else {
            const newSteps = countSteps(newPath, currentDepth + 1);
            steps += newSteps
            distMap.set(`${newPath}-${currentDepth + 1}`, newSteps);
        }

        keypadState[currentDepth] = char;
    }

    return steps;
}

function getPath(layoutType: 'dir' | 'key', start: string, target: string): string {
    const pathMap = layoutType === 'dir' ? directionalPathMap : keypadPathMap;
    if (pathMap[start] && pathMap[start][target]) {
        return pathMap[start][target];
    }

    // Path hasn't already been mapped - we need to build it.
    const [startCoords, targetCoords, voidCoords] = getCoords(layoutType, start, target);
    const path = buildPath(startCoords, targetCoords, voidCoords) + 'A';
    addPath(pathMap, start, target, path);
    return path;
}

function getCoords(layoutType: 'dir' | 'key', start: string, target: string): ICoordinate[] {
    const layout = layoutType === 'dir' ? DIRECTIONAL_LAYOUT : KEYPAD_LAYOUT;

    const response = [layout[start], layout[target], layout['void']];

    // Rolling this out so I can see which button is specifically not being found.
    for (const coord of response) {
        if (!coord) {
            throw new Error(`Couldn't find coords on ${layout} for button: ${coord}.`);
        }
    }

    return response;
}

function buildPath(start: ICoordinate, target: ICoordinate, unsafe: ICoordinate): string {
    let path = '';
    // Special case where left then up/down would cross the void
    if (start.row === unsafe.row && target.col === unsafe.col) {
        path += moveVertical(start, target);
        path += moveHorizontal(start, target);
        // Special case where up/down then right would cross the void
    } else if (start.col === unsafe.col && target.row === unsafe.row) {
        path += moveHorizontal(start, target);
        path += moveVertical(start, target);
        // Left then Vert
    } else if (start.col > target.col) {
        path += moveHorizontal(start, target);
        path += moveVertical(start, target);
        // Vert then Right
    } else {
        path += moveVertical(start, target);
        path += moveHorizontal(start, target);
    }
    return path;
}

function moveVertical(start: ICoordinate, target: ICoordinate): string {
    if (start.row > target.row) {
        return Array(Math.abs(start.row - target.row)).fill('^').join('');
    }
    return Array(Math.abs(start.row - target.row)).fill('v').join('');
}

function moveHorizontal(start: ICoordinate, target: ICoordinate): string {
    if (start.col > target.col) {
        return Array(Math.abs(start.col - target.col)).fill('<').join('');
    }
    return Array(Math.abs(start.col - target.col)).fill('>').join('');
}

function addPath(pathMap: Sequence, start: string, target: string, path: string): void {
    if (!pathMap[start]) {
        pathMap[start] = {};
    }
    pathMap[start][target] = path;
}
