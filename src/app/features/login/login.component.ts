import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  login() {
    this.errorMessage = '';

    this.authService
      .login(this.email, this.password)
      .then(() => {
        this.router.navigate(['/rooms']);
      })
      .catch((error: any) => {
        console.error('Login error:', error);
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
