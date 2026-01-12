import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { PlayersComponent } from './players.component';
import { playerConnected } from '../store/actions/player.actions';

describe('PlayersComponent', () => {
  let component: PlayersComponent;
  let fixture: ComponentFixture<PlayersComponent>;
  let storeSpy: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    storeSpy = jasmine.createSpyObj('Store', ['dispatch']);

    await TestBed.configureTestingModule({
      imports: [PlayersComponent],
      providers: [
        { provide: Store, useValue: storeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayersComponent);
    component = fixture.componentInstance;
  });

  it('should dispatch playerConnected action when addPlayer is called', () => {
    component.addPlayer();

    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      playerConnected({
        player: { id: 'Jugador-Test', x: 100, y: 100 }
      })
    );
  });
});