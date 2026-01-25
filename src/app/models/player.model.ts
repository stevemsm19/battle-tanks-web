export interface Player {
  id: string;
  name: string;
  status: 'creator' | 'ready' | 'waiting' | 'empty';
  avatar?: string;
  isCurrentUser?: boolean;
  x?: number;
  y?: number;
  direction?: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
}
