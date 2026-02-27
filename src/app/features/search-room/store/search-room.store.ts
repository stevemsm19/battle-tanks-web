import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { getState, patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Room } from '../models/room.model';
import { RoomService } from '../services/search-room.service';

interface SearchRoomState {
  rooms: Room[];
  isRedirectModalOpen: boolean;
  activeRoomId: string;
  page: number;
  hasNextPage: boolean;
  isLoadingMore: boolean;
}

const initialState: SearchRoomState = {
  rooms: [],
  isRedirectModalOpen: false,
  activeRoomId: '',
  page: 1,
  hasNextPage: false,
  isLoadingMore: false,
};

export const SearchRoomStore = signalStore(
  withState(initialState),
  withMethods(
    (store, roomService = inject(RoomService), router = inject(Router)) => ({
      loadRooms(): void {
        roomService.getRooms(1).subscribe({
          next: (result) =>
            patchState(store, {
              rooms: result.items,
              page: 1,
              hasNextPage: result.hasNextPage,
            }),
          error: (err) => console.error('Error fetching rooms:', err),
        });
      },

      loadNextPage(): void {
        if (!store.hasNextPage() || store.isLoadingMore()) return;

        const nextPage = store.page() + 1;
        patchState(store, { isLoadingMore: true });

        roomService.getRooms(nextPage).subscribe({
          next: (result) =>
            patchState(store, {
              rooms: [...store.rooms(), ...result.items],
              page: nextPage,
              hasNextPage: result.hasNextPage,
              isLoadingMore: false,
            }),
          error: (err) => {
            console.error('Error loading next page:', err);
            patchState(store, { isLoadingMore: false });
          },
        });
      },

      addRoom(room: Room): void {
        patchState(store, { rooms: [...store.rooms(), room] });
      },

      removeRoom(roomId: string): void {
        patchState(store, {
          rooms: store.rooms().filter((r) => r.id !== roomId),
        });
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
