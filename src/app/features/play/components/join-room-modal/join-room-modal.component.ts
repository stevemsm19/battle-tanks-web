import { Component, inject, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { RoomService } from '../../../../domain/rooms/services/search-room.service';

@Component({
  selector: 'app-join-room-modal',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './join-room-modal.component.html',
  styleUrl: './join-room-modal.component.scss',
})
export class JoinRoomConfirmationModalComponent {
  private readonly roomService = inject(RoomService);
  private readonly router = inject(Router);

  closed = output();
  redirectNeeded = output<string>();

  isJoining = signal(false);
  roomIdControl = new FormControl('', [Validators.required]);

  joinRoom(): void {
    const rawId = this.roomIdControl.value?.trim();
    if (this.isJoining() || !rawId) return;

    this.isJoining.set(true);
    this.roomIdControl.setErrors(null);

    this.roomService.joinRoom(rawId).subscribe({
      next: () => {
        this.isJoining.set(false);
        this.closed.emit();
        this.router.navigate(['/waiting-room', rawId]);
      },
      error: (error) => {
        this.isJoining.set(false);
        console.error('Error joining room:', error);

        let errorMessage = 'An error occurred while joining the room.';
        if (error.error?.message) {
          errorMessage = error.error.detail;
        } else if (error.status === 400 || error.status === 404) {
          errorMessage = 'The room ID is invalid or does not exist.';
        }

        if (errorMessage.startsWith('User is already')) {
          this.closed.emit();
          this.router.navigate(['/waiting-room', rawId]);
        } else if (errorMessage.startsWith('User belongs')) {
          this.closed.emit();
          this.redirectNeeded.emit(errorMessage.split(':')[1]);
        } else {
          this.roomIdControl.setErrors({ serverError: errorMessage });
        }
      },
    });
  }

  cancel(): void {
    this.closed.emit();
  }
}
