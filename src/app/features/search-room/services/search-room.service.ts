import { Injectable, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SignalrService } from '../../../core/services/signalr.service';
import { SearchRoomStore } from '../../../domain/rooms/store/search-room.store';
import { Room } from '../../../domain/rooms/models/room.model';

@Injectable()
export class SearchRoomService implements OnDestroy {
  private signalrService = inject(SignalrService);
  private store = inject(SearchRoomStore);
  private router = inject(Router);

  public readonly rooms = this.store.rooms;
  public readonly isRedirectModalOpen = this.store.isRedirectModalOpen;
  public readonly isLoadingMore = this.store.isLoadingMore;
  public readonly isLoadingRooms = this.store.isLoadingRooms;
  public readonly hasNextPage = this.store.hasNextPage;

  constructor() {
    this.addListeners();
  }

  public loadRooms(): void {
    this.store.loadRooms();
  }

  public loadNextPage(): void {
    this.store.loadNextPage();
  }

  public joinRoom(roomId: string): void {
    this.store.joinRoom(roomId);
  }

  public redirectToActiveRoom(): void {
    this.store.redirectToActiveRoom();
  }

  public closeRedirectModal(): void {
    this.store.closeRedirectModal();
  }

  public goBack(): void {
    this.router.navigate(['/play']);
  }

  ngOnDestroy(): void {
    this.removeListeners();
  }

  private addListeners(): void {
    this.signalrService.invoke('JoinSearchRoomGroup');

    this.signalrService.on('RoomCreated', (room: Room) => {
      this.store.addRoom(room);
    });

    this.signalrService.on('RoomStatusChanged', (data: { roomId: string }) => {
      this.store.removeRoom(data.roomId);
    });

    this.signalrService.on(
      'RoomPlayerCountChanged',
      (data: { roomId: string; currentPlayers: number }) => {
        this.store.updateRoomPlayerCount(data.roomId, data.currentPlayers);
      },
    );
  }

  private removeListeners(): void {
    this.signalrService.invoke('LeaveSearchRoomGroup');
    this.signalrService.off('RoomCreated');
    this.signalrService.off('RoomStatusChanged');
    this.signalrService.off('RoomPlayerCountChanged');
  }
}
