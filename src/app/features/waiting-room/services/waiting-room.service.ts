import { Injectable, inject, signal } from '@angular/core';
import { SignalrService } from '../../../core/services/signalr.service';
import { Player } from '../../../shared/models/player.model';
import { RoomService } from '../../rooms/services/room.service';
import { PlayerStore } from '../../../shared/store/player.store';

export interface ChatMessage {
  senderId: string;
  sender: string;
  text: string;
  time: string;
}

@Injectable({
  providedIn: 'root',
})
export class WaitingRoomService {
  private signalrService = inject(SignalrService);
  private playerStore = inject(PlayerStore);
  private roomService = inject(RoomService);

  readonly _currentUserId = '1';

  public roomName = signal('Loading...');
  public mapName = signal('Default Map');
  public roomId = signal('');

  public messages = signal<ChatMessage[]>([]);

  readonly players = this.playerStore.players;

  public get currentUserId() {
    return this._currentUserId;
  }

  constructor() {
    this.addListeners();
  }

  public loadRoomDetails(id: string) {
    this.roomId.set(id);

    this.signalrService
      .invoke('JoinGame', id)
      .catch((err) => console.error('Error joining SignalR group:', err));

    this.roomService.getRoomById(id).subscribe({
      next: (details) => {
        this.roomName.set(details.roomName);

        const players: Player[] = details.players.map(
          (p) =>
            ({
              id: p.id || '',
              name: p.name || 'Unknown',
              status: 'waiting',
              x: 0,
              y: 0,
            }) as Player,
        );

        this.playerStore.setPlayers(players);
      },
      error: (err) => console.error('Error loading room:', err),
    });
  }

  private addListeners() {
    this.signalrService.on('PlayerJoined', (player: Player) => {
      console.log('SignalR [PlayerJoined] Received:', player);
      this.playerStore.addPlayer(player);
    });

    this.signalrService.on('UpdatePlayerList', (players: Player[]) => {
      console.log('UpdatePlayerList received');
      this.playerStore.setPlayers(players);
    });

    this.signalrService.on('ReceiveMessage', (message: ChatMessage) => {
      console.log('ReceiveMessage received');
      this.addMessage(message);
    });
  }

  private addMessage(message: ChatMessage) {
    this.messages.update((msgs) => [...msgs, message]);
  }
}
