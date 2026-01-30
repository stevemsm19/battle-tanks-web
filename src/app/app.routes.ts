import { Routes } from '@angular/router';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';
import { BoardComponent } from './board/board.component';
import { LoginComponent } from './features/login/login.component';
import { authGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [publicGuard] },
  {
    path: 'waiting-room',
    component: WaitingRoomComponent,
    canActivate: [authGuard],
  },
  { path: 'game', component: BoardComponent, canActivate: [authGuard] },
];
