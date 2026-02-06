import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';
import { StoreModule, provideStore } from '@ngrx/store';
import { SignalrService } from '../../../core/services/signalr.service';

describe('GameService', () => {
  let service: GameService;
  let signalrServiceSpy: jasmine.SpyObj<SignalrService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('SignalrService', ['on', 'invoke']);

    TestBed.configureTestingModule({
      providers: [
        GameService,
        provideStore(),
        { provide: SignalrService, useValue: spy },
      ],
    });

    service = TestBed.inject(GameService);
    signalrServiceSpy = TestBed.inject(
      SignalrService,
    ) as jasmine.SpyObj<SignalrService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a player to the first empty slot', () => {
    const newPlayer = {
      id: '1',
      name: 'TEST_PLAYER',
      status: 'ready' as const,
    };

    service.addPlayer(newPlayer);

    const players = service.players();
    const addedPlayer = players.find((p) => p.name === 'TEST_PLAYER');
    expect(addedPlayer).toBeDefined();
    expect(addedPlayer?.status).toBe('ready');
  });

  it('should update player position', () => {
    service.addPlayer({
      id: '1',
      name: 'STEVENSM19',
      status: 'ready',
      x: 0,
      y: 0,
    });

    const initialPosition = { x: 5, y: 5 };
    service.updatePlayerPosition(
      'STEVENSM19',
      initialPosition.x,
      initialPosition.y,
    );

    const players = service.players();
    const player = players.find((p) => p.name === 'STEVENSM19');

    expect(player).toBeDefined();
    expect(player?.x).toBe(5);
    expect(player?.y).toBe(5);
  });

  it('should remove a player and reset slot to empty', () => {
    const playerToRemove = {
      id: '1',
      name: 'TO_BE_REMOVED',
      status: 'ready' as const,
    };
    service.addPlayer(playerToRemove);

    let players = service.players();
    expect(players.some((p) => p.name === 'TO_BE_REMOVED')).toBeTrue();

    service.removePlayer('TO_BE_REMOVED');

    players = service.players();
    expect(players.some((p) => p.name === 'TO_BE_REMOVED')).toBeFalse();
  });
});
