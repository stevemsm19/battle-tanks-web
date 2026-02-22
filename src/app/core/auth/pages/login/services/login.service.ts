import { inject, Injectable } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { app } from '../../../../../../firebase.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private auth = getAuth(app);

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
      return token;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      throw error;
    }
  }

  async getToken(): Promise<string | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, async (user) => {
        unsubscribe();
        if (user) {
          const token = await user.getIdToken();
          resolve(token);
        } else {
          resolve(null);
        }
      });
    });
  }

  isLoggedIn(): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      return onAuthStateChanged(this.auth, (user) => {
        subscriber.next(!!user);
      });
    });
  }
}
