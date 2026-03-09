import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  public mapMatrix: WritableSignal<number[][]> = signal([], {
    equal: (a, b) => JSON.stringify(a) === JSON.stringify(b),
  });
  public players: WritableSignal<any[]> = signal([]);
  public bullets: WritableSignal<any[]> = signal([]);

  public initializeGame(map: number[][], players: any[]): void {
    this.mapMatrix.set(map);
    this.players.set(players);
    this.bullets.set([]);
  }

  public updateFromTick(tick: { players: any[]; bullets: any[] }): void {
    this.players.set(tick.players);
    this.bullets.set(tick.bullets ?? []);
  }

  /** @deprecated use updateFromTick */
  public updatePlayers(players: any[]): void {
    this.players.set(players);
  }
}