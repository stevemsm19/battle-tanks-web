import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';
import { SignalrService } from './signalr.service';
import { StoreModule } from '@ngrx/store';
import { playerReducer } from '../store/reducer/player.reducer';

describe('GameService', () => {
  let service: GameService;
  let signalrServiceSpy: jasmine.SpyObj<SignalrService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('SignalrService', ['on', 'invoke']);

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ players: playerReducer })],
      providers: [GameService, { provide: SignalrService, useValue: spy }],
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
    const newPlayer = { id: '1', name: 'TEST_PLAYER', status: 'ready' as const };

    service.addPlayer(newPlayer);

    const players = service.players();
    expect(players[1].name).toBe('TEST_PLAYER');
    expect(players[1].status).toBe('ready');
  });

  it('should update player position', () => {
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
    const playerToRemove = { id: '1', name: 'TO_BE_REMOVED', status: 'ready' as const };
    service.addPlayer(playerToRemove);

    let players = service.players();
    expect(players[1].name).toBe('TO_BE_REMOVED');

    service.removePlayer('TO_BE_REMOVED');

    players = service.players();
    expect(players[1].name).toBe('ESPERANDO...');
    expect(players[1].status).toBe('empty');
  });
});
