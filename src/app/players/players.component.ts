import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectAllPlayers } from '../store/selector/player.selectors';
import { playerConnected } from '../store/actions/player.actions';


@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './players.component.html',
})
export class PlayersComponent implements OnInit {

  players$!: any;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.players$ = this.store.select(selectAllPlayers);
  }

  addPlayer(): void {
    this.store.dispatch(
      playerConnected({
        player: { id: 'Jugador-Test', x: 100, y: 100 }
      })
    );
  }
}