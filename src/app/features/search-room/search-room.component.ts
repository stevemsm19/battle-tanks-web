import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  inject,
  signal,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Room } from './models/room.model';
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
export class SearchRoomComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly store = inject(SearchRoomStore);
  private readonly signalrService = inject(SignalrService);
  private readonly router = inject(Router);

  @ViewChild('endOfList') endOfList!: ElementRef<HTMLElement>;

  private observer!: IntersectionObserver;

  readonly rooms = this.store.rooms;
  readonly isRedirectModalOpen = this.store.isRedirectModalOpen;
  readonly isLoadingMore = this.store.isLoadingMore;
  readonly hasNextPage = this.store.hasNextPage;

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
      this.signalrService.on(
        'RoomStatusChanged',
        (data: { roomId: string }) => {
          this.store.removeRoom(data.roomId);
        },
      );
    });
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this.store.loadNextPage();
        }
      },
      { threshold: 0.1 },
    );

    this.observer.observe(this.endOfList.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.signalrService.leaveSearchRoom();
    this.signalrService.off('RoomCreated');
    this.signalrService.off('RoomStatusChanged');
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
