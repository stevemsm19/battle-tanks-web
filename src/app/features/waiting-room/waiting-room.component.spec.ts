import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { playerReducer } from '../store/reducer/player.reducer';

import { WaitingRoomComponent } from './waiting-room.component';

describe('WaitingRoomComponent', () => {
  let component: WaitingRoomComponent;
  let fixture: ComponentFixture<WaitingRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaitingRoomComponent],
      providers: [provideStore({ players: playerReducer })],
    }).compileComponents();

    fixture = TestBed.createComponent(WaitingRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
