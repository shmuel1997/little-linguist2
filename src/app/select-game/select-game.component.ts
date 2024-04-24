import { Component, Inject,  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { GameManagerService } from '../services/game-manager.service';
import { GameProfile } from '../../shared/model/gameProfile';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-select-game',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, NgForOf,MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,RouterModule],
  templateUrl: './select-game.component.html',
  styleUrl: './select-game.component.css'
})
export class SelectGameComponent {
  gamesProfile: GameProfile[] = [];
  selectedValue?: GameProfile;
  constructor(
    private gameManagerService: GameManagerService, 
    @Inject (MAT_DIALOG_DATA) public categoryId:number) {
  }
  ngOnInit() {
    this.gamesProfile = this.gameManagerService.gamesProfile;
    this.selectedValue = this.gamesProfile[0];
  }
}