import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  private gameService = inject(GameService);

  get messages() {
    return this.gameService.messages();
  }

  newMessage = '';

  currentUserId = this.gameService.currentUserId;

  sendMessage() {
    if (this.newMessage.trim()) {
      this.gameService.sendMessage(this.newMessage);
      this.newMessage = '';
    }
  }
}
