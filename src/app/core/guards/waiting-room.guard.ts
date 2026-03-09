import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { RoomService } from '../../domain/rooms/services/room.service';

export const waitingRoomGuard: CanActivateFn = (route) => {
  const roomService = inject(RoomService);
  const router = inject(Router);

  const roomId = route.paramMap.get('id');
  if (!roomId) return router.navigate(['/search-room']);

  return roomService.getRoomById(roomId).pipe(
    map((details: any) => {
      const status = details.room?.status?.toLowerCase() ?? '';
      
      if (status === 'closed') {
        return router.parseUrl('/search-room');
      }
      
      return true;
    }),
    catchError(() => {
      return of(router.parseUrl('/search-room'));
    })
  );
};
