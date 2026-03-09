import { inject } from '@angular/core';
import { CanDeactivateFn, Router } from '@angular/router';
import { SignalrService } from '../services/signalr.service';

let isGuardRedirecting = false;

export const canLeaveGameGuard: CanDeactivateFn<any> = async (component) => {
  if (
    isGuardRedirecting ||
    (component.gameOverData && component.gameOverData())
  ) {
    isGuardRedirecting = false;
    return true;
  }

  const confirmed = window.confirm(
    'Are you sure you want to leave the game? You will lose your progress.',
  );

  if (!confirmed) return false;

  const signalrService = inject(SignalrService);
  const router = inject(Router);

  try {
    await signalrService.invoke('LeaveGame', component.roomId);
  } catch (err) {
    console.error('Error leaving game:', err);
  }

  isGuardRedirecting = true;
  return router.parseUrl('/search-room');
};
