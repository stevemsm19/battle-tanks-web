import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SignalrService } from '../../../core/services/signalr.service';
import { RoomService } from '../../../domain/rooms/services/room.service';
import { AuthStore } from '../../../core/auth/store/auth.store';
import {
  WaitingRoomStore,
  WaitingPlayer,
} from '../../../domain/rooms/store/waiting-room.store';
import { GameService } from '../../game/services/game.service';

@Injectable()
export class WaitingRoomService {
  private signalrService = inject(SignalrService);
  private waitingRoomStore = inject(WaitingRoomStore);
  private roomService = inject(RoomService);
  private authStore = inject(AuthStore);
  private router = inject(Router);
  private gameService = inject(GameService);

  public roomName = this.waitingRoomStore.roomName;
  public mapName = this.waitingRoomStore.mapName;
  public roomId = this.waitingRoomStore.roomId;
  readonly players = this.waitingRoomStore.players;

  public get currentUserId() {
    return this.authStore.user()?.uid || '';
  }

  constructor() {
    this.addListeners();
  }

  public loadRoomDetails(id: string) {
    this.waitingRoomStore.setRoom(id, '', '');

    this.signalrService.joinGame(id);

    this.roomService.getRoomById(id).subscribe({
      next: (details) => {
        this.waitingRoomStore.setRoom(
          details.room.id,
          details.room.name,
          details.room.gameMapName,
        );

        const players: WaitingPlayer[] = details.players.map((p: any) => ({
          id: p.id || '',
          firebaseUid: p.firebaseUid || '',
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
    this.signalrService.invoke('LeaveGame', id);
    this.removeListeners();
    return this.roomService.leaveRoom(id);
  }

  public startGame() {
    const id = this.roomId();
    return this.roomService.startGame(id);
  }

  public removeListeners() {
    this.signalrService.off('PlayerJoined');
    this.signalrService.off('PlayerLeft');
    this.signalrService.off('GameStarted');
  }

  private addListeners() {
    this.signalrService.on(
      'PlayerJoined',
      (player: {
        id: string;
        firebaseUid: string;
        name: string;
        isOwner?: boolean;
      }) => {
        this.waitingRoomStore.addPlayer({
          id: player.id,
          firebaseUid: player.firebaseUid,
          name: player.name,
          isOwner: player.isOwner ?? false,
        });
      },
    );

    this.signalrService.on(
      'PlayerLeft',
      (data: { userId: string; newOwnerId?: string }) => {
        this.waitingRoomStore.removePlayer(data.userId);
        if (data.newOwnerId) {
          this.waitingRoomStore.transferOwner(data.newOwnerId);
        }
      },
    );

    this.signalrService.on(
      'GameStarted',
      (data: { roomId: string; map: number[][]; players: any[] }) => {
        this.gameService.initializeGame(data.map, data.players);
        this.removeListeners();
        this.router.navigate(['/game', data.roomId]);
      },
    );
  }
}
