import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { TankComponent } from './tank/tank.component';
import { PlayersComponent } from './players/players.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ChatComponent, TankComponent, PlayersComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'BattleTanks-Frontend';
}
