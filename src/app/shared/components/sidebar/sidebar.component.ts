import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../core/auth/pages/login/services/login.service';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Input() activeMenu = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
  ) {}

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  async logout(): Promise<void> {
    await this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
