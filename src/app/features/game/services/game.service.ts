import { Injectable, signal, inject, WritableSignal } from '@angular/core';

import { Player } from '../../../shared/models/player.model';
import {
  calculateNewPosition,
  generateRandomPositions,
  MAP_MATRIX,
} from '../../../shared/utils/game-logic.utils';
import { SignalrService } from '../../../core/services/signalr.service';
import { PlayerStore } from '../../../shared/store/player.store';


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
  private playerStore = inject(PlayerStore);

  readonly players = this.playerStore.players;
  readonly currentUser = this.playerStore.currentUser;

  public async joinGame(roomId: string) {
    await this.signalrService.joinGame(roomId);
  }

  public async leaveGame(roomId: string) {
    await this.signalrService.leaveGame(roomId);
  }

  public mapMatrix: WritableSignal<number[][]> = signal(
    JSON.parse(JSON.stringify(MAP_MATRIX)),
  );
  public bullets = signal<Bullet[]>([]);

  public score = signal(0);
  private lastShotTime = 0;
  private readonly SHOOT_COOLDOWN = 500;

  constructor() {
    this.startGameLoop();
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

        if (nextX >= 1 && nextX <= 24 && nextY >= 1 && nextY <= 16) {
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
        } else {
          continue;
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

  public assignPositions() {
    const updatedPlayers = generateRandomPositions(this.players());
    this.playerStore.setPlayers(updatedPlayers);
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

    this.playerStore.updatePlayerPosition(currentUser.name, x, y, direction);
  }

  public addPlayer(newPlayer: Player) {
    this.playerStore.addPlayer(newPlayer);
  }

  public removePlayer(name: string) {
    this.playerStore.removePlayer(name);
  }

  public updatePlayerPosition(name: string, x: number, y: number) {
    this.playerStore.updatePlayerPosition(name, x, y);
  }
}
