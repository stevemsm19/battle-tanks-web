import { createAction, props } from '@ngrx/store';
import { Player } from '../../models/player.model';

export const addPlayer = createAction(
  '[Player] Add Player',
  props<{ player: Player }>(),
);

export const removePlayer = createAction(
  '[Player] Remove Player',
  props<{ name: string }>(),
);

export const updatePlayerPosition = createAction(
  '[Player] Update Player Position',
  props<{ name: string; x: number; y: number }>(),
);

export const setPlayers = createAction(
  '[Player] Set Players',
  props<{ players: Player[] }>(),
);
