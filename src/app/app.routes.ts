import { Routes } from '@angular/router';

import { LoginComponent } from './core/auth/pages/login/login.component';
import { RegisterComponent } from './core/auth/pages/register/register.component';
import { SearchRoomComponent } from './features/search-room/search-room.component';
import { authGuard, publicGuard } from './core/guards/auth.guard';
import { canLeaveGameGuard } from './core/guards/can-leave-game.guard';
import { waitingRoomGuard } from './core/guards/waiting-room.guard';
import { WaitingRoomComponent } from './features/waiting-room/waiting-room.component';
import { BoardComponent } from './features/game/board.component';
import { MyAccountComponent } from './features/my-account/my-account.component';
import { ControlsComponent } from './features/controls/controls.component';
import { PlayComponent } from './features/play/play.component';

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
  {
    path: 'search-room',
    component: SearchRoomComponent,
    canActivate: [authGuard],
  },
  {
    path: 'play',
    component: PlayComponent,
    canActivate: [authGuard],
  },
  {
    path: 'waiting-room/:id',
    component: WaitingRoomComponent,
    canActivate: [authGuard, waitingRoomGuard],
  },
  {
    path: 'game/:id',
    component: BoardComponent,
    canActivate: [authGuard],
    canDeactivate: [canLeaveGameGuard],
  },
  {
    path: 'controls',
    component: ControlsComponent,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'play' },
];
