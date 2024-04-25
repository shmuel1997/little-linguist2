import { NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-dialog-match-game',
  standalone: true,
  imports: [NgIf, MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatIconModule,
    MatDialogClose],
  templateUrl: './dialog-match-game.component.html',
  styleUrl: './dialog-match-game.component.css'
})
export class DialogMatchGameComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public isSuccess: boolean) {

  }
}
