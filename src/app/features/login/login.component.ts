import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../firebase.config';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router) {}

  login() {
    const auth = getAuth(app);
    this.errorMessage = '';

    signInWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        user.getIdToken().then((token) => {
          localStorage.setItem('token', token);
          this.router.navigate(['/waiting-room']);
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Login error:', errorCode, errorMessage);

        if (errorCode === 'auth/invalid-credential') {
          this.errorMessage = 'Invalid email or password.';
        } else {
          this.errorMessage = `Login failed: ${errorMessage}`;
        }
      });
  }
}
