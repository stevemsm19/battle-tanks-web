import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export interface WaitingPlayer {
  id: string;
  name: string;
  isOwner: boolean;
  firebaseUid: string;
}

type WaitingRoomState = {
  players: WaitingPlayer[];
  roomId: string;
  roomName: string;
  mapName: string;
};

const initialState: WaitingRoomState = {
  players: [],
  roomId: '',
  roomName: '',
  mapName: '',
};

export const WaitingRoomStore = signalStore(
  withState(initialState),
  withMethods((store) => ({
    setRoom(roomId: string, roomName: string, mapName: string) {
      patchState(store, { roomId, roomName, mapName });
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
