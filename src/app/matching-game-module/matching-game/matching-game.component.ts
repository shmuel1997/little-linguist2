import { Component, Input } from '@angular/core';
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
import { GamePlayed } from '../../../shared/model/gamePlayed';
import { GamePlayerDifficultyService } from '../../services/game-player-difficulty.service';

@Component({
  selector: 'app-matching-game',
  standalone: true,
  imports: [MatIconModule, NgForOf, MatTableModule, NgIf, DisplayWordComponent],
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

  constructor(
    private categoryService: CategoriesService,
    private dialogService: MatDialog,
    private gamePlayerDifficultyService: GamePlayerDifficultyService
  ) {}
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnInit() {
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
      if (this.wordStatusTarget[i] != WordStatus.disabled)
        this.wordStatusTarget[i] = WordStatus.normal;
    }
  }
  resetWordStatusOrigin() {
    for (let i = 0; i < this.wordStatusOrigin.length; i++) {
      if (this.wordStatusOrigin[i] != WordStatus.disabled)
        this.wordStatusOrigin[i] = WordStatus.normal;
    }
  }

  selectOriginWord(index: number) {
    this.resetWordStatusOrigin();
    this.wordStatusOrigin[index] = WordStatus.selected;
    const indexTarget = this.checkSelected('origin');
    if (indexTarget > -1) {
      this.checkMatch(index, indexTarget);
    }
  }
  selectTargetWord(index: number) {
    this.resetWordStatusTarget();
    this.wordStatusTarget[index] = WordStatus.selected;
    const indexOrigin = this.checkSelected('target');
    if (indexOrigin > -1) {
      this.checkMatch(indexOrigin, index);
    }
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
          this.wordStatusOrigin[indexOrigin] = WordStatus.disabled;
          this.wordStatusTarget[indexTarget] = WordStatus.disabled;
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
      if (this.wordStatusOrigin[i] != WordStatus.disabled) this.endGame = false;
    }
    if (this.endGame) {
      const game: GamePlayed = {
        date: new Date(),
        idCategory: parseInt(this.idCategory),
        numOfPoints: this.gamePoints,
      };
      this.gamePlayerDifficultyService.addGamePlayed(game);
    }
  }
  checkSelected(trigger: string) {
    if (trigger == 'target')
      return this.wordStatusOrigin.findIndex(
        (status: WordStatus) => status == WordStatus.selected
      );
    else
      return this.wordStatusTarget.findIndex(
        (status: WordStatus) => status == WordStatus.selected
      );
  }
  exit() {
    this.dialogService.open(ExitGameComponent);
  }
}
