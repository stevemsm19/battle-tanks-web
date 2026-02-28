export interface Player {
  id: string;
  name: string;
  status: 'creator' | 'ready' | 'waiting' | 'empty';
}
