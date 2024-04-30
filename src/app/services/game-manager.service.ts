import { Injectable } from '@angular/core';
import { GameProfile } from '../../shared/model/game-Profile';
import { GameDifficulty } from '../../shared/model/game-Difficulty.enum';

@Injectable({
  providedIn: 'root',
})
export class GameManagerService {
  private gameProfile: GameProfile[] = [
    {
      gameDescription:
        'Find the pairs that match. Each correct match will increase your score',
      gameDifficulty: GameDifficulty.HARD,
      id: 0,
      name: 'matching words',
      url: 'matchingGameComponent',
    },
    {
      gameDescription:
        'Unscramble the letters to form the correct word. Get ready to test your vocabulary',
      gameDifficulty: GameDifficulty.EASY,
      id: 1,
      name: 'mixed words',
      url: 'MixedWords',
    },

    {
      gameDescription:
        'Sort the words into their correct categories. Test your knowledge!',
      gameDifficulty: GameDifficulty.MEDIUM,
      id: 2,
      name: 'word sorter',
      url: 'WordSorterGameComponent',
    },
  ];

  constructor() {}
  get gamesProfile() {
    return this.gameProfile;
  }
}
