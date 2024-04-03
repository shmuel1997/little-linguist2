import { Injectable } from '@angular/core';
import { GamePlayed } from '../../shared/model/gamePlayed';

@Injectable({
  providedIn: 'root'
})
export class GamePlayerDifficultyService {
  private readonly   GAME_PLAYED_KEY = 'GamesPlayed';

  constructor() { }

  private getGamesPlayed() : Map<number, GamePlayed>{
    let gamesPlayedString = localStorage.getItem(this.GAME_PLAYED_KEY);

    if (!gamesPlayedString) {
      return new Map<number, GamePlayed>();
    } else {
      return new Map<number, GamePlayed>(JSON.parse(gamesPlayedString));
    }
  }
  list():GamePlayed[]{
    return Array.from(this.getGamesPlayed().values());

  }
  addGamePlayed(gamePlayed:GamePlayed){
    let gamesPlayedMap = this.getGamesPlayed();
    gamesPlayedMap.set(gamePlayed.idGame, gamePlayed);

    this.setGamesPlayed(gamesPlayedMap)
  }
  setGamesPlayed(gamesPlayedMap: Map<number, GamePlayed>) {
    localStorage.setItem(this.GAME_PLAYED_KEY, JSON.stringify(Array.from(gamesPlayedMap)));

  }
}
