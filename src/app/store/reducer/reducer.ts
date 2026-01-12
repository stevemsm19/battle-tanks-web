import { createReducer, on } from '@ngrx/store';
import { Player } from '../../models/player.model';
import * as PlayerActions from '../actions/player.actions';

export interface PlayerState {
  players: Player[];
}

export const initialState: PlayerState = {
  players: []
};

export const playerReducer = createReducer(
  initialState,

  on(PlayerActions.playerConnected, (state, { player }) => ({
    ...state,
    players: [...state.players, player]
  })),

  on(PlayerActions.playerMoved, (state, { player }) => ({
    ...state,
    players: state.players.map(p =>
      p.id === player.id ? player : p
    )
  }))
);