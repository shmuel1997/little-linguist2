import { Component, Input, OnInit } from '@angular/core';
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
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DialogMatchGameComponent } from '../matching-game-module/dialog-match-game/dialog-match-game.component';
import { GamePlayerDifficultyService } from '../services/game-player-difficulty.service';
import { GamePlayed } from '../../shared/model/game-Played';

@Component({
  selector: 'app-mixed-words',
  standalone: true,
  imports: [
    CommonModule,
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
export class MixedWordsComponent implements OnInit {
  @Input() idCategory: string = '';
  category: Category | undefined;
  words?: TranslatedWord[];
  index = -1;
  mixWord: string = '';
  numSuccess = 0;
  endGame = false;
  tryCount: number = 0;
  gamePoints: number = 16;

  constructor(
    private categoryService: CategoriesService,
    private dialogService: MatDialog,
    private gamePlayerDifficultyService: GamePlayerDifficultyService
  ) {}

  ngOnInit() {
    this.startNewGame();
  }

  nextWord() {
    if (this.words && this.index < this.words.length - 1) {
      this.index++;
      this.mixWord = [...this.words[this.index]['origin']]
        .sort(() => Math.random() - 0.5)
        .join('');
    }
  }

  reset() {
    if (this.words) this.words[this.index].guess = '';
  }

  submit() {
    this.tryCount++;
    const currentWord = this.words && this.words[this.index];
    const isSuccess = currentWord?.['guess'] === currentWord?.['origin'];
    this.dialogService.open(DialogMatchGameComponent, {
      data: isSuccess,
    });

    if (isSuccess) {
      this.numSuccess++;
    } else {
      this.gamePoints -= 2;
    }

    const isEndOfGame = this.index + 1 === this.words?.length;
    if (isEndOfGame) {
      const game: GamePlayed = {
        date: new Date(),
        idCategory: parseInt(this.idCategory),
        numOfPoints: this.gamePoints,
        idGame: 0,
      };
      this.gamePlayerDifficultyService.addGamePlayed(game);
      this.endGame = true;
    } else {
      this.nextWord();
      this.reset();
    }
  }

  exit() {
    this.dialogService.open(ExitGameComponent);
  }

  calculateProgress(): number {
    const totalWords = this.words?.length || 0;
    const guessedWordsRatio = this.numSuccess / totalWords;
    const categoryProgressRatio = this.index / totalWords;
    const progress = Math.max(guessedWordsRatio, categoryProgressRatio) * 100;
    return progress;
  }

  startNewGame() {
    this.index = -1;
    this.numSuccess = 0;
    this.endGame = false;
    this.tryCount = 0;
    this.gamePoints = 16;
    this.category = this.categoryService.get(parseInt(this.idCategory));
    this.words = this.category?.['words'];
    this.words?.forEach((word) => {
      word.guess = '';
    });
    this.nextWord();
  }
}
