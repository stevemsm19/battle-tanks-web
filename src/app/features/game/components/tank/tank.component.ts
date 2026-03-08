import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tank',
  standalone: true,
  imports: [],
  templateUrl: './tank.component.html',
  styleUrl: './tank.component.scss',
})
export class TankComponent {
  @Input() x: number = 0;
  @Input() y: number = 0;
  private _direction: string = 'UP';
  private _lastValidDirection: string = 'up';

  @Input()
  set direction(value: string) {
    this._direction = value;
    const lower = value?.toLowerCase();
    if (['up', 'down', 'left', 'right'].includes(lower)) {
      this._lastValidDirection = lower;
    }
  }

  get direction(): string {
    return this._direction;
  }

  @Input() name: string = '';
  @Input() health: number = 100;

  get directionClass(): string {
    return this._lastValidDirection;
  }

  get healthClass(): string {
    if (this.health > 60) return 'high';
    if (this.health > 30) return 'medium';
    return 'low';
  }
}
