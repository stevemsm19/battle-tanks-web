import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  HostListener,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatComponent } from '../../shared/components/chat/chat.component';
import { GameService } from './services/game.service';
import { GameBoardService } from './services/game-board.service';
import { TankComponent } from './components/tank/tank.component';
import { AuthStore } from '../../core/auth/store/auth.store';
import { ButtonComponent } from '../../shared/components/button/button.component';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'NONE';

const KEY_MAP: Record<string, Direction> = {
  ArrowUp: 'UP',
  KeyW: 'UP',
  ArrowDown: 'DOWN',
  KeyS: 'DOWN',
  ArrowLeft: 'LEFT',
  KeyA: 'LEFT',
  ArrowRight: 'RIGHT',
  KeyD: 'RIGHT',
};

@Component({
  selector: 'app-board',
  imports: [TankComponent, ChatComponent, CommonModule, ButtonComponent],
  providers: [GameBoardService],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit, OnDestroy {
  private gameService = inject(GameService);
  private gameBoardService = inject(GameBoardService);
  private route = inject(ActivatedRoute);
  private authStore = inject(AuthStore);
  private router = inject(Router);

  mapName = 'Default Map';
  mapMatrix = this.gameService.mapMatrix;
  players = this.gameService.players;
  bullets = this.gameService.bullets;
  gameOverData = this.gameBoardService.gameOverData;

  currentPlayer = computed(() => {
    const uid = this.authStore.user()?.uid;
    const list = this.players();
    if (!uid || list.length === 0) return null;
    return list.find((p: any) => p.externalId === uid) || null;
  });

  roomId = '';
  private heldKeys: Direction[] = [];

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('id') ?? '';
    this.gameBoardService.connect(this.roomId);
  }

  ngOnDestroy(): void {
    this.gameBoardService.disconnect(this.roomId);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.gameOverData()) return;

    if (event.code === 'Space') {
      event.preventDefault();
      this.gameBoardService.shoot(this.roomId);
      return;
    }

    const dir = KEY_MAP[event.code];
    if (!dir || this.heldKeys.at(-1) === dir) return;
    this.heldKeys = this.heldKeys.filter((d) => d !== dir);
    this.heldKeys.push(dir);
    this.gameBoardService.changeDirection(this.roomId, dir);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    if (this.gameOverData()) return;

    const dir = KEY_MAP[event.code];
    if (!dir) return;
    this.heldKeys = this.heldKeys.filter((d) => d !== dir);
    this.gameBoardService.changeDirection(
      this.roomId,
      this.heldKeys.at(-1) ?? 'NONE',
    );
  }

  getHealthClass(health: number): string {
    if (health > 60) return 'high';
    if (health > 30) return 'medium';
    return 'low';
  }

  padScore(score: number): string {
    return String(score || 0).padStart(6, '0');
  }

  returnToSearchRoom(): void {
    this.router.navigate(['/search-room']);
  }
}
