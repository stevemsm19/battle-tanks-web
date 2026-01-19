import { Routes } from '@angular/router';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';
import { BoardComponent } from './board/board.component';

export const routes: Routes = [
  { path: '', component: WaitingRoomComponent },
  { path: 'game', component: BoardComponent },
];
