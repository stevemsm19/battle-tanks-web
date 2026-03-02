import { Injectable, signal, inject, WritableSignal } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class GameService {
  public mapMatrix: WritableSignal<number[][]> = signal([]);
  public players: WritableSignal<any[]> = signal([]);

  public initializeGame(map: number[][], players: any[]): void {
    this.mapMatrix.set(map);
    this.players.set(players);
  }

  public updatePlayers(players: any[]): void {
    this.players.set(players);
  }
}
