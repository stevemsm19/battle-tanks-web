import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { WaitingRoomComponent } from './waiting-room.component';
import { WaitingRoomService } from './services/waiting-room.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('WaitingRoomComponent', () => {
  let component: WaitingRoomComponent;
  let fixture: ComponentFixture<WaitingRoomComponent>;

  beforeEach(async () => {
    const waitingRoomServiceSpy = jasmine.createSpyObj(
      'WaitingRoomService',
      ['loadRoomDetails'],
      {
        roomName: () => 'Test Room',
        mapName: () => 'Test Map',
        roomId: () => '123',
        players: () => [],
        messages: () => [],
        currentUserId: '1',
      },
    );

    const activatedRouteSpy = {
      paramMap: of({ get: (key: string) => '123' }),
    };

    await TestBed.configureTestingModule({
      imports: [WaitingRoomComponent],
      providers: [
        provideStore(),
        { provide: WaitingRoomService, useValue: waitingRoomServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WaitingRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
