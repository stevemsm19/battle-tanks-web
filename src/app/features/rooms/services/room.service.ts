import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { Observable } from 'rxjs';
import { Room } from '../../../models/room.model';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private http: HttpClientService) {}

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>('api/room');
  }

  joinRoom(roomId: string): Observable<void> {
    return this.http.put<void>(`api/room/${roomId}/join`, {});
  }

  createRoom(name: string): Observable<void> {
    return this.http.post<void>('api/room', { name });
  }
}
