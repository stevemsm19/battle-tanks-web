import { inject, Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { app } from '../../firebase.config';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth(app);
  private storage = inject(LocalStorageService);
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

  async getFreshToken(): Promise<string | null> {
    const user = this.auth.currentUser;
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
