import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-throw-ball',
  templateUrl: './throw-ball.component.html',
  styleUrls: ['./throw-ball.component.css'],
  imports: [
    MatCardModule, 
    MatButtonModule
  ]
})
export class ThrowBallComponent {
  constructor(private gameService: GameService) {}

  throwBall() {
    this.gameService.rollRandom();
  }
}
