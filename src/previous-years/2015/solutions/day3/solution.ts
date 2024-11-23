import { getInputAsString } from "../../../../helpers/read-inputs";

interface IHouse {
  id: string;
  x: number;
  y: number;
  gifts: number;
}

interface ICoordiante {
  x: number;
  y: number;
}

// How many houses receive at least one gift?
export function d3p1(): number {
  const inputString = getInputAsString(3);

  const coords: ICoordiante = {
    x: 0,
    y: 0,
  };

  const houses = new Map<string, IHouse>();
  houses.set(`${coords.x}-${coords.y}`, {
    id: `${coords.x}-${coords.y}`,
    x: coords.x,
    y: coords.y,
    gifts: 1,
  });

  for (const char of inputString.trim().split('')) {
    updateCoords(coords, char);
    const house = houses.get(`${coords.x}-${coords.y}`) || {
      id: `${coords.x}-${coords.y}`,
      x: coords.x,
      y: coords.y,
      gifts: 0,
    };

    house.gifts += 1;
    houses.set(`${coords.x}-${coords.y}`, house);
  }

  return houses.size;
}

export function d3p2(): number {
  const inputString = getInputAsString(3);

  const santaCoords: ICoordiante = {
    x: 0,
    y: 0,
  };

  const roboCoords: ICoordiante = {
    x: 0,
    y: 0,
  };

  let santasTurn = true;
  const houses = new Map<string, IHouse>();
  houses.set(`${santaCoords.x}-${santaCoords.y}`, {
    id: `${santaCoords.x}-${santaCoords.y}`,
    x: santaCoords.x,
    y: santaCoords.y,
    gifts: 1,
  });

  for (const char of inputString.trim().split('')) {
    if (santasTurn) {
      updateCoords(santaCoords, char);
      const house = houses.get(`${santaCoords.x}-${santaCoords.y}`) || {
        id: `${santaCoords.x}-${santaCoords.y}`,
        x: santaCoords.x,
        y: santaCoords.y,
        gifts: 0,
      };
      
      house.gifts += 1;
      houses.set(`${santaCoords.x}-${santaCoords.y}`, house);
    } else {
      updateCoords(roboCoords, char);
      const house = houses.get(`${roboCoords.x}-${roboCoords.y}`) || {
        id: `${roboCoords.x}-${roboCoords.y}`,
        x: roboCoords.x,
        y: roboCoords.y,
        gifts: 0,
      };
      
      house.gifts += 1;
      houses.set(`${roboCoords.x}-${roboCoords.y}`, house);
    }
    santasTurn = !santasTurn;
  }

  return houses.size;
}

function updateCoords(coordinates: ICoordiante, char: string): void {
  if (char === '<') {
    coordinates.x--;
  } else if (char === '>') {
    coordinates.x++;
  } else if (char === 'v') {
    coordinates.y--;
  } else {
    coordinates.y++;
  }
}
