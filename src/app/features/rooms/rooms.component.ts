import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoomService } from './services/room.service';
import { Room } from '../../shared/models/room.model';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss',
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];

  constructor(
    private roomService: RoomService,
    private router: Router,
  ) {}

  readonly statusMap: Record<string, string> = {
    Open: 'Open',
    Closed: 'Closed',
    Cancelled: 'Cancelled',
  };

  ngOnInit(): void {
    this.roomService.getRooms().subscribe({
      next: (data) => {
        this.rooms = data;
      },
      error: (error) => {
        console.error('Error fetching rooms:', error);
      },
    });
  }

  joinRoom(roomId: string): void {
    this.roomService.joinRoom(roomId).subscribe({
      next: () => {
        this.router.navigate(['/waiting-room', roomId]);
      },
      error: (error) => {
        console.error('Error joining room:', error);
      },
    });
  }

  isModalOpen = false;
  newRoom = {
    name: '',
    maxPlayers: 4,
  };

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.newRoom = { name: '', maxPlayers: 4 };
  }

  createRoom() {
    console.log('Creating room:', this.newRoom);
    this.roomService.createRoom(this.newRoom.name).subscribe({
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
