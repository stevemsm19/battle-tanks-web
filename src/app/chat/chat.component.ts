import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignalRService } from '../services/signalr.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit {

  user: string = '';
  message: string = '';
  messages: string[] = [];

  constructor(private signalRService: SignalRService) {}

  ngOnInit(): void {
    this.signalRService.startConnection();

    this.signalRService.onMessageReceived((user, message) => {
      this.messages.push(`${user}: ${message}`);
    });
  }

  sendMessage(): void {
    if (this.user && this.message) {
      this.signalRService.sendMessage(this.user, this.message);
      this.message = '';
    }
  }
}