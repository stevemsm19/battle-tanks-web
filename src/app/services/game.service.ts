import { Injectable, signal, inject } from '@angular/core';
import { SignalrService } from './signalr.service';

export interface Player {
  name: string;
  status: 'creator' | 'ready' | 'waiting' | 'empty';
  avatar?: string;
  isCurrentUser?: boolean;
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
  currentUserId = '1';

  public players = signal<Player[]>([
    { name: 'STEVENSM19', status: 'creator' },
    { name: 'ESPERANDO...', status: 'empty' },
    { name: 'ESPERANDO...', status: 'empty' },
    { name: 'ESPERANDO...', status: 'empty' },
  ]);

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
      this.players.set(players);
    });

    this.signalrService.on('ReceiveMessage', (message: ChatMessage) => {
      console.log('ReceiveMessage received');
      this.addMessage(message);
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

  private addMessage(message: ChatMessage) {
    this.messages.update((msgs) => [...msgs, message]);
  }

  private updatePlayerList(newPlayer: Player) {
    this.players.update((currentPlayers) => {
      const emptyIndex = currentPlayers.findIndex((p) => p.status === 'empty');
      if (emptyIndex !== -1) {
        const updatedPlayers = [...currentPlayers];
        updatedPlayers[emptyIndex] = newPlayer;
        return updatedPlayers;
      }
      return [...currentPlayers, newPlayer];
    });
  }
}
