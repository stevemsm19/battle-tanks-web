import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../services/game.service';
import { ChatComponent } from '../chat/chat.component';
import { Router } from '@angular/router';

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
