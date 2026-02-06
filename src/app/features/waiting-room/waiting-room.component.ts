import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { ChatComponent } from '../game/components/chat/chat.component';
import { GameService } from '../game/services/game.service';

@Component({
  selector: 'app-waiting-room',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatComponent],
  templateUrl: './waiting-room.component.html',
  styleUrl: './waiting-room.component.scss',
})
export class WaitingRoomComponent {
  private gameService = inject(GameService);
  private router = inject(Router);

  roomName = this.gameService.roomName;
  mapName = this.gameService.mapName;
  roomId = this.gameService.roomId;

  get players() {
    return this.gameService.players();
  }

  startGame() {
    this.gameService.assignPositions();
    this.router.navigate(['/game']);
  }
}
