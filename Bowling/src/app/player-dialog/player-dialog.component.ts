import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { PlayerService } from '../services/player.service';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatCard } from '@angular/material/card';


@Component({
  selector: 'app-player-dialog',
  imports: [MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    MatCard,
    MatIconModule,
  ],
  templateUrl: './player-dialog.component.html',
  styleUrl: './player-dialog.component.scss'
})
export class PlayerDialogComponent {
  playerName: string = '';
  playerService = inject(PlayerService);
  
  constructor(
    public dialogRef: MatDialogRef<PlayerDialogComponent>,
  ) {}

  addPlayer() {
    this.playerService.addPlayer("tewst");
    this.playerName = '';
  }

  removePlayer(index: number) {
    this.playerService.removePlayer(index);
  }

  close() {
    this.dialogRef.close();
  }
}
