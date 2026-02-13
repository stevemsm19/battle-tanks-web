import { inject, Injectable } from '@angular/core';
import { HttpClientService } from '../../../../services/http-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private http = inject(HttpClientService);

  register(
    nickname: string,
    email: string,
    password: string,
  ): Observable<void> {
    return this.http.post<void>('api/auth/register', {
      nickname,
      email,
      password,
    });
  }
}
