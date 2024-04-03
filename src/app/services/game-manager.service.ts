import { Injectable } from '@angular/core';
import { GameProfile } from '../../shared/model/gameProfile';
import { GameDifficulty } from '../../shared/model/gameDifficulty.enum';

@Injectable({
  providedIn: 'root'
})
export class GameManagerService {
private gameProfile:GameProfile[]=[
  {
    gameDescription:"hvg",
    gameDifficulty:GameDifficulty.hard,
    id:0,
    name:"matching words",
    url:'matchingGameComponent'
  },
  {
    gameDescription:"hjg",
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
