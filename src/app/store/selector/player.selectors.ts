import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlayerState } from '../reducer/reducer';

export const selectPlayerState =
  createFeatureSelector<PlayerState>('players');

export const selectAllPlayers = createSelector(
  selectPlayerState,
  (state) => state.players
);