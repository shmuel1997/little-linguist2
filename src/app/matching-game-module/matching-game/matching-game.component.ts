import { Component, Input, ViewChild } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { TranslatedWord } from '../../../shared/model/translated-word';
import { WordStatus } from '../models/wordStatus.enum';
import { NgForOf, NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogMatchGameComponent } from '../dialog-match-game/dialog-match-game.component';
import { Category } from '../../../shared/model/category';
import { MatTableModule } from '@angular/material/table';
import { DisplayWordComponent } from '../display-word/display-word.component';
import { MatIconModule } from '@angular/material/icon';
import { ExitGameComponent } from '../../exit-game/exit-game.component';
import { GamePlayed } from '../../../shared/model/game-Played';
import { GamePlayerDifficultyService } from '../../services/game-player-difficulty.service';
import { MatButtonModule } from '@angular/material/button';
import { TimerComponent } from '../../timer/timer.component';
import { GameManagerService } from '../../services/game-manager.service';
import { GameDifficulty } from '../../../shared/model/game-Difficulty.enum';

@Component({
  selector: 'app-matching-game',
  standalone: true,
  imports: [
    MatIconModule,
    NgForOf,
    MatTableModule,
    NgIf,
    DisplayWordComponent,
    MatButtonModule,
    TimerComponent,
    MatIconModule,
  ],
  templateUrl: './matching-game.component.html',
  styleUrl: './matching-game.component.css',
})
export class MatchingGameComponent {
  @Input() idCategory: string = '';
  words?: TranslatedWord[] = [];
  wordsToDisplay: TranslatedWord[] = [];
  wordsToDisplayTarget: TranslatedWord[] = [];
  wordStatusOrigin: WordStatus[] = new Array(5);
  displayedColumns: string[] = ['OriginWord', 'TargetWord'];
  wordStatusTarget: WordStatus[] = new Array(5);
  endGame: boolean = false;
  tryCount: number = 0;
  gamePoints: number = 16;
  category: Category | undefined;
  errorWords: string | undefined;
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
    this.category = this.categoryService.get(parseInt(this.idCategory));
    this.words = this.category?.words;
    if (this.words && this.words?.length < 5)
      this.errorWords =
        'To use this game, a category must contain a minimum of five words';
    else this.errorWords = undefined;
    const wordsSort = this.words
      ? this.words?.sort(() => Math.random() - 0.5)
      : [];
    this.wordsToDisplay = wordsSort?.slice(0, 5);
    this.wordsToDisplayTarget = [...this.wordsToDisplay]?.sort(
      () => Math.random() - 0.5
    );
    this.resetWordStatusOrigin();
    this.resetWordStatusTarget();
  }
  resetWordStatusTarget() {
    for (let i = 0; i < this.wordStatusTarget.length; i++) {
      if (this.wordStatusTarget[i] != WordStatus.Disabled)
        this.wordStatusTarget[i] = WordStatus.Normal;
    }
  }
  resetWordStatusOrigin() {
    for (let i = 0; i < this.wordStatusOrigin.length; i++) {
      if (this.wordStatusOrigin[i] != WordStatus.Disabled)
        this.wordStatusOrigin[i] = WordStatus.Normal;
    }
  }

  selectOriginWord(index: number) {
    if (this.wordStatusOrigin[index] === WordStatus.Disabled) {
      return;
    }

    this.resetWordStatusOrigin();
    this.wordStatusOrigin[index] = WordStatus.Selected;
    const indexTarget = this.checkSelected('origin');
    if (indexTarget > -1) {
      this.checkMatch(index, indexTarget);
    }
  }

  selectTargetWord(index: number) {
    if (this.wordStatusTarget[index] === WordStatus.Disabled) {
      return;
    }

    this.resetWordStatusTarget();
    this.wordStatusTarget[index] = WordStatus.Selected;
    const indexOrigin = this.checkSelected('target');
    if (indexOrigin > -1) {
      this.checkMatch(indexOrigin, index);
    }
  }
  getScore() {
    const correctness = this.wordsToDisplay.filter(
      (word) =>
        this.wordStatusOrigin[this.wordsToDisplay.indexOf(word)] ===
        WordStatus.Disabled
    ).length;
    const totalWords = this.wordsToDisplay.length;
    const score = (correctness / totalWords) * 100;
    return Math.round(score * 100) / 100;
  }

  checkMatch(indexOrigin: number, indexTarget: number) {
    this.tryCount++;
    let isSuccess: boolean;
    if (
      this.wordsToDisplay[indexOrigin].origin ==
      this.wordsToDisplayTarget[indexTarget].origin
    )
      isSuccess = true;
    else {
      this.gamePoints = this.gamePoints - 2;
      isSuccess = false;
    }

    const dialogRef = this.dialogService.open(DialogMatchGameComponent, {
      data: isSuccess,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (isSuccess) {
          this.wordStatusOrigin[indexOrigin] = WordStatus.Disabled;
          this.wordStatusTarget[indexTarget] = WordStatus.Disabled;
        }
        this.checkEndGame();
        if (!this.endGame) {
          this.resetWordStatusOrigin();
          this.resetWordStatusTarget();
        }
      }
    });
  }
  checkEndGame() {
    this.endGame = true;
    for (let i = 0; i < this.wordStatusOrigin.length; i++) {
      if (this.wordStatusOrigin[i] != WordStatus.Disabled) this.endGame = false;
    }
    if (this.endGame) {
      const game: GamePlayed = {
        date: new Date(),
        idCategory: parseInt(this.idCategory),
        numOfPoints: this.gamePoints,
        idGame: 0,
        secondsLeftInGame: this.timerComponent.getTimeLeft(),
        secondsPlayed: this.gameDuration - this.timerComponent.getTimeLeft()
      };
      this.gamePlayerDifficultyService.addGamePlayed(game);
    }
  }
  checkSelected(trigger: string) {
    if (trigger == 'target')
      return this.wordStatusOrigin.findIndex(
        (status: WordStatus) => status == WordStatus.Selected
      );
    else
      return this.wordStatusTarget.findIndex(
        (status: WordStatus) => status == WordStatus.Selected
      );
  }
  exit() {
    this.dialogService.open(ExitGameComponent);
  }
  startNewGame() {
    this.category = this.categoryService.get(parseInt(this.idCategory));
    this.words = this.category?.words;
    if (this.words && this.words.length < 5) {
      this.errorWords = 'To use this game, a category must contain a minimum of five words';
    } else {
      this.errorWords = undefined;
      const wordsSort = this.words ? [...this.words].sort(() => Math.random() - 0.5) : [];
      this.wordsToDisplay = wordsSort.slice(0, 5);
      this.wordsToDisplayTarget = [...this.wordsToDisplay].sort(() => Math.random() - 0.5);
      this.wordStatusOrigin.fill(WordStatus.Normal);
      this.wordStatusTarget.fill(WordStatus.Normal);
      this.endGame = false;
      this.tryCount = 0;
      this.gamePoints = 16;
      this.gameDuration = this.gameManagerService.getGameDuration(GameDifficulty.EASY); 
      this.timerComponent.resetTimer(); 
      setTimeout(() => this.timerComponent.startTimer(), 100);
    }
  }
  handleTimeUp(): void {
    this.endGame = true;
    const game: GamePlayed = {
      date: new Date(),
      idCategory: parseInt(this.idCategory),
      numOfPoints: this.gamePoints,
      idGame: 0,
      secondsLeftInGame: 0,
      secondsPlayed: this.gameDuration
    };
    this.gamePlayerDifficultyService.addGamePlayed(game);
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
