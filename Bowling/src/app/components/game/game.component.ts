import { Component, signal } from '@angular/core';
import { ScoreboardComponent } from "../scoreboard/scoreboard.component";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { GameService } from '../../services/game.service';
import { ThrowBallComponent } from '../throw-ball/throw-ball.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  imports: [
    ScoreboardComponent, 
    ThrowBallComponent, 
    MatToolbarModule, 
    MatCardModule
  ]
})
export class GameComponent {
  rolledPins = signal<number | null>(null);
  showAnimation = signal(false);

  constructor(private gameService: GameService) {}

  rollBall() {
    const pins = Math.floor(Math.random() * 11); // Simulate random roll
    this.gameService.roll(pins);

    this.rolledPins.set(pins);
    this.showAnimation.set(true);

    setTimeout(() => this.showAnimation.set(false), 1500); // Hide after animation
  }
}

