import { GameDifficulty } from './game-Difficulty.enum';

export class GameProfile {
  id: number;
  name: string;
  gameDescription: string;
  gameDifficulty: GameDifficulty;
  url: string;

  /**
   *
   */
  constructor(
    id: number,
    name: string,
    gameDescription: string,
    gameDifficulty: GameDifficulty,
    url: string
  ) {
    this.id = id;
    this.name = name;
    this.gameDescription = gameDescription;
    this.gameDifficulty = gameDifficulty;
    this.url = url;
  }
}
