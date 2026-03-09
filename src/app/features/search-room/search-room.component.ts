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
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';
import { SearchRoomStore } from '../../domain/rooms/store/search-room.store';
import { SearchRoomService } from './services/search-room.service';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-rooms',
  imports: [
    CommonModule,
    ButtonComponent,
    ConfirmationModalComponent,
    PageTitleComponent,
    SpinnerComponent,
  ],
  templateUrl: './search-room.component.html',
  styleUrl: './search-room.component.scss',
  providers: [SearchRoomStore, SearchRoomService],
})
export class SearchRoomComponent implements OnInit, AfterViewInit, OnDestroy {
  public readonly searchRoomService = inject(SearchRoomService);

  @ViewChild('endOfList') endOfList!: ElementRef<HTMLElement>;

  private observer!: IntersectionObserver;

  readonly rooms = this.searchRoomService.rooms;
  readonly isRedirectModalOpen = this.searchRoomService.isRedirectModalOpen;
  readonly isLoadingMore = this.searchRoomService.isLoadingMore;
  readonly isLoadingRooms = this.searchRoomService.isLoadingRooms;
  readonly hasNextPage = this.searchRoomService.hasNextPage;

  isModalOpen = signal(false);

  readonly statusMap: Record<string, string> = {
    Open: 'Open',
    Closed: 'Closed',
    Cancelled: 'Cancelled',
  };

  ngOnInit(): void {
    this.searchRoomService.loadRooms();
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this.searchRoomService.loadNextPage();
        }
      },
      { threshold: 0.1 },
    );

    this.observer.observe(this.endOfList.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  joinRoom(roomId: string): void {
    this.searchRoomService.joinRoom(roomId);
  }

  redirectToActiveRoom(): void {
    this.searchRoomService.redirectToActiveRoom();
  }

  closeRedirectModal(): void {
    this.searchRoomService.closeRedirectModal();
  }

  goBack(): void {
    this.searchRoomService.goBack();
  }
}
