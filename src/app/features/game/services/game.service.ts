import { Injectable, signal, inject, WritableSignal } from '@angular/core';

import {
  MAP_MATRIX,
} from '../../../shared/utils/game-logic.utils';


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
  public mapMatrix: WritableSignal<number[][]> = signal(
    JSON.parse(JSON.stringify(MAP_MATRIX)),
  );
}
