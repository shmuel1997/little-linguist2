import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MixedWordsComponent } from './mixed-words.component';

describe('MixedWordsComponent', () => {
  let component: MixedWordsComponent;
  let fixture: ComponentFixture<MixedWordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MixedWordsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MixedWordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
