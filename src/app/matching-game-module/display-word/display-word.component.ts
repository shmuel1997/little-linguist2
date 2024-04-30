import { Component, Input } from '@angular/core';
import { WordStatus } from '../models/wordStatus.enum';
import { MatCardModule } from '@angular/material/card';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-display-word',
  standalone: true,
  imports: [MatCardModule, NgClass],
  templateUrl: './display-word.component.html',
  styleUrl: './display-word.component.css',
})
export class DisplayWordComponent {
  @Input() word: string = '';
  @Input() wordStatus: WordStatus = 0;

  getWordStyle() {
    switch (this.wordStatus) {
      case WordStatus.Selected:
        return 'selected-word';
      case WordStatus.Disabled:
        return 'disabled-word';
      default:
        return '';
    }
  }
}
