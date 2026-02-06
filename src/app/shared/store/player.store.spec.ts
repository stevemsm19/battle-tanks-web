import { TestBed } from '@angular/core/testing';
import { PlayerStore } from './player.store';
import { Player } from '../models/player.model';

describe('PlayerStore', () => {
  let store: InstanceType<typeof PlayerStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlayerStore],
    });
    store = TestBed.inject(PlayerStore);
  });

  it('should initialize with empty players', () => {
    expect(store.players().length).toBe(0);
  });

  it('should add a player', () => {
    const newPlayer: Player = {
      id: '123',
      name: 'TestPlayer',
      status: 'waiting',
    };

    store.addPlayer(newPlayer);

    expect(store.players().length).toBe(1);
    expect(store.players()[0]).toEqual(newPlayer);
  });

  it('should not add duplicate player by name', () => {
    const player: Player = {
      id: '123',
      name: 'TestPlayer',
      status: 'waiting',
    };

    store.addPlayer(player);
    store.addPlayer(player);

    expect(store.players().length).toBe(1);
  });

  it('should compute active players accurately', () => {
    const activePlayer: Player = {
      id: '1',
      name: 'P1',
      status: 'waiting',
    };
    const emptyPlayer: Player = {
      id: '2',
      name: 'P2',
      status: 'empty',
    };

    store.setPlayers([activePlayer, emptyPlayer]);

    const active = store.activePlayers();
    expect(active.length).toBe(1);
    expect(active[0].id).toBe('1');
  });
});
