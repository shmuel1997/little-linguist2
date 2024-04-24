import { Injectable } from '@angular/core';
import { GamePlayed } from '../../shared/model/gamePlayed';

@Injectable({
  providedIn: 'root'
})
export class GamePlayerDifficultyService {
  private readonly  GAME_PLAYED_KEY = 'GamesPlayed';
  private readonly NEXT_ID_KEY = 'nextIdGame';

  constructor() { }

  private getGamesPlayed() : Map<number, GamePlayed>{
    const gamesPlayedString = localStorage.getItem(this.GAME_PLAYED_KEY);

    if (!gamesPlayedString) {
      return new Map<number, GamePlayed>();
    } else {
      return new Map<number, GamePlayed>(JSON.parse(gamesPlayedString));
    }
  }
  list():GamePlayed[]{
    return Array.from(this.getGamesPlayed().values());

  }
  private getNextId() : number {
    const nextIdString = localStorage.getItem(this.NEXT_ID_KEY); 
    return nextIdString ? parseInt(nextIdString) : 0;
  }
  private setNextId(id : number) : void {
    localStorage.setItem(this.NEXT_ID_KEY, id.toString());
  }
  addGamePlayed(gamePlayed:GamePlayed){
    gamePlayed.idGame = this.getNextId();
    const gamesPlayedMap = this.getGamesPlayed();
    gamesPlayedMap.set(gamePlayed.idGame, gamePlayed);
    this.setGamesPlayed(gamesPlayedMap);
    this.setNextId(++gamePlayed.idGame);

  }
  setGamesPlayed(gamesPlayedMap: Map<number, GamePlayed>) {
    localStorage.setItem(this.GAME_PLAYED_KEY, JSON.stringify(Array.from(gamesPlayedMap)));

  }
  getNumberOfLearnedCategories(): number {
    const gamesPlayedArray = Array.from(this.getGamesPlayed().values());
    const learnedCategoryIds = new Set(gamesPlayedArray.map(game => game.idCategory));
    return learnedCategoryIds.size;
  }
  
  getNumberOfUnlearnedCategories(totalCategories: number): number {
    const gamesPlayedArray = Array.from(this.getGamesPlayed().values());
    const learnedCategoryIds = new Set(gamesPlayedArray.map(game => game.idCategory));
    return totalCategories - learnedCategoryIds.size;
  }
  
}
