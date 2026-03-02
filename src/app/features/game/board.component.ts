import { Component, inject } from '@angular/core';
import { ChatComponent } from '../../shared/components/chat/chat.component';
import { GameService } from './services/game.service';
import { TankComponent } from './components/tank/tank.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [ChatComponent, TankComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  private gameService = inject(GameService);
  mapName = 'Default Map';
  mapMatrix = this.gameService.mapMatrix;
  players = this.gameService.players;
}
