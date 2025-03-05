import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ScoreboardComponent } from '../scoreboard/scoreboard.component';
import { GameControlsComponent } from '../game-controls/game-controls.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatToolbarModule,
    ScoreboardComponent,
    GameControlsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}