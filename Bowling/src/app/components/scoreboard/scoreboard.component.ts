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
  players = signal<Player[]>([]);
  frames = signal<number[]>([]);
  displayedColumns = signal<string[]>([]);

  constructor(private gameService: BowlingGameService) {
    // Initialize signals after gameService is injected
    this.players.set(this.gameService.getPlayers()());
    this.frames.set(Array(10).fill(0).map((_, i) => i));
    this.displayedColumns.set([
      'name',
      ...this.frames().map((i) => `frame${i + 1}`),
      'total',
    ]);

    // Use effect to react to players signal changes
    effect(() => {
      const players = this.gameService.getPlayers()();
      console.log('Scoreboard effect received players update:', players);
      this.players.set(players);
    });
  }

  displayRolls(frame: Frame): string {
    if (!frame || !frame.rolls || frame.rolls.length === 0) {
      return '-';
    }

    if (frame.isStrike) {
      console.log('Displaying strike (X) for rolls:', frame.rolls);
      return 'X';
    }

    if (frame.isSpare) {
      console.log('Displaying spare (/) for rolls:', frame.rolls);
      return `${frame.rolls[0] || 0} /`;
    }

    if (frame.isGutter) {
      console.log('Displaying gutter (-) for rolls:', frame.rolls);
      return '-';
    }

    // For regular rolls (open frame, no mark), join with a space
    console.log('Displaying regular rolls:', frame.rolls);
    return frame.rolls.join(' ');
  }

  getRollClass(frame: Frame, rollIndex: number): string {
    if (!frame || !frame.rolls || frame.rolls.length <= rollIndex) return '';
    if (frame.isSplit && rollIndex === 0) return 'split'; // Highlight first roll of a split in red
    if (frame.isGutter && rollIndex < frame.rolls.length) return 'gutter'; // Style gutters
    return '';
  }
}