import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { GamePlayerDifficultyService } from '../services/game-player-difficulty.service';
import { GamePlayed } from '../../shared/model/gamePlayed';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent {
  gamePlayerList:GamePlayed[]=[];
  totalNumOfPoints=0;
constructor(private gamePlayerDifficultyService:GamePlayerDifficultyService) {
}
 ngOnInit(){
  this.gamePlayerList= this.gamePlayerDifficultyService.list();
  this.totalNumOfPoints = this.gamePlayerList.reduce((acc, game) => acc + game.numOfPoints, 0);
 }
}
