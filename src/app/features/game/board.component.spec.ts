import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardComponent } from './board.component';
import { GameService } from './services/game.service';
import { WaitingRoomService } from '../waiting-room/services/waiting-room.service';
import { signal } from '@angular/core';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;

  beforeEach(async () => {
    const gameServiceSpy = jasmine.createSpyObj('GameService', ['joinGame'], {
      mapMatrix: signal([]),
      bullets: signal([]),
      players: signal([]),
      score: signal(0),
      currentUser: signal({ id: '1', name: 'TestUser', x: 0, y: 0 }),
    });

    const waitingRoomServiceSpy = jasmine.createSpyObj(
      'WaitingRoomService',
      [],
      {
        roomName: signal('Test Room'),
        mapName: signal('Test Map'),
        messages: signal([]),
        currentUserId: '1',
      },
    );

    await TestBed.configureTestingModule({
      imports: [BoardComponent],
      providers: [
        { provide: GameService, useValue: gameServiceSpy },
        { provide: WaitingRoomService, useValue: waitingRoomServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
