import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { RoomService } from '../../domain/rooms/services/room.service';

export const waitingRoomGuard: CanActivateFn = async (route) => {
  const roomService = inject(RoomService);
  const router = inject(Router);

  const roomId = route.paramMap.get('id');
  if (!roomId) return router.parseUrl('/search-room');

  try {
    const details = await firstValueFrom(roomService.getRoomById(roomId));
    const status: string = (details as any).room?.status ?? '';

    if (status.toLowerCase() === 'closed') {
      return router.parseUrl('/search-room');
    }

    return true;
  } catch {
    return router.parseUrl('/search-room');
  }
};
