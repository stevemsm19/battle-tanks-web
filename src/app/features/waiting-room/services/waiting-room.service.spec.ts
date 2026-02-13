import { TestBed } from '@angular/core/testing';
import { WaitingRoomService } from './waiting-room.service';
import { SignalrService } from '../../../core/services/signalr.service';
import { RoomService } from '../../search-room/services/search-room.service';
import { PlayerStore } from '../../../shared/store/player.store';
import { of } from 'rxjs';
import { Player } from '../../../shared/models/player.model';

describe('WaitingRoomService', () => {
  let service: WaitingRoomService;
  let signalrServiceSpy: jasmine.SpyObj<SignalrService>;
  let roomServiceSpy: jasmine.SpyObj<RoomService>;
  let playerStore: InstanceType<typeof PlayerStore>;

  const signalrCallbacks: { [key: string]: Function } = {};

  beforeEach(() => {
    const signalrSpy = jasmine.createSpyObj('SignalrService', ['on', 'invoke']);
    signalrSpy.on.and.callFake((methodName: string, callback: Function) => {
      signalrCallbacks[methodName] = callback;
    });
    signalrSpy.invoke.and.returnValue(Promise.resolve());

    const roomSpy = jasmine.createSpyObj('RoomService', ['getRoomById']);
    roomSpy.getRoomById.and.returnValue(
      of({ roomId: '1', roomName: 'Test', players: [] }),
    );

    TestBed.configureTestingModule({
      providers: [
        WaitingRoomService,
        PlayerStore,
        { provide: SignalrService, useValue: signalrSpy },
        { provide: RoomService, useValue: roomSpy },
      ],
    });

    service = TestBed.inject(WaitingRoomService);
    signalrServiceSpy = TestBed.inject(
      SignalrService,
    ) as jasmine.SpyObj<SignalrService>;
    roomServiceSpy = TestBed.inject(RoomService) as jasmine.SpyObj<RoomService>;
    playerStore = TestBed.inject(PlayerStore);
  });

  it('should register SignalR listeners on instantiation', () => {
    expect(signalrServiceSpy.on).toHaveBeenCalledWith(
      'PlayerJoined',
      jasmine.any(Function),
    );
    expect(signalrServiceSpy.on).toHaveBeenCalledWith(
      'UpdatePlayerList',
      jasmine.any(Function),
    );
    expect(signalrServiceSpy.on).toHaveBeenCalledWith(
      'ReceiveMessage',
      jasmine.any(Function),
    );
  });

  it('should update store when PlayerJoined event is received', () => {
    const newPlayer: Player = {
      id: '99',
      name: 'NewUser',
      status: 'waiting',
    };

    expect(playerStore.players().length).toBe(0);
    if (signalrCallbacks['PlayerJoined']) {
      signalrCallbacks['PlayerJoined'](newPlayer);
    } else {
      fail('PlayerJoined listener was not registered');
    }

    const players = playerStore.players();
    expect(players.length).toBe(1);
    expect(players[0].name).toBe('NewUser');
  });

  it('should update store when UpdatePlayerList event is received', () => {
    const list: Player[] = [
      { id: '1', name: 'A', status: 'waiting' },
      { id: '2', name: 'B', status: 'ready' },
    ];

    if (signalrCallbacks['UpdatePlayerList']) {
      signalrCallbacks['UpdatePlayerList'](list);
    } else {
      fail('UpdatePlayerList listener not registered');
    }

    expect(playerStore.players().length).toBe(2);
    expect(playerStore.players()[1].name).toBe('B');
  });
});
