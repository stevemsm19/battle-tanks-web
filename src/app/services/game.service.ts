import { Injectable, signal, inject } from '@angular/core';
import { SignalrService } from './signalr.service';

export interface Player {
  name: string;
  status: 'creator' | 'ready' | 'waiting' | 'empty';
  avatar?: string;
  isCurrentUser?: boolean;
  x?: number;
  y?: number;
}

export interface ChatMessage {
  senderId: string;
  sender: string;
  text: string;
  time: string;
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private signalrService = inject(SignalrService);
  readonly _currentUserId = '1';
  private _roomName = 'TEST';
  private _mapName = 'TESTMAP';
  private _roomId = '123';

  public get currentUserId() {
    return this._currentUserId;
  }

  public get roomName() {
    return this._roomName;
  }

  public get mapName() {
    return this._mapName;
  }

  public get roomId() {
    return this._roomId;
  }

  private _players = signal<Player[]>([
    { name: 'STEVENSM19', status: 'creator' },
    { name: 'ESPERANDO...', status: 'empty' },
    { name: 'ESPERANDO...', status: 'empty' },
    { name: 'ESPERANDO...', status: 'empty' },
  ]);

  readonly players = this._players.asReadonly();

  public messages = signal<ChatMessage[]>([]);

  constructor() {
    this.addListeners();

    //TODO: Remove when backend is ready
    this.simulateIncomingPlayers();
    this.simulateIncomingMessages();
  }

  private addListeners() {
    this.signalrService.on('PlayerJoined', (player: Player) => {
      console.log('Player joined: ' + player.name);
      this.updatePlayerList(player);
    });

    this.signalrService.on('UpdatePlayerList', (players: Player[]) => {
      console.log('UpdatePlayerList received');
      this._players.set(players);
    });

    this.signalrService.on('ReceiveMessage', (message: ChatMessage) => {
      console.log('ReceiveMessage received');
      this.addMessage(message);
    });
  }

  public updatePlayerList(newPlayer: Player) {
    this._players.update((currentPlayers) => {
      const emptyIndex = currentPlayers.findIndex((p) => p.status === 'empty');
      if (emptyIndex !== -1) {
        const updatedPlayers = [...currentPlayers];
        updatedPlayers[emptyIndex] = newPlayer;
        return updatedPlayers;
      }
      return [...currentPlayers, newPlayer];
    });
  }

  private simulateIncomingPlayers() {
    const mockPlayers: Player[] = [
      { name: 'PIPE123', status: 'ready' },
      { name: 'TU_MOM12', status: 'ready' },
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < mockPlayers.length) {
        this.updatePlayerList(mockPlayers[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 2000);
  }

  private simulateIncomingMessages() {
    const mockMessages: ChatMessage[] = [
      {
        senderId: '1',
        sender: 'STEVENSM19',
        text: 'LISTOS?',
        time: '13:02',
      },
      {
        senderId: '2',
        sender: 'PIPE123',
        text: 'YA TU SABE',
        time: '13:03',
      },
      {
        senderId: '3',
        sender: 'TU_MOM12',
        text: 'FALTA UNO',
        time: '13:05',
      },
    ];

    let index = 0;
    setTimeout(() => {
      const interval = setInterval(() => {
        if (index < mockMessages.length) {
          this.addMessage(mockMessages[index]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 2500);
    }, 1000);
  }

  private addMessage(message: ChatMessage) {
    this.messages.update((msgs) => [...msgs, message]);
  }

  public sendMessage(text: string) {
    this.signalrService.invoke('SendMessage', text);

    const newMessage: ChatMessage = {
      senderId: '1',
      sender: 'STEVENSM19',
      text: text,
      time: new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
    };
    this.addMessage(newMessage);
  }

  public assignPositions() {
    this._players.update((currentPlayers) =>
      currentPlayers.map((player) => ({
        ...player,
        x: Math.floor(Math.random() * 12) + 1,
        y: Math.floor(Math.random() * 8) + 1,
      })),
    );
  }

  public movePlayer(direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') {
    const players = this.players();
    const currentUser = players.find(
      (p) => p.isCurrentUser || p.name === 'STEVENSM19',
    );

    if (!currentUser || !currentUser.x || !currentUser.y) return;

    let newX = currentUser.x;
    let newY = currentUser.y;

    const step = 0.15;

    switch (direction) {
      case 'UP':
        newY = Math.max(1, currentUser.y - step);
        break;
      case 'DOWN':
        newY = Math.min(8, currentUser.y + step);
        break;
      case 'LEFT':
        newX = Math.max(1, currentUser.x - step);
        break;
      case 'RIGHT':
        newX = Math.min(12, currentUser.x + step);
        break;
    }

    if (newX !== currentUser.x || newY !== currentUser.y) {
      this.signalrService.invoke('MovePlayer', { x: newX, y: newY });
      console.log(`Player ${currentUser.name} moved: ${direction} to (${newX}, ${newY})`);

      this.updatePlayerPosition(currentUser.name, newX, newY);
    }
  }

  private updatePlayerPosition(name: string, x: number, y: number) {
    this._players.update((currentPlayers) =>
      currentPlayers.map((p) => {
        if (p.name === name) {
          return { ...p, x, y };
        }
        return p;
      }),
    );
  }
}
