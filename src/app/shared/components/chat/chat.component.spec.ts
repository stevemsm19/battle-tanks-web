import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';

import { ChatComponent } from './chat.component';
import { WaitingRoomService } from '../../../domain/rooms/services/waiting-room.service';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  beforeEach(async () => {
    const waitingRoomServiceSpy = jasmine.createSpyObj(
      'WaitingRoomService',
      ['sendMessage'],
      {
        messages: () => [],
        currentUserId: '1',
      },
    );

    await TestBed.configureTestingModule({
      imports: [ChatComponent],
      providers: [
        provideStore(),
        { provide: WaitingRoomService, useValue: waitingRoomServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
