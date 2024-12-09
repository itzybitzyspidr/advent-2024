import { getInputAsString } from "../../helpers/read-inputs";

type Range = number[];

interface IBlockRange {
  position: Range;
  id: number | null;
  fixed?: boolean;
}

export function y2024d9p1(): number {
  const input = getInputAsString(9);

  const memory = buildMemoryBlocks(input);
  while (memory.some((block) => block.id === null)) {
    moveLastBlock(memory);
  }

  return calculateChecksum(memory);
}

export function y2024d9p2(): number {
  const input = getInputAsString(9);

  const memory = buildMemoryBlocks(input);
  const memCopy = memory.slice();

  for (let i = memory.length -1; i > -1; i--) {
    if (memory[i].id !== null) {
      const cell = memory[i];
      const availableSpaceIndex = memCopy.findIndex((block) => {
        return (
          block.id === null &&
          block.position[1] - block.position[0] >= cell.position[1] - cell.position[0] &&
          block.position[1] < cell.position[0]
        );
      });

      if (availableSpaceIndex > 0) {
        // Remove the moving block from original entry in copied memory
        memCopy.splice(memCopy.findIndex((block) => block.id === cell.id), 1);
        const firstSpace = memCopy[availableSpaceIndex];
        const availableSpace = firstSpace.position[1] - firstSpace.position[0] + 1;
        const requestedSpace = cell.position[1] - cell.position[0] + 1;
        if (availableSpace === requestedSpace) {
          firstSpace.id = cell.id;
        } else {
            memCopy.splice(availableSpaceIndex, 0, {
            position: [firstSpace.position[0], firstSpace.position[0] + requestedSpace - 1],
            id: cell.id,
          });
          firstSpace.position[0] += requestedSpace;
        }
      }
    }
  }
  console.log(memCopy);
  return calculateChecksum(memCopy);
}

function buildMemoryBlocks(input: string): IBlockRange[] {
  const memory: IBlockRange[] = [];
  let currentStartIndex = 0;
  for (const [index, char] of input.split('').entries()) {
    if (index % 2) {
      if (+char > 0) {
        memory.push({
          position: [currentStartIndex, currentStartIndex + +char - 1],
          id: null,
        });
      }
    } else {
      memory.push({
        position: [currentStartIndex, currentStartIndex + +char - 1],
        id: index / 2,
      });
    }
    currentStartIndex += +char;
  }

  return memory;
}

function moveLastBlock(memory: IBlockRange[]): IBlockRange[] {
  // Get last block
  let lastFilledBlock = memory.pop();

  // Throw away last block if it's empty space.
  while (!lastFilledBlock || lastFilledBlock.id === null) {
    if (!lastFilledBlock) {
      throw new Error(`Couldn't read last memory block.`);
    }
    lastFilledBlock = memory.pop();
  }

  const requestedSpace = lastFilledBlock.position[1] - lastFilledBlock.position[0] + 1;
  // Get first block with null ID
  const firstSpaceIndex = memory.findIndex((block) => block.id === null);

  // No more empty space - you're done.
  if (firstSpaceIndex === -1) {
    memory.push(lastFilledBlock);
    return memory;
  }

  const firstSpace = memory[firstSpaceIndex];
  const availableSpace = firstSpace.position[1] - firstSpace.position[0] + 1;

  if (availableSpace === requestedSpace) {
    firstSpace.id = lastFilledBlock.id;
  } else if (availableSpace < requestedSpace) {
    firstSpace.id = lastFilledBlock.id;
    lastFilledBlock.position[1] -= availableSpace;
    memory.push(lastFilledBlock);
  } else {
    memory.splice(firstSpaceIndex, 0, {
      position: [firstSpace.position[0], firstSpace.position[0] + requestedSpace - 1],
      id: lastFilledBlock.id,
    });
    firstSpace.position[0] += requestedSpace;
  }

  return memory;
}

function calculateChecksum(memory: IBlockRange[]): number {
  let total = 0;
  for (const cell of memory) {
    if (cell.id !== null) {
      for (let i = cell.position[0]; i <= cell.position[1]; i++) {
        total += i * cell.id;
      }
    }
  }
  return total;
}
