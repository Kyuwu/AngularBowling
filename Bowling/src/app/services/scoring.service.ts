import { Injectable, signal, computed } from '@angular/core';
import { GameStateService } from './game-state.service';
import { Player, Frame } from '../interfaces/bowling'; // Assuming you have these interfaces

@Injectable({
  providedIn: 'root',
})
export class ScoringService {
  // Signal to store the player data, making it reactive.
  private _players = signal<Player[]>([]);

  // Computed signal to automatically recalculate scores when player data changes.
  private _calculatedPlayers = computed(() => this.calculateScores(this._players()));

  constructor(private gameState: GameStateService) {
    // Initialize player data when the service is created.
    this.initializePlayers();
  }

  // Fetches player data from GameStateService and sets the _players signal.
  private initializePlayers(): void {
    this._players.set(this.gameState.getPlayers()());
  }

  // Main function to calculate scores for all players.
  private calculateScores(players: Player[]): Player[] {
    // Create a copy of the players array to avoid mutating the original.
    const updatedPlayers = [...players];
    const maxFrames = this.gameState.getMaxFrames(); // Get the number of frames from GameState.

    for (const player of updatedPlayers) {
      let runningTotal = 0; // Initialize running total for each player.

      for (let frameIndex = 0; frameIndex < maxFrames; frameIndex++) {
        const frame = player.frames[frameIndex];
        frame.score = 0; // Reset frame score.

        // Skip calculations if the frame has no rolls.
        if (frame.rolls.length === 0) continue;

        // Calculate the base score of the frame (sum of rolls).
        frame.score = frame.rolls.reduce((sum, roll) => sum + roll, 0);
        console.log(`Frame ${frameIndex + 1} - Rolls: ${frame.rolls}, Initial Score: ${frame.score}`);

        // Handle bonus rolls for strikes and spares (except the last frame).
        if (frameIndex < maxFrames - 1) {
          this.handleBonusRolls(player, frame, frameIndex, maxFrames);
        } else {
          // Special handling for the 10th (last) frame.
          this.handleLastFrame(player, frame);
        }

        runningTotal += frame.score; // Add frame score to the running total.
        frame.runningTotal = runningTotal; // Store the running total in the frame.
        console.log(`Frame ${frameIndex + 1} - Final Score: ${frame.score}, Running Total: ${frame.runningTotal}`);
      }

      // Ensure the total score does not exceed 300.
      player.totalScore = Math.min(runningTotal, 300);
      console.log(`Player ${player.name} Total Score: ${player.totalScore}`);
    }

    return updatedPlayers;
  }

  // Handles bonus rolls for strikes and spares.
  private handleBonusRolls(player: Player, frame: Frame, frameIndex: number, maxFrames: number): void {
    if (frame.isStrike) {
      const nextFrame = player.frames[frameIndex + 1];
      if (nextFrame && nextFrame.rolls.length > 0) {
        frame.score += nextFrame.rolls[0]; // Add first bonus roll.
        console.log(`Adding bonus from nextFrame[0]: ${nextFrame.rolls[0]}`);

        if (nextFrame.rolls.length > 1) {
          frame.score += nextFrame.rolls[1]; // Add second bonus roll.
          console.log(`Adding bonus from nextFrame[1]: ${nextFrame.rolls[1]}`);
        } else if (frameIndex + 2 < maxFrames) {
          const nextNextFrame = player.frames[frameIndex + 2];
          if (nextNextFrame && nextNextFrame.rolls.length > 0) {
            frame.score += nextNextFrame.rolls[0]; // Add third bonus roll.
            console.log(`Adding bonus from nextNextFrame[0]: ${nextNextFrame.rolls[0]}`);
          }
        }
      }
    } else if (frame.isSpare) {
      const nextFrame = player.frames[frameIndex + 1];
      if (nextFrame && nextFrame.rolls.length > 0) {
        frame.score += nextFrame.rolls[0]; // Add bonus roll for spare.
        console.log(`Adding spare bonus from nextFrame[0]: ${nextFrame.rolls[0]}`);
      }
    }
  }

  // Handles scoring for the last (10th) frame.
  private handleLastFrame(player: Player, frame: Frame): void {
    if (frame.isStrike) {
      if (frame.rolls.length >= 2) {
        frame.score += frame.rolls[1];
        console.log(`10th frame strike bonus from roll[1]: ${frame.rolls[1]}`);
      }
      if (frame.rolls.length === 3) {
        frame.score += frame.rolls[2];
        console.log(`10th frame strike bonus from roll[2]: ${frame.rolls[2]}`);
      }
    } else if (frame.isSpare) {
      if (frame.rolls.length === 3) {
        frame.score += frame.rolls[2];
        console.log(`10th frame spare bonus from roll[2]: ${frame.rolls[2]}`);
      }
    }
    if (frame.rolls.length === 3 && frame.isStrike) {
      frame.score = 30; // Perfect 10th frame score.
      console.log(`10th frame perfect game score set to 30`);
    }
  }

  // Updates player scores by recalculating and updating the GameStateService.
  updateScores(): void {
    const updatedPlayers = this.calculateScores(this.gameState.getPlayers()());
    this.gameState.updatePlayers(updatedPlayers);
  }

  // Getter for the computed player data.
  getCalculatedPlayers(): any {
    return this._calculatedPlayers;
  }
}