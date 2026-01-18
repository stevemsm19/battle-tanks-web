import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TankComponent } from './tank/tank.component';
import { PlayersComponent } from './players/players.component';

import { WaitingRoomComponent } from './waiting-room/waiting-room.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    TankComponent,
    PlayersComponent,
    WaitingRoomComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'BattleTanks-Frontend';
}
