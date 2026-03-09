import { Injectable, inject, signal } from '@angular/core';
import { SignalrService } from '../../../core/services/signalr.service';
import { GameService } from './game.service';

@Injectable()
export class GameBoardService {
  private signalrService = inject(SignalrService);
  private gameService = inject(GameService);

  public gameOverData = signal<any>(null);

  private readonly events = [
    'GameTick',
    'MapUpdated',
    'SyncGameState',
    'BulletSpawned',
    'GameOver',
  ];

  connect(roomId: string): void {
    this.signalrService.on('GameTick', (state: any) => {
      this.gameService.updateFromTick(state);
    });

    this.signalrService.on('MapUpdated', (map: number[][]) => {
      this.gameService.mapMatrix.set(map);
    });

    this.signalrService.on('SyncGameState', (gameState: any) => {
      if (gameState?.mapLayout) {
        this.gameService.mapMatrix.set(gameState.mapLayout);
      }
      if (gameState?.players) {
        this.gameService.players.set(Object.values(gameState.players) as any[]);
      }
      if (gameState?.bullets) {
        this.gameService.bullets.set(Object.values(gameState.bullets) as any[]);
      }
    });

    this.signalrService.on('BulletSpawned', (bullet: any) => {
      this.gameService.bullets.update((bullets) => [...bullets, bullet]);
    });

    this.signalrService.on('GameOver', (data: any) => {
      this.gameOverData.set(data);
    });
  }

  disconnect(roomId: string): void {
    this.signalrService.invoke('LeaveGame', roomId);
    this.events.forEach((event) => this.signalrService.off(event));
  }

  changeDirection(roomId: string, direction: string): void {
    this.signalrService
      .invoke('ChangeDirection', roomId, direction)
      .catch((err) => console.error('ChangeDirection error:', err));
  }

  shoot(roomId: string): void {
    this.signalrService
      .invoke('Shoot', roomId)
      .catch((err) => console.error('Shoot error:', err));
  }
}
