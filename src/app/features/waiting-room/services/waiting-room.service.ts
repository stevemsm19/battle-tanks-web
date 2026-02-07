import { Injectable, inject, signal } from '@angular/core';
import { SignalrService } from '../../../core/services/signalr.service';
import { Player } from '../../../shared/models/player.model';
import { RoomService } from '../../rooms/services/room.service';
import { PlayerStore } from '../../../shared/store/player.store';
import { ChatStore } from '../../game/store/chat.store';
import { AuthService } from '../../../core/services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

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
  private chatStore = inject(ChatStore);

  private authService = inject(AuthService);
  private firebaseUser = toSignal(this.authService.user$);

  public roomName = signal('Loading...');
  public mapName = signal('Default Map');
  public roomId = signal('');

  public messages = this.chatStore.messages;

  readonly players = this.playerStore.players;

  public get currentUserId() {
    return this.firebaseUser()?.uid || '';
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

  public sendMessage(message: string) {
    const userId = this.currentUserId;
    const players = this.players();

    let user = players.find((p) => p.id === userId);

    if (!user && this.firebaseUser()) {
      const fbName = this.firebaseUser()?.displayName;
      const fbEmail = this.firebaseUser()?.email?.split('@')[0];

      if (fbName) {
        user = players.find(
          (p) => p.name.toLowerCase() === fbName.toLowerCase(),
        );
      }
      if (!user && fbEmail) {
        user = players.find(
          (p) => p.name.toLowerCase() === fbEmail.toLowerCase(),
        );
      }
    }

    const senderName = user
      ? user.name
      : this.firebaseUser()?.displayName ||
        this.firebaseUser()?.email ||
        'Unknown User';

    const startTime = performance.now();
    this.signalrService
      .invoke('SendMessage', this.roomId(), senderName, message)
      .then(() => {
        const latency = performance.now() - startTime;
        console.log(
          `[WaitingRoomService] Message sent to SignalR in ${latency.toFixed(2)} ms`,
        );
      })
      .catch((err) =>
        console.error(
          '[WaitingRoomService] Error sending message to SignalR:',
          err,
        ),
      );
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

    this.signalrService.on('ReceiveMessage', (data: any) => {
      console.log('ReceiveMessage received', data);
      const message: ChatMessage = {
        senderId: 'unknown',
        sender: data.sender || 'Unknown',
        text: data.text || '',
        time: data.time
          ? new Date(data.time).toLocaleTimeString()
          : new Date().toLocaleTimeString(),
      };
      this.chatStore.addMessage(message);
    });
  }
}
