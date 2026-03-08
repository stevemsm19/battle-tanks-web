import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import { LeaderboardService, TopPlayer } from './services/leaderboard.service';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    PageTitleComponent,
    SpinnerComponent,
  ],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {
  private leaderboardService = inject(LeaderboardService);

  topPlayers = signal<TopPlayer[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.leaderboardService.getTopPlayers().subscribe({
      next: (players) => {
        this.topPlayers.set(players);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load leaderboard', err);
        this.errorMessage.set('Could not load leaderboard.');
        this.isLoading.set(false);
      },
    });
  }
}
