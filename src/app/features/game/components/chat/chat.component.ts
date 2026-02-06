import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WaitingRoomService } from '../../../../features/waiting-room/services/waiting-room.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  private waitingRoomService = inject(WaitingRoomService);

  get messages() {
    return this.waitingRoomService.messages();
  }

  newMessage = '';

  currentUserId = this.waitingRoomService.currentUserId;

  sendMessage() {
    if (this.newMessage.trim()) {
      this.newMessage = '';
    }
  }
}
