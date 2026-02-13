import { Routes } from '@angular/router';

import { LoginComponent } from './core/auth/pages/login/login.component';
import { RegisterComponent } from './core/auth/pages/register/register.component';
import { RoomsComponent } from './features/rooms/rooms.component';
import { authGuard, publicGuard } from './core/guards/auth.guard';
import { WaitingRoomComponent } from './features/waiting-room/waiting-room.component';
import { BoardComponent } from './features/game/board.component';
import { MyAccountComponent } from './features/my-account/my-account.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [publicGuard] },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [publicGuard],
  },
  {
    path: 'my-account',
    component: MyAccountComponent,
    canActivate: [authGuard],
  },
  { path: 'rooms', component: RoomsComponent, canActivate: [authGuard] },
  {
    path: 'waiting-room/:id',
    component: WaitingRoomComponent,
    canActivate: [authGuard],
  },
  { path: 'game', component: BoardComponent, canActivate: [authGuard] },
];
