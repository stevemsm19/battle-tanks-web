import { Component, inject, output, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { RoomService } from '../../../../domain/rooms/services/search-room.service';

@Component({
  selector: 'app-create-room-modal',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './create-room-modal.component.html',
  styleUrl: './create-room-modal.component.scss',
})
export class CreateRoomConfirmationModalComponent {
  private readonly roomService = inject(RoomService);
  private readonly router = inject(Router);

  closed = output();
  redirectNeeded = output<string>();

  isCreating = signal(false);

  roomForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    maxPlayers: new FormControl(2, [
      Validators.required,
      Validators.min(2),
      Validators.max(4),
    ]),
  });

  get nameControl() {
    return this.roomForm.get('name') as FormControl;
  }

  get maxPlayersControl() {
    return this.roomForm.get('maxPlayers') as FormControl;
  }

  createRoom(): void {
    if (this.roomForm.invalid || this.isCreating()) return;

    this.isCreating.set(true);
    const { name, maxPlayers } = this.roomForm.getRawValue();

    this.roomService.createRoom(name!, maxPlayers!).subscribe({
      next: (room) => {
        this.isCreating.set(false);
        this.closed.emit();
        if (room?.id) {
          this.router.navigate(['/waiting-room', room.id]);
        }
      },
      error: (error) => {
        this.isCreating.set(false);
        console.error('Error creating room:', error);
        const errorMessage = error.error?.detail ?? '';
        if (errorMessage.startsWith('User belongs')) {
          this.closed.emit();
          this.redirectNeeded.emit(errorMessage.split(':')[1]);
        } else {
          this.nameControl.setErrors({ serverError: errorMessage });
        }
      },
    });
  }

  cancel(): void {
    this.closed.emit();
  }
}
