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
  @Input() direction: string = 'UP';
  @Input() name: string = '';
  @Input() health: number = 100;
}
