import { Component, OnInit,  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoriesService } from '../services/categories.service';
import { DialogMatchGameComponent } from '../matching-game-module/dialog-match-game/dialog-match-game.component';
import { Category } from '../../shared/model/category'; 
import { NgIf,NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ExitGameComponent } from '../exit-game/exit-game.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GamePlayed } from '../../shared/model/gamePlayed';
import { TranslatedWord } from '../../shared/model/translated-word';
import { GamePlayerDifficultyService } from '../services/game-player-difficulty.service';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-word-sorter-game',
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
    RouterModule,
    MatToolbarModule,
    ExitGameComponent,
    
    
  ], 
  templateUrl: './word-sorter-game.component.html',
  styleUrls: ['./word-sorter-game.component.css'] 
})

export class WordSorterGameComponent implements OnInit {
toggleMenu() {
throw new Error('Method not implemented.');
}
  currentWord: string | undefined; 
  currentCategory: Category | undefined; 
  otherCategory: Category | undefined; 
  wordsToGuess: string[] = [];
  currentWordIndex: number = 0;
  score: number = 0;
  gameOver: boolean = false;
progress: unknown;

  constructor(
    private categoriesService: CategoriesService, 
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.startGame();
  }

  startGame(): void {
    
    const categories = this.categoriesService.list();
    
    this.currentCategory = categories[Math.floor(Math.random() * categories.length)];
    this.otherCategory = categories[Math.floor(Math.random() * categories.length)];
    
    
    this.wordsToGuess = [
      ...this.currentCategory.words.map(word => word.origin), 
      ...this.otherCategory.words.map(word => word.origin)
    ].sort(() => Math.random() - 0.5); 

    this.nextWord();
  }

  nextWord(): void {
    if (this.currentWordIndex < this.wordsToGuess.length) {
      this.currentWord = this.wordsToGuess[this.currentWordIndex++];
    } else {
      this.gameOver = true;
    
    }
  }

  checkAnswer(isCorrect: boolean): void {
    if (!this.currentCategory || !this.currentWord) return;

    const correct = this.currentCategory.words.some(
      word => word.origin === this.currentWord
    );
    
    if (isCorrect === correct) {
      this.score++;
      this.showDialog(true);
    } else {
      this.showDialog(false);
    }
    this.nextWord();
  }

  showDialog(isSuccess: boolean): void {
    this.dialog.open(DialogMatchGameComponent, {
      data: { isSuccess }
    });
  }

  restartGame(): void {
    this.currentWordIndex = 0;
    this.score = 0;
    this.gameOver = false;
    this.startGame();
  }
  
}