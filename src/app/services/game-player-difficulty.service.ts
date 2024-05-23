import { Injectable } from '@angular/core';
import { GamePlayed } from '../../shared/model/game-Played';

@Injectable({
  providedIn: 'root',
})
export class GamePlayerDifficultyService {
  private readonly GAME_PLAYED_KEY = 'GamesPlayed';
  private readonly NEXT_ID_KEY = 'nextIdGame';

  constructor() {}

  private getGamesPlayed(): GamePlayed[] {
    const gamesPlayedString = localStorage.getItem(this.GAME_PLAYED_KEY);
    return gamesPlayedString ? JSON.parse(gamesPlayedString) : [];
  }

  list(): GamePlayed[] {
    return this.getGamesPlayed();
  }

  private getNextId(): number {
    const nextIdString = localStorage.getItem(this.NEXT_ID_KEY);
    return nextIdString ? parseInt(nextIdString, 10) : 1;
  }

  private setNextId(id: number): void {
    localStorage.setItem(this.NEXT_ID_KEY, id.toString());
  }

  addGamePlayed(gamePlayed: GamePlayed): void {
    const nextId = this.getNextId();
    gamePlayed.idGame = nextId;
    const gamesPlayed = this.getGamesPlayed();
    gamesPlayed.push(gamePlayed);
    this.setGamesPlayed(gamesPlayed);
    this.setNextId(nextId + 1);
  }

  setGamesPlayed(gamesPlayed: GamePlayed[]): void {
    localStorage.setItem(this.GAME_PLAYED_KEY, JSON.stringify(gamesPlayed));
  }

  getNumberOfLearnedCategories(): number {
    const gamesPlayed = this.getGamesPlayed();
    const learnedCategoryIds = new Set(
      gamesPlayed.map((game) => game.idCategory)
    );
    return learnedCategoryIds.size;
  }

  getNumberOfUnlearnedCategories(totalCategories: number): number {
    const numberOfLearnedCategories = this.getNumberOfLearnedCategories();
    return totalCategories - numberOfLearnedCategories;
  }

  getTotalPlaytime(): number {
    const games = this.getGamesPlayed();
    return games.reduce((total, game) => total + game.secondsPlayed, 0);
  }

  getAverageGameTime(): number {
    const games = this.getGamesPlayed();
    return games.length > 0
      ? this.getTotalPlaytime() / games.length
      : 0;
  }

  getGamesFinishedOnTimePercent(): number {
    const games = this.getGamesPlayed();
    const gamesFinishedOnTime = games.filter(game => game.secondsLeftInGame > 0).length;
    return games.length > 0
      ? (gamesFinishedOnTime / games.length) * 100
      : 0;
  }
}
