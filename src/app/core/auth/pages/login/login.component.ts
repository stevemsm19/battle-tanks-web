import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from './services/login.service';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private fb: FormBuilder,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get emailControl() {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordControl() {
    return this.loginForm.get('password') as FormControl;
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    const { email, password } = this.loginForm.value;

    this.loginService
      .login(email, password)
      .then(() => {
        this.router.navigate(['/play']);
      })
      .catch((error: any) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === 'auth/invalid-credential') {
          this.errorMessage = 'Email or password invalid';
        } else {
          this.errorMessage = `Error in login: ${errorMessage}`;
        }
      });
  }
}
