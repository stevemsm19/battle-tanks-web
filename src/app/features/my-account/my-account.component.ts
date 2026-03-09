import { Component, OnInit, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

import { LoginService } from '../../core/auth/pages/login/services/login.service';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import { UserService } from '../../domain/users/services/user.service';

@Component({
  selector: 'app-my-account',
  imports: [
    ReactiveFormsModule,
    SidebarComponent,
    InputComponent,
    ButtonComponent,
    SpinnerComponent,
    PageTitleComponent,
  ],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss',
})
export class MyAccountComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);

  isLoading = signal(true);
  isEditing = signal(false);

  profileForm = new FormGroup({
    nickname: new FormControl({ value: '', disabled: true }, [
      Validators.required,
    ]),
    email: new FormControl({ value: '', disabled: true }, [
      Validators.required,
      Validators.email,
    ]),
  });

  get nicknameControl() {
    return this.profileForm.get('nickname') as FormControl;
  }

  get emailControl() {
    return this.profileForm.get('email') as FormControl;
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          nickname: user.nickname,
          email: user.email,
        });
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  toggleEdit(): void {
    this.isEditing.update((val) => !val);
    const action = this.isEditing() ? 'enable' : 'disable';
    this.profileForm[action]();
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;

    const body = {
      nickName: this.profileForm.getRawValue().nickname!,
      email: this.profileForm.getRawValue().email!,
      avatarUrl: '',
    };

    this.userService.updateProfile(body).subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          nickname: user.nickname,
          email: user.email,
        });
        this.toggleEdit();
      },
      error: (err) => console.error('Update failed:', err),
    });
  }

  async deleteAccount(): Promise<void> {
    const confirmed = confirm('Are you sure you want to delete your account?');
    if (!confirmed) return;

    this.userService.deleteAccount().subscribe({
      next: async () => {
        await this.loginService.logout();
        this.router.navigate(['/login']);
      },
    });
  }
}
