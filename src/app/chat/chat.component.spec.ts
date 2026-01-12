import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TankComponent } from '../tank/tank.component';

describe('TankComponent', () => {
  let component: TankComponent;
  let fixture: ComponentFixture<TankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TankComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
