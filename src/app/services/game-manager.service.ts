import { Injectable } from '@angular/core';
import { GameProfile } from '../../shared/model/gameProfile';
import { GameDifficulty } from '../../shared/model/gameDifficulty.enum';

@Injectable({
  providedIn: 'root'
})
export class GameManagerService {
private gameProfile:GameProfile[]=[
  {
    gameDescription:"Find the pairs that match. Each correct match will increase your score",
    gameDifficulty:GameDifficulty.hard,
    id:0,
    name:"matching words",
    url:'matchingGameComponent'
  },
  {
    gameDescription:"Unscramble the letters to form the correct word. Get ready to test your vocabulary",
    gameDifficulty:GameDifficulty.easy,
    id:1,
    name:"mixed words",
    url:'MixedWords'
  }
];
   
  constructor() {

   }
   get gamesProfile(){
    return this.gameProfile;
   }
}
