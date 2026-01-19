import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlayerState } from '../reducer/player.reducer';

export const selectPlayerState = createFeatureSelector<PlayerState>('players');

export const selectAllPlayers = createSelector(
  selectPlayerState,
  (state) => state.players,
);

export const selectActivePlayers = createSelector(selectAllPlayers, (players) =>
  players.filter((p) => p.status !== 'empty'),
);

export const selectCurrentUser = createSelector(selectAllPlayers, (players) =>
  players.find((p) => p.isCurrentUser || p.name === 'STEVENSM19'),
);
