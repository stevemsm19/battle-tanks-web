import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { Observable } from 'rxjs';
import { Room } from '../../../shared/models/room.model';
import { Player } from '../../../shared/models/player.model';

export interface RoomDetails {
  roomId: string;
  roomName: string;
  players: Partial<Player>[];
}

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private http: HttpClientService) {}

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>('api/room');
  }

  joinRoom(roomId: string): Observable<void> {
    return this.http.post<void>('api/room/join', { roomId });
  }

  leaveRoom(roomId: string): Observable<void> {
    return this.http.delete<void>(`api/room/leave/${roomId}`);
  }

  createRoom(name: string, maxPlayers: number): Observable<Room> {
    return this.http.post<Room>('api/room', { name, maxPlayers });
  }

  getRoomById(roomId: string): Observable<RoomDetails> {
    return this.http.get<RoomDetails>(`api/room/${roomId}`);
  }
}
