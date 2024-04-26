import { Component, Input } from '@angular/core';
import { Category } from '../../shared/model/category';
import { CategoriesService } from '../services/categories.service';
import { TranslatedWord } from '../../shared/model/translated-word';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ExitGameComponent } from '../exit-game/exit-game.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DialogMatchGameComponent } from '../matching-game-module/dialog-match-game/dialog-match-game.component';
import { GamePlayerDifficultyService } from '../services/game-player-difficulty.service';
import { GamePlayed } from '../../shared/model/gamePlayed';

@Component({
  selector: 'app-mixed-words',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgIf,
    MatProgressBarModule,
    NgFor,
  ],
  templateUrl: './mixed-words.component.html',
  styleUrl: './mixed-words.component.css',
})
export class MixedWordsComponent {
  @Input() idCategory: string = '';
  category: Category | undefined;
  words?: TranslatedWord[];
  index = -1;
  mixWord: string = '';
  guess: string = '';
  numSuccess = 0;
  endGame = false;
  tryCount: number = 0;
  gamePoints: number = 16;

  constructor(
    private categoryService: CategoriesService,
    private dialogService: MatDialog,
    private gamePlayerDifficultyService: GamePlayerDifficultyService
  ) {}

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnInit() {
    this.category = this.categoryService.get(parseInt(this.idCategory));
    this.words = this.category?.words;
    this.nextWord();
  }

  nextWord() {
    if (this.words && this.index < this.words.length - 1) {
      this.index++;
      this.mixWord = [...this.words[this.index].origin]
        .sort(() => Math.random() - 0.5)
        .join('');
    }
  }

  reset() {
    this.guess = '';
  }

  submit() {
    this.tryCount++;
    const isSuccess = this.guess === this.words?.[this.index]?.origin;
    if (isSuccess) {
      this.numSuccess++;
      this.dialogService.open(DialogMatchGameComponent, {
        data: { success: true },
      });
    } else {
      this.gamePoints -= 2;
      this.dialogService.open(DialogMatchGameComponent, {
        data: { success: false },
      });
    }

    if (this.index + 1 === this.words?.length) {
      const game: GamePlayed = {
        date: new Date(),
        idCategory: parseInt(this.idCategory),
        numOfPoints: this.gamePoints,
      };
      this.gamePlayerDifficultyService.addGamePlayed(game);
      this.endGame = true;
    } else {
      this.reset();
      this.nextWord();
    }
  }

  exit() {
    this.dialogService.open(ExitGameComponent);
  }

  calculateProgress(): number {
    return this.words ? (this.numSuccess / this.words.length) * 100 : 0;
  }
  startNewGame() {
    this.index = -1;
    this.numSuccess = 0;
    this.endGame = false;
    this.tryCount = 0;
    this.gamePoints = 16;
    this.nextWord();
  }
}
