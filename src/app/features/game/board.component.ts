import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatComponent } from '../../shared/components/chat/chat.component';
import { GameService } from './services/game.service';
import { TankComponent } from './components/tank/tank.component';
import { SignalrService } from '../../core/services/signalr.service';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'NONE';

const KEY_MAP: Record<string, Direction> = {
  ArrowUp: 'UP',
  w: 'UP',
  ArrowDown: 'DOWN',
  s: 'DOWN',
  ArrowLeft: 'LEFT',
  a: 'LEFT',
  ArrowRight: 'RIGHT',
  d: 'RIGHT',
};

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [ChatComponent, TankComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit, OnDestroy {
  private gameService = inject(GameService);
  private signalrService = inject(SignalrService);
  private route = inject(ActivatedRoute);

  mapName = 'Default Map';
  mapMatrix = this.gameService.mapMatrix;
  players = this.gameService.players;

  roomId = '';
  private heldKeys: Direction[] = [];

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('id') ?? '';
    this.signalrService.on('GameTick', (data: { players: any[] }) => {
      this.gameService.updatePlayers(data.players);
    });
  }

  ngOnDestroy(): void {
    this.signalrService.invoke('LeaveGame', this.roomId);
    this.signalrService.off('GameTick');
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const dir = KEY_MAP[event.key];
    if (!dir || this.heldKeys.at(-1) === dir) return;

    this.heldKeys = this.heldKeys.filter((d) => d !== dir);
    this.heldKeys.push(dir);
    this.sendDirection(dir);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    const dir = KEY_MAP[event.key];
    if (!dir) return;

    this.heldKeys = this.heldKeys.filter((d) => d !== dir);
    const active: Direction = this.heldKeys.at(-1) ?? 'NONE';
    this.sendDirection(active);
  }

  private sendDirection(direction: Direction): void {
    this.signalrService
      .invoke('ChangeDirection', this.roomId, direction)
      .catch((err) => console.error('ChangeDirection error:', err));
  }
}
