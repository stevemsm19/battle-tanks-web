import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}


  // TODO: Change error handling
  register() {
    this.errorMessage = '';

    this.authService.register(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration error:', error);
        if (error.error && error.error.error) {
          this.errorMessage = error.error.error;
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      },
    });
  }
}
