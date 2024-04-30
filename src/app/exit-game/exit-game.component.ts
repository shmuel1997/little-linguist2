import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-exit-game',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    RouterModule,
  ],
  templateUrl: './exit-game.component.html',
  styleUrl: './exit-game.component.css',
})
export class ExitGameComponent {}
