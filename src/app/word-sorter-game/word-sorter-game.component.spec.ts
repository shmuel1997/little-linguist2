import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordSorterGameComponent } from './word-sorter-game.component';

describe('WordSorterGameComponent', () => {
  let component: WordSorterGameComponent;
  let fixture: ComponentFixture<WordSorterGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordSorterGameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WordSorterGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
