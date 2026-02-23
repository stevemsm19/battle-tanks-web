import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WaitingRoomService } from './services/waiting-room.service';
import { ChatComponent } from '../../shared/components/chat/chat.component';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-waiting-room',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ChatComponent,
    ConfirmationModalComponent,
    ButtonComponent,
  ],
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
  isLeaving = signal(false);
  isLeaveModalOpen = signal(false);
  isInviteModalOpen = signal(false);
  copyFeedback = signal('');

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

  leaveRoom(): void {
    this.isLeaveModalOpen.set(true);
  }

  confirmLeave(): void {
    this.isLeaveModalOpen.set(false);
    if (this.isLeaving()) return;
    this.isLeaving.set(true);

    this.waitingRoomService.leaveRoom().subscribe({
      next: () => {
        this.router.navigate(['/play']);
      },
      error: (err) => {
        this.isLeaving.set(false);
        console.error('Error leaving room:', err);
      },
    });
  }
  get inviteMessage(): string {
    return (
      'To invite a friend, copy and share this room code: ' + this.roomId()
    );
  }

  copyRoomCode(): void {
    navigator.clipboard.writeText(this.roomId()).then(() => {
      this.copyFeedback.set('Code copied to clipboard!');
      setTimeout(() => {
        this.isInviteModalOpen.set(false);
        this.copyFeedback.set('');
      }, 2000);
    });
  }
}
