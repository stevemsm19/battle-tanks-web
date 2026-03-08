import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface TopPlayer {
  rank: number;
  nickname: string;
  score: number;
}

@Injectable({
  providedIn: 'root',
})
export class LeaderboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/leaderboard/top10`;

  getTopPlayers(): Observable<TopPlayer[]> {
    return this.http.get<TopPlayer[]>(this.apiUrl);
  }
}
