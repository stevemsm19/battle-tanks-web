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
  providedIn: 'root'
})
export class TankService {

  private listeners: ((data: TankMovement) => void)[] = [];

  /**
   * Simula el envío de movimiento al servidor
   */
  sendMovement(movement: TankMovement): void {
    console.log('Movimiento enviado al servidor:', movement);

    // Simulación: otro jugador recibe el evento
    setTimeout(() => {
      this.listeners.forEach(callback =>
        callback({
          playerId: 'Jugador-2',
          direction: movement.direction,
          position: movement.position
        })
      );
    }, 500);
  }

  /**
   * Simula la recepción de movimientos desde otros jugadores
   */
  onMovementReceived(callback: (data: TankMovement) => void): void {
    this.listeners.push(callback);
  }
}