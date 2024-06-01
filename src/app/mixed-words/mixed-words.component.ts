import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
import { GameManagerService } from '../services/game-manager.service';
import { GameDifficulty } from '../../shared/model/game-Difficulty.enum';
import { TimerComponent } from '../timer/timer.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    TimerComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './mixed-words.component.html',
  styleUrl: './mixed-words.component.css',
})
export class MixedWordsComponent implements OnInit {
  isLoading = true;
  @Input() idCategory: string = '';
  category: Category | undefined;
  words?: TranslatedWord[];
  index = -1;
  mixWord: string = '';
  numSuccess = 0;
  endGame = false;
  tryCount: number = 0;
  gamePoints: number = 16;
  grade: number = 0;
  gameDuration: number = 0;
  displayTimeLeft: string = '';

  @ViewChild(TimerComponent) timerComponent!: TimerComponent;

  constructor(
    private categoryService: CategoriesService,
    private dialogService: MatDialog,
    private gamePlayerDifficultyService: GamePlayerDifficultyService,
    private gameManagerService: GameManagerService
  ) {}

  ngOnInit() {
    this.startNewGame();
    this.gameDuration = this.gameManagerService.getGameDuration(
      GameDifficulty.HARD
    );
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
    const isEndOfGame = this.index + 1 === this.words?.length;
    if (!isEndOfGame)
      this.dialogService.open(DialogMatchGameComponent, {
        data: isSuccess,
      });

    if (isSuccess) {
      this.numSuccess++;
    } else {
      this.gamePoints -= 2;
    }

    if (isEndOfGame) {
      const game: GamePlayed = {
        date: new Date(),
        idCategory: this.idCategory,
        numOfPoints: this.gamePoints,
        secondsLeftInGame: this.timerComponent.getTimeLeft(),
        secondsPlayed: this.gameDuration - this.timerComponent.getTimeLeft(),
      };
      this.gamePlayerDifficultyService.addGamePlayed(game).then(() => {
        this.endGame = true;
      });
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
    this.isLoading=true;
    this.index = -1;
    this.numSuccess = 0;
    this.endGame = false;
    this.tryCount = 0;
    this.gamePoints = 16;
    this.categoryService.get(this.idCategory).then((res) => {
      this.category = res;
      this.words = this.category?.['words'];
      this.words?.forEach((word) => {
        word.guess = '';
      });
      this.nextWord();
      this.isLoading = false;
    });
  }
  calculateGrade(): number {
    const totalWords = this.words?.length || 0;
    const correctAnswers = this.numSuccess;
    const grade = (correctAnswers / totalWords) * 100;
    return grade;
  }
  async handleTimeUp(): Promise<void> {
    this.endGame = true;
    const game: GamePlayed = {
      date: new Date(),
      idCategory: this.idCategory,
      numOfPoints: this.gamePoints,
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

  private padTime(time: number): string {
    return time < 10 ? `0${time}` : `${time}`;
  }
}
