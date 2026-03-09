import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  HostListener,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChatComponent } from '../../shared/components/chat/chat.component';
import { GameService } from './services/game.service';
import { TankComponent } from './components/tank/tank.component';
import { SignalrService } from '../../core/services/signalr.service';
import { AuthStore } from '../../core/auth/store/auth.store';
import { Router } from '@angular/router';
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
  standalone: true,
  imports: [TankComponent, ChatComponent, CommonModule, ButtonComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit, OnDestroy {
  private gameService = inject(GameService);
  private signalrService = inject(SignalrService);
  private route = inject(ActivatedRoute);
  private authStore = inject(AuthStore);
  private router = inject(Router);

  mapName = 'Default Map';
  mapMatrix = this.gameService.mapMatrix;
  players = this.gameService.players;
  bullets = this.gameService.bullets;

  currentUser = this.authStore.user;

  currentPlayer = computed(() => {
    const uid = this.currentUser()?.uid;
    const list = this.players();

    if (!uid || list.length === 0) return null;

    return (
      list.find((p: any) => {
        const isMatch = p.firebaseUid === uid;
        return isMatch;
      }) || null
    );
  });

  gameOverData = signal<any>(null);

  roomId = '';
  private heldKeys: Direction[] = [];

  ngOnInit(): void {
    console.log(this.players());
    this.roomId = this.route.snapshot.paramMap.get('id') ?? '';

    this.signalrService.on('GameTick', (state: any) => {
      this.players.set(state.players);
      this.bullets.set(state.bullets);
    });

    this.signalrService.on('MapUpdated', (map: number[][]) => {
      this.gameService.mapMatrix.set(map);
    });

    this.signalrService.onBulletSpawned((bullet: any) => {
      this.bullets.update((bullets) => [...bullets, bullet]);
    });

    this.signalrService.on('GameOver', (data: any) => {
      this.gameOverData.set(data);
    });
  }

  ngOnDestroy(): void {
    this.signalrService.invoke('LeaveGame', this.roomId);
    this.signalrService.off('GameTick');
    this.signalrService.off('MapUpdated');
    this.signalrService.off('BulletSpawned');
    this.signalrService.off('GameOver');
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.gameOverData()) return;

    if (event.code === 'Space') {
      event.preventDefault();
      this.signalrService
        .invoke('Shoot', this.roomId)
        .catch((err) => console.error('Shoot error:', err));
      return;
    }

    const dir = KEY_MAP[event.code];
    if (!dir || this.heldKeys.at(-1) === dir) return;
    this.heldKeys = this.heldKeys.filter((d) => d !== dir);
    this.heldKeys.push(dir);
    this.sendDirection(dir);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    if (this.gameOverData()) return;

    const dir = KEY_MAP[event.code];
    if (!dir) return;
    this.heldKeys = this.heldKeys.filter((d) => d !== dir);
    this.sendDirection(this.heldKeys.at(-1) ?? 'NONE');
  }

  private sendDirection(direction: Direction): void {
    this.signalrService
      .invoke('ChangeDirection', this.roomId, direction)
      .catch((err) => console.error('ChangeDirection error:', err));
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
