import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../services/game.service';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-waiting-room',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatComponent],
  templateUrl: './waiting-room.component.html',
  styleUrl: './waiting-room.component.scss',
})
export class WaitingRoomComponent {
  private gameService = inject(GameService);

  roomName = 'TEST';
  mapName = 'MAPA 1';
  roomId = '1';

  get players() {
    return this.gameService.players();
  }
}
