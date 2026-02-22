import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { RoomService } from '../search-room/services/search-room.service';

//TODO: Refactor
@Component({
  selector: 'app-play',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    ButtonComponent,
    ToastComponent,
  ],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss',
})
export class PlayComponent {
  isModalOpen = false;
  newRoom = {
    name: '',
    maxPlayers: 2,
  };

  isJoinModalOpen = false;
  isJoining = false;
  joinRoomId = '';
  joinRoomError: string | null = null;

  isRedirectModalOpen = false;
  activeRoomId = '';

  constructor(
    private router: Router,
    private roomService: RoomService,
  ) {}

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.newRoom = { name: '', maxPlayers: 2 };
  }

  createRoom() {
    this.roomService
      .createRoom(this.newRoom.name, this.newRoom.maxPlayers)
      .subscribe({
        next: (room) => {
          this.closeModal();
          if (room && room.id) {
            this.router.navigate(['/waiting-room', room.id]);
          }
        },
        error: (error) => {
          console.error('Error creating room:', error);
        },
      });
  }

  openJoinModal() {
    this.isJoinModalOpen = true;
  }

  closeJoinModal() {
    this.isJoinModalOpen = false;
    this.isJoining = false;
    this.joinRoomId = '';
    this.joinRoomError = null;
  }

  joinRoomById() {
    const rawId = this.joinRoomId?.trim();
    if (this.isJoining || !rawId) return;

    this.isJoining = true;
    this.joinRoomError = null;

    this.roomService.joinRoom(rawId).subscribe({
      next: () => {
        this.isJoining = false;
        this.closeJoinModal();
        this.router.navigate(['/waiting-room', rawId]);
      },
      error: (error) => {
        this.isJoining = false;
        console.error('Error joining room:', error);

        let errorMessage = 'An error occurred while joining the room.';

        if (error.error && error.error.message) {
          errorMessage = error.error.detail;
        } else if (error.status === 400 || error.status === 404) {
          errorMessage = 'The room ID is invalid or does not exist.';
        }

        if (errorMessage.startsWith('User is already')) {
          this.router.navigate(['/waiting-room', rawId]);
        } else if (errorMessage.startsWith('User belongs')) {
          this.activeRoomId = errorMessage.split(':')[1];
          this.closeJoinModal();
          this.isRedirectModalOpen = true;
        } else {
          this.joinRoomError = errorMessage;
        }
      },
    });
  }

  redirectToActiveRoom() {
    this.isRedirectModalOpen = false;
    this.router.navigate(['/waiting-room', this.activeRoomId]);
  }

  closeRedirectModal() {
    this.isRedirectModalOpen = false;
    this.activeRoomId = '';
  }
}
