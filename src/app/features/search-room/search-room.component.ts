import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoomService } from './services/search-room.service';
import { Room } from '../../shared/models/room.model';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SignalrService } from '../../core/services/signalr.service';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './search-room.component.html',
  styleUrl: './search-room.component.scss',
})
export class SearchRoomComponent implements OnInit, OnDestroy {
  rooms: Room[] = [];

  constructor(
    private roomService: RoomService,
    private router: Router,
    private signalrService: SignalrService,
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

    this.signalrService.startConnection().then(() => {
      this.signalrService.joinSearchRoom();
      this.signalrService.on('RoomCreated', (room: Room) => {
        this.rooms.push(room);
      });
    });
  }

  ngOnDestroy(): void {
    this.signalrService.leaveSearchRoom();
    this.signalrService.off('RoomCreated');
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
  isCreating = false;
  newRoom = {
    name: '',
    maxPlayers: 4,
  };

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.isCreating = false;
    this.newRoom = { name: '', maxPlayers: 4 };
  }

  createRoom() {
    if (this.isCreating) return;
    this.isCreating = true;
    console.log('Creating room:', this.newRoom);
    this.roomService
      .createRoom(this.newRoom.name, this.newRoom.maxPlayers)
      .subscribe({
        next: (room) => {
          this.isCreating = false;
          this.closeModal();
          if (room && room.id) {
            this.router.navigate(['/waiting-room', room.id]);
          }
        },
        error: (error) => {
          this.isCreating = false;
          console.error('Error creating room:', error);
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/play']);
  }
}
