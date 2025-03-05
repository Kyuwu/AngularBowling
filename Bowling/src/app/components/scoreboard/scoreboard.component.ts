import { Component, signal, effect } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Player, Frame } from '../../interfaces/bowling';
import { BowlingGameService } from '../../services/bowling-game.service';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss'],
})
export class ScoreboardComponent {
  // Signal to store the list of players.
  players = signal<Player[]>([]);

  // Signal to store an array of frame numbers (0-9).
  frames = signal<number[]>([]);

  // Signal to store the displayed columns for the table.
  displayedColumns = signal<string[]>([]);

  constructor(private gameService: BowlingGameService) {
    // Initialize signals after gameService is injected.
    this.players.set(this.gameService.getPlayers()());
    this.frames.set(Array(10).fill(0).map((_, i) => i));

    // Construct the displayed columns array, including player name, frames, and total score.
    this.displayedColumns.set([
      'name',
      ...this.frames().map((i) => `frame${i + 1}`),
      'total',
    ]);

    // Use effect to react to changes in the players signal from the game service.
    // This ensures the scoreboard updates whenever the player list changes.
    effect(() => {
      const players = this.gameService.getPlayers()();
      console.log('Scoreboard effect received players update:', players);
      this.players.set(players);
    });
  }

  // Function to determine how rolls should be displayed in the scoreboard.
  displayRolls(frame: Frame): string {
    // Return '-' if the frame or rolls are empty.
    if (!frame || !frame.rolls || frame.rolls.length === 0) {
      return '-';
    }

    // Display 'X' for a strike.
    if (frame.isStrike) {
      console.log('Displaying strike (X) for rolls:', frame.rolls);
      return 'X';
    }

    // Display spare as 'firstRoll /'.
    if (frame.isSpare) {
      console.log('Displaying spare (/) for rolls:', frame.rolls);
      return `${frame.rolls[0] || 0} /`;
    }

    // Display '-' for a gutter frame.
    if (frame.isGutter) {
      console.log('Displaying gutter (-) for rolls:', frame.rolls);
      return '-';
    }

    // Display regular rolls joined by a space.
    console.log('Displaying regular rolls:', frame.rolls);
    return frame.rolls.join(' ');
  }

  // Function to determine the CSS class for a roll based on its type.
  getRollClass(frame: Frame, rollIndex: number): string {
    // Return empty string if the frame or roll index is invalid.
    if (!frame || !frame.rolls || frame.rolls.length <= rollIndex) return '';

    // Apply 'split' class to the first roll of a split frame.
    if (frame.isSplit && rollIndex === 0) return 'split';

    // Apply 'gutter' class to all rolls in a gutter frame.
    if (frame.isGutter && rollIndex < frame.rolls.length) return 'gutter';

    // Return empty string for regular rolls.
    return '';
  }
}