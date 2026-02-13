import { inject, Injectable } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { app } from '../../../../../../firebase.config';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { Observable, firstValueFrom, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private auth = getAuth(app);
  private storage = inject(LocalStorageService);

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

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.storage.removeItem('token');
    } catch (error) {
      throw error;
    }
  }

  getToken(): string | null {
    return this.storage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
