import { Injectable, signal, inject, WritableSignal } from '@angular/core';

import { Player } from '../../../shared/models/player.model';
import { Store } from '@ngrx/store';
import * as PlayerActions from '../../../store/actions/player.actions';
import {
  selectAllPlayers,
  selectCurrentUser,
} from '../../../store/selector/player.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  calculateNewPosition,
  generateRandomPositions,
  MAP_MATRIX,
} from '../../../shared/utils/game-logic.utils';
import {
  simulateIncomingPlayers,
  simulateIncomingMessages,
} from "../../../shared/utils/simulation.utils"
import { SignalrService } from '../../../core/services/signalr.service';

export interface ChatMessage {
  senderId: string;
  sender: string;
  text: string;
  time: string;
}

export interface Bullet {
  id: string;
  x: number;
  y: number;
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  ownerId: string;
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

  public mapMatrix: WritableSignal<number[][]> = signal(
    JSON.parse(JSON.stringify(MAP_MATRIX)),
  );
  public bullets = signal<Bullet[]>([]);

  public messages = signal<ChatMessage[]>([]);
  public score = signal(0);

  private lastShotTime = 0;
  private readonly SHOOT_COOLDOWN = 500;

  constructor() {
    this.addListeners();

    //TODO: Remove when backend is ready
    this.startSimulations();
    this.startGameLoop();
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
    let mockPlayers: Player[] = [
      { id: '1', name: 'STEVENSM19', status: 'ready', x: 0, y: 0 },
      { id: '2', name: 'PIPE123', status: 'ready', x: 0, y: 0 },
      { id: '3', name: 'TU_MOM12', status: 'ready', x: 0, y: 0 },
    ];

    mockPlayers = generateRandomPositions(mockPlayers);

    simulateIncomingPlayers(this.store, mockPlayers);

    const mockMessages: ChatMessage[] = [
      { senderId: '1', sender: 'STEVENSM19', text: 'LISTOS?', time: '13:02' },
      { senderId: '2', sender: 'PIPE123', text: 'YA TU SABE', time: '13:03' },
      { senderId: '3', sender: 'TU_MOM12', text: 'FALTA UNO', time: '13:05' },
    ];
    simulateIncomingMessages(mockMessages, (msg) => this.addMessage(msg));
  }

  private startGameLoop() {
    setInterval(() => {
      this.updateBullets();
    }, 50);
  }

  private updateBullets() {
    this.bullets.update((currentBullets) => {
      const remainingBullets: Bullet[] = [];
      const BULLET_SIZE = 0.4;

      for (const bullet of currentBullets) {
        const speed = 0.5;
        let nextX = bullet.x;
        let nextY = bullet.y;

        switch (bullet.direction) {
          case 'UP':
            nextY -= speed;
            break;
          case 'DOWN':
            nextY += speed;
            break;
          case 'LEFT':
            nextX -= speed;
            break;
          case 'RIGHT':
            nextX += speed;
            break;
        }

        if (nextX < 1 || nextX > 24 || nextY < 1 || nextY > 16) {
          continue;
        }
        const startCol = Math.floor(nextX - 1);
        const endCol = Math.floor(nextX - 1 + BULLET_SIZE);
        const startRow = Math.floor(nextY - 1);
        const endRow = Math.floor(nextY - 1 + BULLET_SIZE);

        let hit = false;

        collisionLoop: for (let r = startRow; r <= endRow; r++) {
          for (let c = startCol; c <= endCol; c++) {
            if (r >= 0 && r < 16 && c >= 0 && c < 24) {
              const cell = this.mapMatrix()[r][c];
              if (cell === 1) {
                hit = true;
                break collisionLoop;
              } else if (cell === 2) {
                hit = true;
                this.destroyWall(r, c);
                break collisionLoop;
              }
            }
          }
        }

        if (hit) continue;

        remainingBullets.push({ ...bullet, x: nextX, y: nextY });
      }

      return remainingBullets;
    });
  }

  private destroyWall(row: number, col: number) {
    this.mapMatrix.update((matrix) => {
      const newMatrix = [...matrix];
      newMatrix[row] = [...newMatrix[row]];
      newMatrix[row][col] = 0;
      return newMatrix;
    });

    this.score.update((s) => s + 10);
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

    const newPos = calculateNewPosition(
      currentUser,
      direction,
      this.mapMatrix(),
    );
    if (newPos) {
      this.reportPlayerMove(newPos.x, newPos.y, direction);
    }
  }

  public shoot() {
    const user = this.currentUser();
    if (!user || !user.x || !user.y) return;
  }

  public shootDirection(direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') {
    const user = this.currentUser();
    if (!user || !user.x || !user.y) return;

    const now = Date.now();
    if (now - this.lastShotTime < this.SHOOT_COOLDOWN) return;

    this.lastShotTime = now;

    const bullet: Bullet = {
      id: Math.random().toString(36),
      x: user.x,
      y: user.y,
      direction,
      ownerId: user.id,
    };

    this.bullets.update((b) => [...b, bullet]);
  }

  public reportPlayerMove(
    x: number,
    y: number,
    direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT',
  ) {
    const currentUser = this.currentUser();
    if (!currentUser) return;

    this.signalrService.invoke('MovePlayer', { x, y, direction });
    console.log(
      `Player ${currentUser.name} moved to (${x}, ${y}) facing ${direction}`,
    );

    this.store.dispatch(
      PlayerActions.updatePlayerPosition({
        name: currentUser.name,
        x,
        y,
        direction,
      }),
    );
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
