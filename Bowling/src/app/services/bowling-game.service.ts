import { Injectable, signal } from '@angular/core';
import { GameStateService } from './game-state.service';
import { FrameService } from './frame.service';
import { ScoringService } from './scoring.service';

@Injectable({
  providedIn: 'root',
})
export class BowlingGameService {
  constructor(
    private gameState: GameStateService,
    private frameService: FrameService,
    private scoringService: ScoringService
  ) {}

  startGame(playerNames: string[]) {
    this.gameState.startGame(playerNames);
  }

  getPlayers() {
    return this.gameState.getPlayers();
  }

  getCurrentPlayer() {
    return this.gameState.getCurrentPlayer();
  }

  getCurrentFrame() {
    return this.gameState.getCurrentFrame();
  }

  getRemainingPins(): number {
    const currentPlayer = this.getCurrentPlayer()();
    if (!currentPlayer || !currentPlayer.frames) return 10; // Default to 10 pins if player or frames are undefined

    const currentFrameIndex = this.getCurrentFrame()() - 1;
    const currentFrame = currentPlayer.frames[currentFrameIndex];
    if (!currentFrame) return 10; // Default to 10 pins if currentFrame is undefined

    return this.frameService.getRemainingPins(
      currentFrame,
      this.getCurrentFrame()() === this.gameState.getMaxFrames(),
      currentFrame.rolls.length
    );
  }

  roll(pins: number) {
    const remainingPins = this.getRemainingPins();
    if (pins > remainingPins) return;

    const currentPlayer = this.getCurrentPlayer()();
    if (!currentPlayer || !currentPlayer.frames) return; // Exit if player or frames are undefined

    const currentFrameIndex = this.getCurrentFrame()() - 1;
    let currentFrame = currentPlayer.frames[currentFrameIndex];
    if (!currentFrame) return; // Exit if currentFrame is undefined

    // Update the frame with the new roll
    currentFrame = this.frameService.updateFrame(currentFrame, pins);

    // Update the player's frame in the game state
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
    this.gameState.updatePlayers(updatedPlayers); // Use the new method to update players
    console.log('Players updated after roll:', updatedPlayers);

    // Recalculate scores
    this.scoringService.updateScores();

    // Advance turn
    this.gameState.advanceTurn(this.frameService);
  }

  isGameOver(): boolean {
    return this.gameState.isGameOver();
  }
}