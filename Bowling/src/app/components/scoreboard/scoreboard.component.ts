import { Component, computed, Signal } from '@angular/core';
import { GameService } from '../../services/game.service';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css'],
  imports: [MatCardModule, MatGridListModule],
})
export class ScoreboardComponent {
  // Signal representing the frames of the bowling game. Each frame is an array of rolls.
  frames: Signal<number[][]>;
  // Signal representing the total score of the bowling game.
  totalScore: Signal<number>;

  constructor(private gameService: GameService) {
    // Inject the GameService and initialize the frames and totalScore signals.
    this.frames = this.gameService.getFrames();
    this.totalScore = this.gameService.getTotalScore();
  }

  /**
   * Determines if a roll is a spare.
   * A spare occurs when the sum of the first two rolls in a frame is 10.
   *
   * @param frame The array of rolls in the current frame.
   * @param rollIndex The index of the current roll.
   * @param roll The value of the current roll.
   * @returns True if the roll is a spare, false otherwise.
   */
  isSpare(frame: number[], rollIndex: number, roll: number): boolean {
    return rollIndex === 1 && frame[0] + roll === 10;
  }

  /**
   * Determines if a roll is a strike.
   * A strike occurs when a roll is 10.
   *
   * @param roll The value of the current roll.
   * @returns True if the roll is a strike, false otherwise.
   */
  isStrike(roll: number): boolean {
    return roll === 10;
  }

  /**
   * Determines how to display a roll value in the scoreboard.
   *
   * @param frame The array of rolls in the current frame.
   * @param roll The value of the current roll.
   * @param rollIndex The index of the current roll.
   * @param frameIndex The index of the current frame.
   * @returns The string representation of the roll (X, /, -, or the roll value).
   */
  displayRoll(frame: number[], roll: number, rollIndex: number, frameIndex: number): string {
    if (roll === 10) {
      // Display 'X' for a strike, handling the special case for the last frame's first roll.
      return frameIndex === 9 && rollIndex === 0 ? 'X' : 'X';
    } else if (roll === 0) {
      // Display '-' for a gutter ball (0 pins).
      return '-';
    } else if (rollIndex === 1 && frame[0] + roll === 10) {
      // Display '/' for a spare.
      return '/';
    } else {
      // Display the numeric value of the roll.
      return roll.toString();
    }
  }
}