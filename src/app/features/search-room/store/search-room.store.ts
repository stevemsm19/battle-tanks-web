import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Room } from '../models/room.model';
import { RoomService } from '../services/search-room.service';

interface SearchRoomState {
  rooms: Room[];
  isRedirectModalOpen: boolean;
  activeRoomId: string;
}

const initialState: SearchRoomState = {
  rooms: [],
  isRedirectModalOpen: false,
  activeRoomId: '',
};

export const SearchRoomStore = signalStore(
  withState(initialState),
  withMethods(
    (store, roomService = inject(RoomService), router = inject(Router)) => ({
      loadRooms(): void {
        roomService.getRooms().subscribe({
          next: (rooms) => patchState(store, { rooms }),
          error: (err) => console.error('Error fetching rooms:', err),
        });
      },

      addRoom(room: Room): void {
        patchState(store, { rooms: [...store.rooms(), room] });
      },

      joinRoom(roomId: string): void {
        roomService.joinRoom(roomId).subscribe({
          next: () => router.navigate(['/waiting-room', roomId]),
          error: (error) => {
            console.error('Error joining room:', error);
            const errorMessage =
              error.error?.detail || 'The room is full or does not exist.';

            if (errorMessage.startsWith('User belongs')) {
              patchState(store, {
                activeRoomId: errorMessage.split(':')[1],
                isRedirectModalOpen: true,
              });
            } else if (errorMessage.startsWith('User is already')) {
              router.navigate(['/waiting-room', roomId]);
            } else {
              alert(errorMessage);
            }
          },
        });
      },

      redirectToActiveRoom(): void {
        const activeRoomId = store.activeRoomId();
        patchState(store, { isRedirectModalOpen: false });
        router.navigate(['/waiting-room', activeRoomId]);
      },

      closeRedirectModal(): void {
        patchState(store, { isRedirectModalOpen: false, activeRoomId: '' });
      },
    }),
  ),
);
