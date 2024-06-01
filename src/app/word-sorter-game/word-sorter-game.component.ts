import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CategoriesService } from '../services/categories.service';
import { DialogMatchGameComponent } from '../matching-game-module/dialog-match-game/dialog-match-game.component';
import { Category } from '../../shared/model/category';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ExitGameComponent } from '../exit-game/exit-game.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GamePlayed } from '../../shared/model/game-Played';
import { GamePlayerDifficultyService } from '../services/game-player-difficulty.service';
import { TranslatedWord } from '../../shared/model/translated-word';
import { TimerComponent } from '../timer/timer.component';
import { GameManagerService } from '../services/game-manager.service';
import { GameDifficulty } from '../../shared/model/game-Difficulty.enum';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-word-sorter-game',
  standalone: true,
  imports: [
    MatIconModule,
    MatProgressBarModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgIf,
    MatProgressBarModule,
    NgFor,
    RouterModule,
    MatToolbarModule,
    ExitGameComponent,
    MatDialogModule,
    TimerComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './word-sorter-game.component.html',
  styleUrls: ['./word-sorter-game.component.css'],
})
export class WordSorterGameComponent implements OnInit {
  @Input() idCategory: string = '';
  currentWord: string | undefined;
  currentCategory: Category | undefined;
  otherCategory: Category | undefined;
  wordsToGuess: TranslatedWord[] = [];
  currentWordIndex: number = -1;
  score: number = 0;
  gameOver: boolean = false;
  progress: unknown;
  guesses: boolean[] = [];
  errorWords: string = '';
  gameDuration: number = 0;
  displayTimeLeft: string = '';
  isLoading = true;
  @ViewChild(TimerComponent) timerComponent!: TimerComponent;

  constructor(
    private categoriesService: CategoriesService,
    private dialog: MatDialog,
    private gamePlayerDifficultyService: GamePlayerDifficultyService,
    private gameManagerService: GameManagerService
  ) {}

  ngOnInit(): void {
    let categories: Category[] = [];
    this.categoriesService.list().then((res) => {
      categories = res;
      const validCategories = categories.filter(
        (category) => category.words.length >= 3
      );


      if (validCategories.length < 2) {
        this.isLoading=false;
        this.errorWords =
          'At least two categories with at least three words each are required to play repeat Please add words and categories.';
        return;
      }

      this.currentCategory =
        validCategories[Math.floor(Math.random() * validCategories.length)];
      this.otherCategory =
        validCategories[Math.floor(Math.random() * validCategories.length)];
      while (this.currentCategory.id === this.otherCategory.id) {
        this.otherCategory =
          validCategories[Math.floor(Math.random() * validCategories.length)];
      }

      this.startGame();
      this.gameDuration = this.gameManagerService.getGameDuration(
        GameDifficulty.MEDIUM
      );
      this.timerComponent?.resetTimer();
      setTimeout(() => this.timerComponent?.startTimer(), 100);
      this.isLoading = false;
    });
  }

  exit() {
    this.dialog.open(ExitGameComponent);
  }

  startGame(): void {
    
    let categories: Category[] = [];
    this.categoriesService.list().then((res) => {
      categories = res;
      this.otherCategory =
      categories[Math.floor(Math.random() * categories.length)];
    if (this.currentCategory) {
      for (let i = 0; i < 3; i++) {
        const randomIndexCurrentCategory = Math.floor(
          Math.random() * this.currentCategory.words.length
        );
        const randomIndexOtherCategory = Math.floor(
          Math.random() * this.otherCategory.words.length
        );
        const randomWordCurrentCategory = [
          ...this.currentCategory.words,
        ].splice(randomIndexCurrentCategory, 1)[0];
        const randomWordOtherCategory = [...this.otherCategory.words].splice(
          randomIndexOtherCategory,
          1
        )[0];
        this.wordsToGuess.push(randomWordCurrentCategory);
        this.wordsToGuess.push(randomWordOtherCategory);
      }
      this.wordsToGuess = [...this.wordsToGuess].sort(
        () => Math.random() - 0.5
      );
      this.wordsToGuess?.forEach((word) => {
        word.guess = '';
      });
      this.nextWord();
    }
    });

   
  }

  async nextWord(): Promise<void> {
    if (this.currentWordIndex < this.wordsToGuess.length - 1) {
      this.currentWord = this.wordsToGuess[++this.currentWordIndex].origin;
    } else {
      this.gameOver = true;
      const game: GamePlayed = {
        date: new Date(),
        idCategory: this.idCategory,
        numOfPoints: this.score,
        secondsLeftInGame: this.timerComponent.getTimeLeft(),
        secondsPlayed: this.gameDuration - this.timerComponent.getTimeLeft(),
      };
      await this.gamePlayerDifficultyService.addGamePlayed(game);
    }
  }

  getScore() {
    return Math.floor(100 * (this.score / 6));
  }

  checkAnswer(isCorrect: boolean): void {
    if (!this.currentCategory || !this.currentWord) return;
    isCorrect
      ? (this.wordsToGuess[this.currentWordIndex].guess = 'Yes')
      : (this.wordsToGuess[this.currentWordIndex].guess = 'No');
    const correct = this.currentCategory.words.some(
      (word) => word.origin === this.currentWord
    );

    if (isCorrect === correct) {
      this.guesses[this.currentWordIndex] = true;
      this.score++;
      this.showDialog(true);
    } else {
      this.guesses[this.currentWordIndex] = false;
      this.showDialog(false);
    }
    this.nextWord();
  }

  showDialog(isSuccess: boolean): void {
    this.dialog.open(DialogMatchGameComponent, {
      data: isSuccess,
    });
  }

  progressValue(): number {
    return (this.currentWordIndex / this.wordsToGuess.length) * 100;
  }

  restartGame(): void {
    this.currentWordIndex = -1;
    this.score = 0;
    this.wordsToGuess = [];
    this.gameOver = false;
    this.guesses = [];
    this.isLoading=true;
    this.startGame();
    this.isLoading=false;
  }

  async handleTimeUp(): Promise<void> {
    this.gameOver = true;
    this.showDialog(false);
    const game: GamePlayed = {
      date: new Date(),
      idCategory: this.idCategory,
      numOfPoints: this.score,
      secondsLeftInGame: 0,
      secondsPlayed: this.gameDuration,
    };
    await this.gamePlayerDifficultyService.addGamePlayed(game);
  }

  handleTimeLeftReport(timeLeft: number): void {
    this.displayTimeLeft = this.formatTime(timeLeft);
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
  }
}
