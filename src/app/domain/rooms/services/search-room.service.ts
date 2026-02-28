import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { Observable } from 'rxjs';
import { Room } from '../models/room.model';
import { Player } from '../models/player.model';

export interface RoomDetails {
  roomId: string;
  roomName: string;
  players: Partial<Player>[];
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  size: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private http: HttpClientService) {}

  getRooms(
    page = 1,
    size = 10,
    status = 'Open',
  ): Observable<PagedResult<Room>> {
    return this.http.get<PagedResult<Room>>(
      `api/room?page=${page}&size=${size}&status=${status}`,
    );
  }

  createRoom(name: string, maxPlayers: number): Observable<Room> {
    return this.http.post<Room>('api/room', { name, maxPlayers });
  }

  joinRoom(roomId: string): Observable<void> {
    return this.http.post<void>(`api/room/${roomId}/join`, {});
  }

  leaveRoom(roomId: string): Observable<void> {
    return this.http.delete<void>(`api/room/${roomId}/leave`);
  }

  startGame(roomId: string): Observable<void> {
    return this.http.post<void>(`api/room/${roomId}/start`, {});
  }

  getRoomById(roomId: string): Observable<RoomDetails> {
    return this.http.get<RoomDetails>(`api/room/${roomId}`);
  }
}
