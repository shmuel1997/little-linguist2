import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { GamePlayerDifficultyService } from '../services/game-player-difficulty.service';
import { GamePlayed } from '../../shared/model/game-Played';
import { CategoriesService } from '../services/categories.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  gamePlayerList: GamePlayed[] = [];
  totalNumOfPoints = 0;
  numberOfLearnedCategories = 0;
  numberOfUnlearnedCategories = 0;
  totalCategories = 0;
  totalPlayedTime = 0;
  averageGameTime = 0;
  gamesFinishedOnTimePercent = 0;

  constructor(
    private gamePlayerDifficultyService: GamePlayerDifficultyService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.gamePlayerList = this.gamePlayerDifficultyService.list();

    this.totalNumOfPoints = this.gamePlayerList.reduce(
      (acc, game) => acc + game.numOfPoints,
      0
    );

    this.numberOfLearnedCategories =
      this.gamePlayerDifficultyService.getNumberOfLearnedCategories();

    this.totalCategories = this.categoriesService.list().length;

    this.numberOfUnlearnedCategories =
      this.gamePlayerDifficultyService.getNumberOfUnlearnedCategories(
        this.totalCategories
      );

    this.totalPlayedTime = this.gamePlayerDifficultyService.getTotalPlaytime();
    this.averageGameTime = this.gamePlayerDifficultyService.getAverageGameTime();
    this.gamesFinishedOnTimePercent = this.gamePlayerDifficultyService.getGamesFinishedOnTimePercent();
  }
}
