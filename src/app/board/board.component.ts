import { Component, inject, computed, HostListener } from '@angular/core';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  private gameService = inject(GameService);
  mapName = this.gameService.mapName;

  activePlayers = computed(() => {
    return this.gameService.players().filter((p) => p.status !== 'empty');
  });

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.gameService.movePlayer('UP');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.gameService.movePlayer('DOWN');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.gameService.movePlayer('LEFT');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.gameService.movePlayer('RIGHT');
        break;
    }
  }
}
