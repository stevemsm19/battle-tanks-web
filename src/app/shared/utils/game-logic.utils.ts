import { Player } from '../../models/player.model';

export const MAP_MATRIX = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 2, 2, 0, 1, 0, 1, 0, 2, 2, 2, 2, 2, 2, 0, 1, 0, 1, 0, 2, 2, 0, 0],
  [0, 0, 2, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 2, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 2, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 2, 2, 0, 0, 0, 0],
  [0, 0, 1, 0, 2, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 2, 0, 1, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 2, 2, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
  [0, 1, 1, 0, 2, 2, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 2, 2, 0, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 2, 2, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 2, 2, 0, 0],
  [0, 0, 2, 2, 0, 0, 0, 1, 0, 2, 2, 2, 2, 2, 2, 0, 1, 0, 0, 0, 2, 2, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

export const calculateNewPosition = (
  currentUser: Player,
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT',
  mapMatrix: number[][],
): { x: number; y: number } | null => {
  if (!currentUser.x || !currentUser.y) return null;

  let newX = currentUser.x;
  let newY = currentUser.y;
  const step = 0.2;

  switch (direction) {
    case 'UP':
      newY -= step;
      break;
    case 'DOWN':
      newY += step;
      break;
    case 'LEFT':
      newX -= step;
      break;
    case 'RIGHT':
      newX += step;
      break;
  }

  newX = Math.round(newX * 100) / 100;
  newY = Math.round(newY * 100) / 100;

  if (isValidMove(newX, newY, mapMatrix)) {
    return { x: newX, y: newY };
  }

  return null;
};

export const generateRandomPositions = (players: Player[]): Player[] => {
  return players.map((player) => {
    let x, y, valid;
    let attempts = 0;
    do {
      x = Math.floor(Math.random() * 24) + 1;
      y = Math.floor(Math.random() * 16) + 1;
      valid = MAP_MATRIX[y - 1][x - 1] === 0;
      attempts++;
    } while (!valid && attempts < 50);

    return {
      ...player,
      x,
      y,
    };
  });
};

export const isValidMove = (
  x: number,
  y: number,
  mapMatrix: number[][],
): boolean => {
  const SIZE = 0.8;
  const COLS = 24;
  const ROWS = 16;

  if (x < 1 || x > COLS || y < 1 || y > ROWS) return false;

  const startCol = Math.floor(x - 1);
  const endCol = Math.floor(x - 1 + SIZE);
  const startRow = Math.floor(y - 1);
  const endRow = Math.floor(y - 1 + SIZE);

  for (let r = startRow; r <= endRow; r++) {
    for (let c = startCol; c <= endCol; c++) {
      if (mapMatrix[r]?.[c] !== 0) return false;
    }
  }

  return true;
};
