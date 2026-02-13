import { Injectable } from '@angular/core';

interface TankMovement {
  playerId: string;
  direction: string;
  position: {
    x: number;
    y: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class TankService {
  private listeners: ((data: TankMovement) => void)[] = [];

  sendMovement(movement: TankMovement): void {
    console.log('Movimiento enviado al servidor:', movement);

    setTimeout(() => {
      this.listeners.forEach((callback) =>
        callback({
          playerId: 'Player-2',
          direction: movement.direction,
          position: movement.position,
        }),
      );
    }, 500);
  }

    onMovementReceived(callback: (data: TankMovement) => void): void {
    this.listeners.push(callback);
  }
}
