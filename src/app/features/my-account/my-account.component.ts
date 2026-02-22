import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { UserService } from './services/user.service';
import { LoginService } from '../../core/auth/pages/login/services/login.service';
//TODO: Refactor
@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SidebarComponent,
    InputComponent,
    ButtonComponent,
    SpinnerComponent,
  ],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss',
})
export class MyAccountComponent implements OnInit {
  nicknameControl = new FormControl({ value: '', disabled: true }, [
    Validators.required,
  ]);
  emailControl = new FormControl({ value: '', disabled: true }, [
    Validators.required,
    Validators.email,
  ]);
  isEditing = false;
  isLoading = true;

  constructor(
    private userService: UserService,
    private loginService: LoginService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.nicknameControl.setValue(user.nickname);
        this.emailControl.setValue(user.email);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load profile:', err);
        this.isLoading = false;
      },
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.nicknameControl.enable();
      this.emailControl.enable();
    } else {
      this.nicknameControl.disable();
      this.emailControl.disable();
    }
  }

  saveProfile(): void {
    this.nicknameControl.markAsTouched();
    this.emailControl.markAsTouched();

    if (this.nicknameControl.invalid || this.emailControl.invalid) {
      return;
    }

    const body = {
      nickName: this.nicknameControl.value!,
      email: this.emailControl.value!,
    };

    this.userService.updateProfile(body).subscribe({
      next: (user) => {
        this.nicknameControl.setValue(user.nickname);
        this.emailControl.setValue(user.email);
        this.toggleEdit();
      },
      error: (err) => {
        console.error('Failed to update profile:', err);
      },
    });
  }

  deleteAccount(): void {
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action cannot be undone.',
    );
    if (!confirmed) return;

    this.userService.deleteAccount().subscribe({
      next: async () => {
        await this.loginService.logout();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Failed to delete account:', err);
      },
    });
  }
}
