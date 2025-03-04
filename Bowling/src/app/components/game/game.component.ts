import { Component, inject, signal } from '@angular/core';
import { ScoreboardComponent } from "../scoreboard/scoreboard.component";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { GameService } from '../../services/game.service';
import { PlayerService } from '../../services/player.service';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { PlayerDialogComponent } from '../../player-dialog/player-dialog.component';



@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  providers: [GameService],
  imports: [
    ScoreboardComponent,
    MatToolbarModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule
]
})
export class GameComponent {
  playerService = inject(PlayerService);

  constructor(private dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(PlayerDialogComponent);
  }
  
}


