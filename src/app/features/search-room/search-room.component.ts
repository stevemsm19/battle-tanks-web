import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Room } from '../../shared/models/room.model';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';
import { SignalrService } from '../../core/services/signalr.service';
import { SearchRoomStore } from './store/search-room.store';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    ConfirmationModalComponent,
    PageTitleComponent,
  ],
  templateUrl: './search-room.component.html',
  styleUrl: './search-room.component.scss',
  providers: [SearchRoomStore],
})
export class SearchRoomComponent implements OnInit, OnDestroy {
  private readonly store = inject(SearchRoomStore);
  private readonly signalrService = inject(SignalrService);
  private readonly router = inject(Router);

  readonly rooms = this.store.rooms;
  readonly isRedirectModalOpen = this.store.isRedirectModalOpen;

  isModalOpen = signal(false);

  readonly statusMap: Record<string, string> = {
    Open: 'Open',
    Closed: 'Closed',
    Cancelled: 'Cancelled',
  };

  ngOnInit(): void {
    this.store.loadRooms();

    this.signalrService.startConnection().then(() => {
      this.signalrService.joinSearchRoom();
      this.signalrService.on('RoomCreated', (room: Room) => {
        this.store.addRoom(room);
      });
    });
  }

  ngOnDestroy(): void {
    this.signalrService.leaveSearchRoom();
    this.signalrService.off('RoomCreated');
  }

  joinRoom(roomId: string): void {
    this.store.joinRoom(roomId);
  }

  redirectToActiveRoom(): void {
    this.store.redirectToActiveRoom();
  }

  closeRedirectModal(): void {
    this.store.closeRedirectModal();
  }

  goBack(): void {
    this.router.navigate(['/play']);
  }
}
