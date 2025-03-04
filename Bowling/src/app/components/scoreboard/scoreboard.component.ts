import { Component, Signal, input } from '@angular/core';
import { GameService } from '../../services/game.service';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import Player from '../../types/player';
import { PlayerService } from '../../services/player.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss'],
  providers: [GameService],
  imports: [
    MatCardModule,
    MatGridListModule,     
    MatButtonModule
  ],
})
export class ScoreboardComponent {
  readonly player = input<Player>();
  // Signal representing the frames of the bowling game. Each frame is an array of rolls.
  frames: Signal<number[][]>;
  // Signal representing the total score of the bowling game.
  totalScore: Signal<number>;
  // Signal representing the cumulative scores per frame.
  cumulativeScores: Signal<number[]>;

  constructor(private gameService: GameService, private playerService: PlayerService) {
    // Inject the GameService and initialize the signals.
    this.frames = this.gameService.getFrames();
    this.totalScore = this.gameService.getTotalScore();
    this.cumulativeScores = this.gameService.getCumulativeScores();
  }

  displayRoll(frame: number[], roll: number, rollIndex: number, frameIndex: number): string {
    return this.gameService.displayRoll(frame, roll, rollIndex, frameIndex);
  }

  throwBall() {
    this.gameService.rollRandom();
  }
}
