import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { RoomService } from '../search-room/services/search-room.service';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, ButtonComponent],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss',
})
export class PlayComponent {
  isModalOpen = false;
  newRoom = {
    name: '',
    maxPlayers: 2,
  };

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
}
