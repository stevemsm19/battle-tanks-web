import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Player } from '../../../shared/models/player.model';
import { computed } from '@angular/core';

type PlayerState = {
  players: Player[];
};

const initialState: PlayerState = {
  players: [],
};

export const PlayerStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ players }) => ({
    activePlayers: computed(() =>
      players().filter((p) => p.status !== 'empty'),
    ),
    currentUser: computed(() =>
      players().find((p) => p.id === '1' || p.name === 'STEVENSM19'),
    ),
  })),
  withMethods((store) => ({
    setPlayers(players: Player[]) {
      patchState(store, { players });
    },
    addPlayer(player: Player) {
      const currentPlayers = store.players();
      if (currentPlayers.some((p) => p.name === player.name)) return;

      const emptyIndex = currentPlayers.findIndex((p) => p.status === 'empty');
      if (emptyIndex !== -1) {
        const updatedPlayers = [...currentPlayers];
        updatedPlayers[emptyIndex] = player;
        patchState(store, { players: updatedPlayers });
      } else {
        patchState(store, { players: [...currentPlayers, player] });
      }
    },
    removePlayer(name: string) {
      patchState(store, (state) => ({
        players: state.players.map((p) =>
          p.name === name
            ? { ...p, name: 'ESPERANDO...', status: 'empty' as const }
            : p,
        ),
      }));
    },
    updatePlayerPosition(
      name: string,
      x: number,
      y: number,
      direction?: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT',
    ) {
      patchState(store, (state) => ({
        players: state.players.map((p) =>
          p.name === name
            ? { ...p, x, y, ...(direction ? { direction } : {}) }
            : p,
        ),
      }));
    },
  })),
);
