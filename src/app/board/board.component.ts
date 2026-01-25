import {
  Component,
  inject,
  computed,
  HostListener,
  signal,
} from '@angular/core';
import { GameService } from '../services/game.service';
import { ChatComponent } from '../chat/chat.component';
import { LowerCasePipe } from '@angular/common';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [ChatComponent, LowerCasePipe],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  private gameService = inject(GameService);
  mapName = this.gameService.mapName;
  currentUser = this.gameService.currentUser;

  mapMatrix = this.gameService.mapMatrix;
  bullets = this.gameService.bullets;
  score = this.gameService.score;

  formattedScore = computed(() => {
    return this.score().toString().padStart(5, '0');
  });

  private lastDirection: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' = 'UP';

  health = signal(100);

  healthStatus = computed(() => {
    const h = this.health();
    if (h > 50) return 'high';
    if (h > 20) return 'medium';
    return 'low';
  });

  activePlayers = computed(() => {
    return this.gameService.players().filter((p) => p.status !== 'empty');
  });

  takeDamage() {
    this.health.update((h) => Math.max(0, h - 20));
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const user = this.currentUser();
    if (!user) return;

    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.lastDirection = 'UP';
        this.gameService.movePlayer('UP');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.lastDirection = 'DOWN';
        this.gameService.movePlayer('DOWN');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.lastDirection = 'LEFT';
        this.gameService.movePlayer('LEFT');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.lastDirection = 'RIGHT';
        this.gameService.movePlayer('RIGHT');
        break;
      case ' ':
        this.gameService.shootDirection(this.lastDirection);
        break;
    }
  }
}
