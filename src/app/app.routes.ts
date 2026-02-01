import { Routes } from '@angular/router';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';
import { BoardComponent } from './board/board.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { RoomsComponent } from './features/rooms/rooms.component';
import { authGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [publicGuard] },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [publicGuard],
  },
  { path: 'rooms', component: RoomsComponent, canActivate: [authGuard] },
  {
    path: 'waiting-room',
    component: WaitingRoomComponent,
    canActivate: [authGuard],
  },
  { path: 'game', component: BoardComponent, canActivate: [authGuard] },
];
