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

@Component({
  selector: 'app-matching-game',
  standalone: true,
  imports: [ NgForOf, MatTableModule, NgIf,DisplayWordComponent],
  templateUrl: './matching-game.component.html',
  styleUrl: './matching-game.component.css'
})


export class MatchingGameComponent {
  @Input() idCategory: string = "";
  words?: TranslatedWord[] = [];
  wordsToDisplay: TranslatedWord[] = [];
  wordsToDisplayTarget: TranslatedWord[] = [];
  wordStatusOrigin: WordStatus[] = new Array(5);
  displayedColumns: string[] = ['OriginWord', 'TargetWord'];

  wordStatusTarget: WordStatus[] = new Array(5);
  endGame: boolean = false;
  tryCount: number = 0;
  gamePoints: number = 16
  category: Category | undefined;

  constructor(private categoryService: CategoriesService, private dialogService: MatDialog) {

  }
  ngOnInit() {

    this.category = this.categoryService.get(parseInt(this.idCategory))
    this.words = this.category?.words;
    let wordsSort = this.words ? this.words?.sort(() => Math.random() - 0.5) : [];
    this.wordsToDisplay = wordsSort?.slice(0, 5);
    this.wordsToDisplayTarget = [...this.wordsToDisplay]?.sort(() => Math.random() - 0.5);
    this.resetWordStatusOrigin();
    this.resetWordStatusTarget();



  }
  resetWordStatusTarget() {
    for (let i = 0; i < this.wordStatusTarget.length; i++) {
      if (this.wordStatusTarget[i]!= WordStatus.disabled)
        this.wordStatusTarget[i] = WordStatus.normal;
    }

  }
  resetWordStatusOrigin() {
    for (let i = 0; i < this.wordStatusOrigin.length; i++) {
      if (this.wordStatusOrigin[i]!= WordStatus.disabled)
        this.wordStatusOrigin[i] = WordStatus.normal;
    }
  }

  selectOriginWord(index: number) {
    this.resetWordStatusOrigin();
    this.wordStatusOrigin[index] = WordStatus.selected;
    let indexTarget = this.checkSelected('origin');
    if (indexTarget > -1) {
      this.checkMatch(index, indexTarget);

    }


  }
  selectTargetWord(index: number) {
    this.resetWordStatusTarget();
    this.wordStatusTarget[index] = WordStatus.selected;
    let indexOrigin = this.checkSelected('target');
    if (indexOrigin > -1) {
      this.checkMatch(indexOrigin, index)
    }
  }


  checkMatch(indexOrigin: number, indexTarget: number) {
    this.tryCount++
    let isSuccess: boolean;
    if (this.wordsToDisplay[indexOrigin].origin == this.wordsToDisplayTarget[indexTarget].origin)
      isSuccess = true;
    else {
      this.gamePoints = this.gamePoints - 2;
      isSuccess = false;
    }


    let dialogRef = this.dialogService.open(DialogMatchGameComponent, { data: isSuccess });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.wordStatusOrigin[indexOrigin] = WordStatus.disabled;
        this.wordStatusTarget[indexTarget] = WordStatus.disabled;
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
      if (this.wordStatusOrigin[i] != WordStatus.disabled)
        this.endGame = false;

    }
  }
  checkSelected(trigger: string) {
    if (trigger == 'target')
      return this.wordStatusOrigin.findIndex(
        (status: WordStatus) => status == WordStatus.selected)
    else
      return this.wordStatusTarget.findIndex(
        (status: WordStatus) => status == WordStatus.selected)

  }


}
