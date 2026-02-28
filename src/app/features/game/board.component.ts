import {
  Component,
  inject,
  computed,
  HostListener,
  signal,
} from '@angular/core';

import { LowerCasePipe } from '@angular/common';
import { ChatComponent } from '../../shared/components/chat/chat.component';
import { GameService } from './services/game.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [ChatComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  private gameService = inject(GameService);
  mapName = 'Default Map';
  mapMatrix = this.gameService.mapMatrix;
}
