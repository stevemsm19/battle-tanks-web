import { Player } from '../../models/player.model';

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
      newY = Math.max(1, currentUser.y - step);
      break;
    case 'DOWN':
      newY = Math.min(8, currentUser.y + step);
      break;
    case 'LEFT':
      newX = Math.max(1, currentUser.x - step);
      break;
    case 'RIGHT':
      newX = Math.min(12, currentUser.x + step);
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
    x: Math.floor(Math.random() * 12) + 1,
    y: Math.floor(Math.random() * 8) + 1,
  }));
};
