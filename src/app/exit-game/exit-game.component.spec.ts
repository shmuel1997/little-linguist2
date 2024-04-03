import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitGameComponent } from './exit-game.component';

describe('ExitGameComponent', () => {
  let component: ExitGameComponent;
  let fixture: ComponentFixture<ExitGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExitGameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExitGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
