import { Injectable, inject, signal } from '@angular/core';
import { SignalrService } from '../../../core/services/signalr.service';
import { RoomService } from '../../search-room/services/search-room.service';
import { LoginService } from '../../../core/auth/pages/login/services/login.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { WaitingRoomStore, WaitingPlayer } from '../store/waiting-room.store';

@Injectable()
export class WaitingRoomService {
  private signalrService = inject(SignalrService);
  private waitingRoomStore = inject(WaitingRoomStore);
  private roomService = inject(RoomService);
  private loginService = inject(LoginService);
  private firebaseUser = toSignal(this.loginService.user$);

  public roomName = this.waitingRoomStore.roomName;
  public mapName = signal('Default Map');
  public roomId = this.waitingRoomStore.roomId;
  readonly players = this.waitingRoomStore.players;

  public get currentUserId() {
    return this.firebaseUser()?.uid || '';
  }

  constructor() {
    this.addListeners();
  }

  public loadRoomDetails(id: string) {
    this.waitingRoomStore.setRoom(id, '');

    this.signalrService
      .invoke('JoinGame', id)
      .catch((err) => console.error('Error joining SignalR group:', err));

    this.roomService.getRoomById(id).subscribe({
      next: (details) => {
        this.waitingRoomStore.setRoom(id, details.roomName);

        const players: WaitingPlayer[] = details.players.map((p: any) => ({
          id: p.id || '',
          name: p.name || 'Unknown',
          isOwner: p.isOwner ?? false,
        }));

        this.waitingRoomStore.setPlayers(players);
      },
      error: (err) => console.error('Error loading room:', err),
    });
  }

  public leaveRoom() {
    const id = this.roomId();
    return this.roomService.leaveRoom(id);
  }

  private addListeners() {
    this.signalrService.on(
      'PlayerJoined',
      (player: { id: string; name: string; isOwner?: boolean }) => {
        console.log('SignalR [PlayerJoined]:', player);
        this.waitingRoomStore.addPlayer({
          id: player.id,
          name: player.name,
          isOwner: player.isOwner ?? false,
        });
      },
    );

    this.signalrService.on(
      'PlayerLeft',
      (data: { userId: string; newOwnerId?: string }) => {
        console.log('SignalR [PlayerLeft]:', data);
        this.waitingRoomStore.removePlayer(data.userId);
        if (data.newOwnerId) {
          this.waitingRoomStore.transferOwner(data.newOwnerId);
        }
      },
    );
  }
}
