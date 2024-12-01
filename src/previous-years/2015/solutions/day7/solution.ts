import { getInputAsLines } from "../../../../helpers/read-inputs";

enum Operator {
  AND = 'AND',
  OR = 'OR',
  LSHIFT = 'LSHIFT',
  RSHIFT = 'RSHIFT',
  PASS = 'PASS',
  NOT = 'NOT',
};

interface IGate {
  id: string;
  operator: Operator;
  inputGateIds: string[];
  rawInputs: number[];
  calculatedValue?: number;
};

export function d7p1(): number {
  const lines = getInputAsLines(7).body;
  const gateMap = createGateMap(lines);
  
  return evalutateGate('a', gateMap);
}

function createGateMap(lines: string[]): Map<string, IGate> {
  const gateMap = new Map<string, IGate>();

  for (const line of lines) {
    const [source, destination] = line.split(' -> ');
    
    const instructionMatch = source.match(/AND|OR|LSHIFT|RSHIFT|NOT/);
    let operator: Operator;
    if (instructionMatch) {
      operator = Operator[instructionMatch.toString() as Operator];
    } else {
      operator = Operator.PASS;
    }

    const sendingGateIds = source.match(/[a-z]+/g);
    const inputValues = source.match(/[0-9]+/g);

    const destinationGate: IGate = {
      id: destination,
      operator,
      rawInputs: [],
      inputGateIds: [],
    };

    if (inputValues) {
      for (const input of inputValues) {
        destinationGate.rawInputs.push(+input);
      }
    }

    if (sendingGateIds) {
      destinationGate.inputGateIds = sendingGateIds.map((id) => id);
    }
    gateMap.set(destination, destinationGate);
  }
  return gateMap;
}

// Recursively evalute all input gates.
function evalutateGate(id: string, gateMap: Map<string, IGate>): number {
  const gate = gateMap.get(id);
  if (!gate) {
    throw new Error(`Gate ${id} was not found.`);
  }

  if (gate.calculatedValue) {
    return gate.calculatedValue;
  }

  const incomingValues = gate.inputGateIds.map((inputId) => evalutateGate(inputId, gateMap));
  const rawInputs = gate.rawInputs;

  let v = 0;
  switch (gate.operator) {
    case Operator.AND:
      v = incomingValues[0];
      for (const value of [...incomingValues.slice(1), ...rawInputs]) {
        v = v & value;
      }
      break;

    case Operator.OR:
      for (const value of [...incomingValues, ...rawInputs]) {
        v = v | value;
      }
      break;

    case Operator.LSHIFT:
      v = incomingValues[0] << gate.rawInputs[0];
      break;

    case Operator.RSHIFT:
      v = incomingValues[0] >> gate.rawInputs[0];
      break;

    case Operator.NOT:
      if (incomingValues.length > 0) {
        v = ~incomingValues[0];
      } else {
        v = ~rawInputs[0];
      }
      break;

    case Operator.PASS:
      if (incomingValues.length > 0) {
        v = incomingValues[0];
      } else {
        v = rawInputs[0];
      }
      break;

    default: throw new Error(`Uncaught operator: ${gate.operator}`);
  }

  gate.calculatedValue = v;
  return v;
}
