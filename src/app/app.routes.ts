import { Routes } from '@angular/router';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';
import { BoardComponent } from './board/board.component';
import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'waiting-room', component: WaitingRoomComponent },
  { path: 'game', component: BoardComponent },
];
