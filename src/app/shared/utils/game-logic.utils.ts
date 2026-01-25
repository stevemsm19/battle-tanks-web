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
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

export const calculateNewPosition = (
  currentUser: Player,
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT',
): { x: number; y: number } | null => {
  if (!currentUser.x || !currentUser.y) return null;

  let newX = currentUser.x;
  let newY = currentUser.y;
  const step = 0.15;

  switch (direction) {
    case 'UP':
      newY = Math.max(1.2, currentUser.y - step);
      break;
    case 'DOWN':
      newY = Math.min(7.8, currentUser.y + step);
      break;
    case 'LEFT':
      newX = Math.max(1.2, currentUser.x - step);
      break;
    case 'RIGHT':
      newX = Math.min(11.8, currentUser.x + step);
      break;
  }

  if (newX !== currentUser.x || newY !== currentUser.y) {
    return { x: newX, y: newY };
  }

  return null;
};

export const generateRandomPositions = (players: Player[]): Player[] => {
  return players.map((player) => ({
    ...player,
    x: Math.random() * 10 + 1.5,
    y: Math.random() * 6 + 1.5,
  }));
};
