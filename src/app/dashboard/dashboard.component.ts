import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { GamePlayerDifficultyService } from '../services/game-player-difficulty.service';
import { GamePlayed } from '../../shared/model/gamePlayed';
import { CategoriesService } from '../services/categories.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {
  gamePlayerList: GamePlayed[] = [];
  totalNumOfPoints = 0;
  numberOfLearnedCategories = 0;
  numberOfUnlearnedCategories = 0;
  totalCategories = 0; 

  constructor(
    private gamePlayerDifficultyService: GamePlayerDifficultyService,
    private categoriesService: CategoriesService 
  ) {}

  ngOnInit() {
    this.gamePlayerList = this.gamePlayerDifficultyService.list();
    
    this.totalNumOfPoints = this.gamePlayerList.reduce((acc, game) => acc + game.numOfPoints, 0);
    
    this.numberOfLearnedCategories = this.gamePlayerDifficultyService.getNumberOfLearnedCategories();
    
    this.totalCategories = this.categoriesService.list().length;
    
    this.numberOfUnlearnedCategories = this.gamePlayerDifficultyService.getNumberOfUnlearnedCategories(this.totalCategories);
  
  }
}