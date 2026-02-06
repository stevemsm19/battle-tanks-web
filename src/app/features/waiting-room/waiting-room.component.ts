import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { ChatComponent } from '../game/components/chat/chat.component';
import { WaitingRoomService } from './services/waiting-room.service';

@Component({
  selector: 'app-waiting-room',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatComponent],
  templateUrl: './waiting-room.component.html',
  styleUrl: './waiting-room.component.scss',
})
export class WaitingRoomComponent implements OnInit {
  private waitingRoomService = inject(WaitingRoomService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  roomName = this.waitingRoomService.roomName;
  mapName = this.waitingRoomService.mapName;
  roomId = this.waitingRoomService.roomId;

  get players() {
    return this.waitingRoomService.players();
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.waitingRoomService.loadRoomDetails(id);
      }
    });
  }

  startGame() {
    this.router.navigate(['/game']);
  }
}
