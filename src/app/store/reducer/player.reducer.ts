import { createReducer, on } from '@ngrx/store';
import { Player } from '../../models/player.model';
import * as PlayerActions from '../actions/player.actions';

export interface PlayerState {
  players: Player[];
}

export const initialState: PlayerState = {
  players: [
    { id: '1', name: 'ESPERANDO...', status: 'empty' },
    { id: '2', name: 'ESPERANDO...', status: 'empty' },
    { id: '3', name: 'ESPERANDO...', status: 'empty' },
    { id: '4', name: 'ESPERANDO...', status: 'empty' },
  ],
};

export const playerReducer = createReducer(
  initialState,

  on(PlayerActions.addPlayer, (state, { player }) => {
    if (state.players.some((p) => p.name === player.name)) return state;

    const emptyIndex = state.players.findIndex((p) => p.status === 'empty');
    if (emptyIndex !== -1) {
      const updatedPlayers = [...state.players];
      updatedPlayers[emptyIndex] = player;
      return { ...state, players: updatedPlayers };
    }
    return { ...state, players: [...state.players, player] };
  }),

  on(PlayerActions.removePlayer, (state, { name }) => ({
    ...state,
    players: state.players.map((p) =>
      p.name === name
        ? { id: p.id, name: 'ESPERANDO...', status: 'empty' as const }
        : p,
    ),
  })),

  on(
    PlayerActions.updatePlayerPosition,
    (state, { name, x, y, direction }) => ({
      ...state,
      players: state.players.map((p) =>
        p.name === name ? { ...p, x, y, direction } : p,
      ),
    }),
  ),

  on(PlayerActions.setPlayers, (state, { players }) => ({
    ...state,
    players,
  })),
);
