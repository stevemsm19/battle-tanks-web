import { inject, Injectable } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { app } from '../../../firebase.config';
import { HttpClientService } from './http-client.service';
import { LocalStorageService } from './local-storage.service';
import { Observable, firstValueFrom, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth(app);
  private storage = inject(LocalStorageService);
  private http = inject(HttpClientService);

  user$ = new Observable<User | null>((subscriber) => {
    return onAuthStateChanged(this.auth, subscriber);
  });

  constructor() {}

  async login(email: string, password: string): Promise<string> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      const user = userCredential.user;
      const token = await user.getIdToken();
      this.storage.setItem('token', token);
      return token;
    } catch (error) {
      throw error;
    }
  }

  register(email: string, password: string): Observable<void> {
    return this.http.post<void>('api/auth/register', { email, password });
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.storage.removeItem('token');
    } catch (error) {
      throw error;
    }
  }

  async getFreshToken(): Promise<string | null> {
    const user = await firstValueFrom(this.user$.pipe(take(1)));
    if (user) {
      const token = await user.getIdToken();
      this.storage.setItem('token', token);
      return token;
    }
    return null;
  }

  getToken(): string | null {
    return this.storage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
