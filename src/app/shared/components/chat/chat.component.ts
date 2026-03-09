import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignalrService } from '../../../core/services/signalr.service';
import { ChatStore, ChatMessage } from './store/chat.store';
import { AuthStore } from '../../../core/auth/store/auth.store';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() roomId: string = '';

  private signalrService = inject(SignalrService);
  private chatStore = inject(ChatStore);
  private authStore = inject(AuthStore);

  messages = this.chatStore.messages;
  newMessage = '';

  get currentUserId(): string {
    return this.authStore.user()?.uid ?? '';
  }

  ngOnInit() {
    this.chatStore.clearMessages();
    this.signalrService.on('ReceiveMessage', (data: any) => {
      const message: ChatMessage = {
        senderId: data.senderId ?? 'unknown',
        sender: data.sender ?? 'Unknown',
        text: data.text ?? '',
        time: data.time
          ? new Date(data.time).toLocaleTimeString()
          : new Date().toLocaleTimeString(),
      };
      this.chatStore.addMessage(message);
    });
  }

  ngOnDestroy() {
    this.signalrService.off('ReceiveMessage');
  }

  sendMessage() {
    const text = this.newMessage.trim();
    if (!text) return;

    const fb = this.authStore.user();
    const senderName = fb?.displayName ?? fb?.email ?? 'Unknown User';

    this.signalrService
      .invoke('SendMessage', this.roomId, senderName, text)
      .catch((err) => console.error('[ChatComponent] SendMessage error:', err));

    this.newMessage = '';
  }
}
