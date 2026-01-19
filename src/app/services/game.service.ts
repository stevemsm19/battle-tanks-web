import { Injectable, signal, inject } from '@angular/core';
import { SignalrService } from './signalr.service';
import { Player } from '../models/player.model';
import { Store } from '@ngrx/store';
import * as PlayerActions from '../store/actions/player.actions';
import {
  selectAllPlayers,
  selectCurrentUser,
} from '../store/selector/player.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  calculateNewPosition,
  generateRandomPositions,
} from '../shared/utils/game-logic.utils';
import {
  simulateIncomingPlayers,
  simulateIncomingMessages,
} from '../shared/utils/simulation.utils';

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
  private store = inject(Store);

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

  readonly players = toSignal(this.store.select(selectAllPlayers), {
    initialValue: [] as Player[],
  });
  readonly currentUser = toSignal(this.store.select(selectCurrentUser));

  public messages = signal<ChatMessage[]>([]);

  constructor() {
    this.addListeners();

    //TODO: Remove when backend is ready
    this.startSimulations();
  }

  private addListeners() {
    this.signalrService.on('PlayerJoined', (player: Player) => {
      console.log('Player joined: ' + player.name);
      this.store.dispatch(PlayerActions.addPlayer({ player }));
    });

    this.signalrService.on('UpdatePlayerList', (players: Player[]) => {
      console.log('UpdatePlayerList received');
      this.store.dispatch(PlayerActions.setPlayers({ players }));
    });

    this.signalrService.on('ReceiveMessage', (message: ChatMessage) => {
      console.log('ReceiveMessage received');
      this.addMessage(message);
    });
  }

  private startSimulations() {
    const mockPlayers: Player[] = [
      { id: '2', name: 'PIPE123', status: 'ready', x: 0, y: 0 },
      { id: '3', name: 'TU_MOM12', status: 'ready', x: 0, y: 0 },
    ];
    simulateIncomingPlayers(this.store, mockPlayers);

    const mockMessages: ChatMessage[] = [
      { senderId: '1', sender: 'STEVENSM19', text: 'LISTOS?', time: '13:02' },
      { senderId: '2', sender: 'PIPE123', text: 'YA TU SABE', time: '13:03' },
      { senderId: '3', sender: 'TU_MOM12', text: 'FALTA UNO', time: '13:05' },
    ];
    simulateIncomingMessages(mockMessages, (msg) => this.addMessage(msg));
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
    const updatedPlayers = generateRandomPositions(this.players());
    this.store.dispatch(PlayerActions.setPlayers({ players: updatedPlayers }));
  }

  public movePlayer(direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') {
    const currentUser = this.currentUser();

    if (!currentUser) return;

    const newPos = calculateNewPosition(currentUser, direction);

    if (newPos) {
      this.signalrService.invoke('MovePlayer', { x: newPos.x, y: newPos.y });
      console.log(
        `Player ${currentUser.name} moved: ${direction} to (${newPos.x}, ${newPos.y})`,
      );

      this.store.dispatch(
        PlayerActions.updatePlayerPosition({
          name: currentUser.name,
          x: newPos.x,
          y: newPos.y,
        }),
      );
    }
  }

  public addPlayer(newPlayer: Player) {
    this.store.dispatch(PlayerActions.addPlayer({ player: newPlayer }));
  }

  public removePlayer(name: string) {
    this.store.dispatch(PlayerActions.removePlayer({ name }));
  }

  public updatePlayerPosition(name: string, x: number, y: number) {
    this.store.dispatch(PlayerActions.updatePlayerPosition({ name, x, y }));
  }
}
