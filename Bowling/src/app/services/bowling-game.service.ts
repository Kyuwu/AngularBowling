import { Injectable, signal } from '@angular/core';
import { GameStateService } from './game-state.service';
import { FrameService } from './frame.service';
import { ScoringService } from './scoring.service';
import { Player } from '../interfaces/bowling'; // Assuming you have a Player interface

@Injectable({
  providedIn: 'root',
})
export class BowlingGameService {
  constructor(
    private gameState: GameStateService,
    private frameService: FrameService,
    private scoringService: ScoringService
  ) {}

  // Starts a new game with the given player names.
  startGame(playerNames: string[]): void {
    this.gameState.startGame(playerNames);
  }

  // Retrieves the signal containing the array of players.
  getPlayers(): any {
    return this.gameState.getPlayers();
  }

  // Retrieves the computed signal for the current player.
  getCurrentPlayer(): any {
    return this.gameState.getCurrentPlayer();
  }

  // Retrieves the signal for the current frame number.
  getCurrentFrame(): any {
    return this.gameState.getCurrentFrame();
  }

  // Calculates the number of remaining pins for the current roll.
  getRemainingPins(): number {
    const currentPlayer = this.getCurrentPlayer()();
    if (!currentPlayer || !currentPlayer.frames) return 10;

    const currentFrameIndex = this.getCurrentFrame()() - 1;
    const currentFrame = currentPlayer.frames[currentFrameIndex];
    if (!currentFrame) return 10;

    const isTenthFrame = this.getCurrentFrame()() === this.gameState.getMaxFrames();
    const currentRoll = currentFrame.rolls.length;

    return this.frameService.getRemainingPins(currentFrame, isTenthFrame, currentRoll);
  }

  // Processes a roll, updating the game state and scores.
  roll(pins: number): void {
    const remainingPins = this.getRemainingPins();
    if (pins > remainingPins) return;

    const currentPlayer = this.getCurrentPlayer()();
    if (!currentPlayer || !currentPlayer.frames) return;

    const currentFrameIndex = this.getCurrentFrame()() - 1;
    let currentFrame = currentPlayer.frames[currentFrameIndex];
    if (!currentFrame) return;

    // Update the frame with the new roll.
    currentFrame = this.frameService.updateFrame(currentFrame, pins);

    // Update the player's frame in the game state.
    this.updatePlayerFrame(currentPlayer, currentFrameIndex, currentFrame);

    // Recalculate scores.
    this.scoringService.updateScores();

    // Advance the turn.
    this.gameState.advanceTurn(this.frameService);
  }

  // Updates the player's frame in the game state.
  private updatePlayerFrame(currentPlayer: Player, currentFrameIndex: number, currentFrame: any): void {
    const players = this.gameState.getPlayers()();
    const updatedPlayers = [...players];

    updatedPlayers[this.gameState.getCurrentPlayerIndex()] = {
      ...currentPlayer,
      frames: [
        ...currentPlayer.frames.slice(0, currentFrameIndex),
        currentFrame,
        ...currentPlayer.frames.slice(currentFrameIndex + 1),
      ],
    };

    this.gameState.updatePlayers(updatedPlayers);
    console.log('Players updated after roll:', updatedPlayers);
  }

  // Checks if the game is over.
  isGameOver(): boolean {
    return this.gameState.isGameOver();
  }
}