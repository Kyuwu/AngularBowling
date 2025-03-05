import { Injectable, signal, computed } from '@angular/core';
import { GameStateService } from './game-state.service';
import { Player } from '../interfaces/bowling';

@Injectable({
  providedIn: 'root',
})
export class ScoringService {
  private _players = signal<Player[]>([]);
  private _calculatedPlayers = computed(() => this.calculateScores(this._players()));

  constructor(private gameState: GameStateService) {
    // Initialize _players lazily when needed or on demand
    this.initializePlayers();
  }

  private initializePlayers() {
    this._players.set(this.gameState.getPlayers()());
  }

  private calculateScores(players: Player[]): Player[] {
    const updatedPlayers = [...players];
    const maxFrames = this.gameState.getMaxFrames(); // Use getter for maxFrames

    for (const player of updatedPlayers) {
      let runningTotal = 0;
      for (let i = 0; i < maxFrames; i++) {
        const frame = player.frames[i];
        frame.score = 0;

        if (frame.rolls.length === 0) continue;

        frame.score = frame.rolls.reduce((sum, roll) => sum + roll, 0);
        console.log(`Frame ${i + 1} - Rolls: ${frame.rolls}, Initial Score: ${frame.score}`);

        // Add bonuses for strikes and spares
        if (i < maxFrames - 1) {
          if (frame.isStrike) {
            const nextFrame = player.frames[i + 1];
            if (nextFrame && nextFrame.rolls.length > 0) {
              frame.score += nextFrame.rolls[0]; // Add first bonus roll
              console.log(`Adding bonus from nextFrame[0]: ${nextFrame.rolls[0]}`);
              if (nextFrame.rolls.length > 1) {
                frame.score += nextFrame.rolls[1]; // Add second bonus roll
                console.log(`Adding bonus from nextFrame[1]: ${nextFrame.rolls[1]}`);
              } else if (i + 2 < maxFrames) {
                const nextNextFrame = player.frames[i + 2];
                if (nextNextFrame && nextNextFrame.rolls.length > 0) {
                  frame.score += nextNextFrame.rolls[0]; // Add third bonus roll
                  console.log(`Adding bonus from nextNextFrame[0]: ${nextNextFrame.rolls[0]}`);
                }
              }
            }
          } else if (frame.isSpare) {
            const nextFrame = player.frames[i + 1];
            if (nextFrame && nextFrame.rolls.length > 0) {
              frame.score += nextFrame.rolls[0]; // Add bonus roll for spare
              console.log(`Adding spare bonus from nextFrame[0]: ${nextFrame.rolls[0]}`);
            }
          }
        } else {
          // Special handling for the 10th frame
          if (frame.isStrike) {
            if (frame.rolls.length >= 2) {
              frame.score += frame.rolls[1]; // Add second roll as bonus
              console.log(`10th frame strike bonus from roll[1]: ${frame.rolls[1]}`);
            }
            if (frame.rolls.length === 3) {
              frame.score += frame.rolls[2]; // Add third roll as bonus for perfect game
              console.log(`10th frame strike bonus from roll[2]: ${frame.rolls[2]}`);
            }
          } else if (frame.isSpare) {
            if (frame.rolls.length === 3) {
              frame.score += frame.rolls[2]; // Add bonus roll for spare in 10th frame
              console.log(`10th frame spare bonus from roll[2]: ${frame.rolls[2]}`);
            }
          }
          // Ensure the 10th frame includes all three rolls for a perfect game
          if (frame.rolls.length === 3 && frame.isStrike) {
            frame.score = 30; // For a perfect game (X, X, X), score should be 30
            console.log(`10th frame perfect game score set to 30`);
          }
        }

        runningTotal += frame.score; // Accumulate the running total
        frame.runningTotal = runningTotal; // Store the running total for this frame
        console.log(`Frame ${i + 1} - Final Score: ${frame.score}, Running Total: ${frame.runningTotal}`);
      }
      player.totalScore = runningTotal; // Update the overall total score
      console.log(`Player ${player.name} Total Score: ${player.totalScore}`);
    }
    return updatedPlayers;
  }

  updateScores() {
    const updatedPlayers = this.calculateScores(this.gameState.getPlayers()());
    this.gameState.updatePlayers(updatedPlayers); // Use the new method to update players
  }

  // Getter for calculated players if needed elsewhere
  getCalculatedPlayers() {
    return this._calculatedPlayers;
  }
}