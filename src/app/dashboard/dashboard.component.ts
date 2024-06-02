import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { GamePlayerDifficultyService } from '../services/game-player-difficulty.service';
import { GamePlayed } from '../../shared/model/game-Played';
import { CategoriesService } from '../services/categories.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatProgressSpinnerModule],
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
  isLoading = true;
  constructor(
    private gamePlayerDifficultyService: GamePlayerDifficultyService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.gamePlayerDifficultyService.list().then(async (res) => {
      this.gamePlayerList = res;
      this.totalNumOfPoints = this.gamePlayerList.reduce(
        (acc, game) => acc + game.numOfPoints,
        0
      );

      const categories = await this.categoriesService.list();
      this.totalCategories = categories.length;

      const validCategoryIds = new Set(
        categories.map((category) => category.id)
      );
      const validGames = this.gamePlayerList.filter((game) =>
        validCategoryIds.has(game.idCategory)
      );

      const learnedCategoryIds = new Set(
        validGames.map((game) => game.idCategory)
      );
      this.numberOfLearnedCategories = learnedCategoryIds.size;

      this.numberOfUnlearnedCategories = Math.max(
        this.totalCategories - this.numberOfLearnedCategories,
        0
      );

      this.totalPlayedTime = validGames.reduce(
        (total, game) => total + game.secondsPlayed,
        0
      );
      this.averageGameTime =
        validGames.length > 0 ? this.totalPlayedTime / validGames.length : 0;
      this.gamesFinishedOnTimePercent =
        validGames.length > 0
          ? (validGames.filter((game) => game.secondsLeftInGame > 0).length /
              validGames.length) *
            100
          : 0;

      this.isLoading = false;
    });
  }
}
