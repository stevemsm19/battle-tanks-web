import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../../../core/services/http-client.service';
import { UserProfile } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClientService) {}

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>('api/users');
  }

  updateProfile(data: {
    nickName: string;
    email: string;
  }): Observable<UserProfile> {
    return this.http.put<UserProfile>('api/users', data);
  }

  deleteAccount(): Observable<void> {
    return this.http.delete<void>('api/users');
  }
}
