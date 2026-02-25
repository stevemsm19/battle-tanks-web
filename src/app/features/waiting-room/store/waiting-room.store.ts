import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export interface WaitingPlayer {
  id: string;
  name: string;
  isOwner: boolean;
}

type WaitingRoomState = {
  players: WaitingPlayer[];
  roomId: string;
  roomName: string;
};

const initialState: WaitingRoomState = {
  players: [],
  roomId: '',
  roomName: '',
};

export const WaitingRoomStore = signalStore(
  withState(initialState),
  withMethods((store) => ({
    setRoom(roomId: string, roomName: string) {
      patchState(store, { roomId, roomName });
    },

    setPlayers(players: WaitingPlayer[]) {
      patchState(store, { players });
    },

    addPlayer(player: WaitingPlayer) {
      const current = store.players();
      if (current.some((p) => p.id === player.id)) return;
      patchState(store, { players: [...current, player] });
    },

    removePlayer(userId: string) {
      patchState(store, (state) => ({
        players: state.players.filter((p) => p.id !== userId),
      }));
    },

    transferOwner(newOwnerId: string) {
      patchState(store, (state) => ({
        players: state.players.map((p) => ({
          ...p,
          isOwner: p.id === newOwnerId,
        })),
      }));
    },
  })),
);
