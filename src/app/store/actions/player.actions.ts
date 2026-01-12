import { createAction, props } from '@ngrx/store';
import { Player } from '../../models/player.model';

export const playerConnected = createAction(
  '[Player] Player Connected',
  props<{ player: Player }>()
);

export const playerMoved = createAction(
  '[Player] Player Moved',
  props<{ player: Player }>()
);