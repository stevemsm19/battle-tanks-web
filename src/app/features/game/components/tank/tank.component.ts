import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TankService } from '../../services/tank.service';

@Component({
  selector: 'app-tank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tank.component.html',
  styleUrl: './tank.component.scss',
})
export class TankComponent implements OnInit {
  position = { x: 100, y: 100 };
  playerId = 'Jugador-1';

  constructor(private tankService: TankService) {}

  ngOnInit(): void {
    this.tankService.onMovementReceived((data) => {
      console.log(`Movimiento recibido de ${data.playerId}:`, data.direction);
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowUp':
        this.move('UP');
        break;
      case 'ArrowDown':
        this.move('DOWN');
        break;
      case 'ArrowLeft':
        this.move('LEFT');
        break;
      case 'ArrowRight':
        this.move('RIGHT');
        break;
    }
  }

  move(direction: string): void {
    const step = 10;

    switch (direction) {
      case 'UP':
        this.position.y -= step;
        break;
      case 'DOWN':
        this.position.y += step;
        break;
      case 'LEFT':
        this.position.x -= step;
        break;
      case 'RIGHT':
        this.position.x += step;
        break;
    }

    this.tankService.sendMovement({
      playerId: this.playerId,
      direction,
      position: { ...this.position },
    });
  }
}
