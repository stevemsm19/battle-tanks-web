import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';
import { CreateRoomConfirmationModalComponent } from './components/create-room-modal/create-room-modal.component';
import { JoinRoomConfirmationModalComponent } from './components/join-room-modal/join-room-modal.component';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';

@Component({
  selector: 'app-play',
  imports: [
    SidebarComponent,
    ButtonComponent,
    ConfirmationModalComponent,
    CreateRoomConfirmationModalComponent,
    JoinRoomConfirmationModalComponent,
    PageTitleComponent,
  ],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss',
})
export class PlayComponent {
  private readonly router = inject(Router);

  isCreateModalOpen = signal(false);
  isJoinModalOpen = signal(false);
  isRedirectModalOpen = signal(false);
  activeRoomId = signal('');

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  onRedirectNeeded(roomId: string): void {
    this.activeRoomId.set(roomId);
    this.isRedirectModalOpen.set(true);
  }

  redirectToActiveRoom(): void {
    this.isRedirectModalOpen.set(false);
    this.router.navigate(['/waiting-room', this.activeRoomId()]);
  }

  closeRedirectModal(): void {
    this.isRedirectModalOpen.set(false);
    this.activeRoomId.set('');
  }
}
