import { Injectable, signal, computed } from '@angular/core';
import { Player, Frame } from '../interfaces/bowling';
import { FrameService } from './frame.service';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  // Signal to store the array of players.
  private players = signal<Player[]>([]);

  // Signal to track the index of the current player.
  private currentPlayerIndex = signal<number>(0);

  // Signal to track the current frame number.
  private currentFrame = signal<number>(1);

  // Constant for the maximum number of frames in a game.
  private maxFrames = 10;

  constructor() {}

  // Initializes a new game with the given player names.
  startGame(playerNames: string[]): void {
    // Validate that at least one player name is provided.
    if (!playerNames || playerNames.length === 0) {
      throw new Error('At least one player is required');
    }

    // Create Player objects from the provided names.
    const newPlayers: Player[] = playerNames.map((name, index) => ({
      name: name.trim() || `Player ${index + 1}`, // Trim names and use default if empty.
      frames: this.initializeFrames(), // Initialize frames for each player.
      totalScore: 0, // Initialize total score to 0.
    }));

    // Update the game state with the new players and reset game progress.
    this.players.set(newPlayers);
    this.currentPlayerIndex.set(0);
    this.currentFrame.set(1);
  }

  // Initializes an array of Frame objects for a player.
  private initializeFrames(): Frame[] {
    return Array(this.maxFrames)
      .fill(null)
      .map(() => ({
        rolls: [],
        score: 0,
        runningTotal: 0,
        isStrike: false,
        isSpare: false,
        isSplit: false,
        isGutter: false,
      }));
  }

  // Returns the signal containing the array of players.
  getPlayers(): any {
    return this.players;
  }

  // Returns a computed signal for the current player.
  getCurrentPlayer(): any {
    return computed(() => {
      const players = this.players();
      const index = this.currentPlayerIndex();
      return players[index] || { name: '', frames: [], totalScore: 0 };
    });
  }

  // Returns the signal for the current frame number.
  getCurrentFrame(): any {
    return this.currentFrame;
  }

  // Returns the maximum number of frames in a game.
  getMaxFrames(): number {
    return this.maxFrames;
  }

  // Returns the current player's index.
  getCurrentPlayerIndex(): number {
    return this.currentPlayerIndex();
  }

  // Advances the turn to the next player or frame.
  advanceTurn(frameService: FrameService): void {
    const currentPlayer = this.getCurrentPlayer()();
    const currentFrame = currentPlayer.frames[this.currentFrame() - 1];
    console.log('Advancing turn - Current Frame:', this.currentFrame(), 'Rolls:', currentFrame.rolls, 'Is Mark:', frameService.isMark(currentFrame));

    // Determine if the turn should advance based on the current frame and rolls.
    if (this.isLastFrame(this.currentFrame())) {
      this.handleLastFrameTurnAdvance(currentFrame, frameService);
    } else {
      this.handleRegularFrameTurnAdvance(currentFrame, frameService);
    }
  }

  // Handles turn advancement for the last frame.
  private handleLastFrameTurnAdvance(currentFrame: Frame, frameService: FrameService): void {
    if (
      currentFrame.rolls.length === 3 ||
      (currentFrame.rolls.length === 2 && !frameService.isMark(currentFrame))
    ) {
      this.moveToNextPlayer();
    }
  }

  // Handles turn advancement for regular frames.
  private handleRegularFrameTurnAdvance(currentFrame: Frame, frameService: FrameService): void {
    if (frameService.isMark(currentFrame) || currentFrame.rolls.length === 2) {
      this.moveToNextPlayer();
    }
  }

  // Moves to the next player or increments the frame if all players have played.
  private moveToNextPlayer(): void {
    this.currentPlayerIndex.update((index) => (index + 1) % this.players().length);
    if (this.currentPlayerIndex() === 0) {
      this.currentFrame.update((frame) => Math.min(frame + 1, this.maxFrames));
    }
    console.log('Moved to next player/frame - Current Player Index:', this.currentPlayerIndex(), 'Current Frame:', this.currentFrame());
  }

  // Checks if the game is over.
  isGameOver(): boolean {
    return (
      this.isLastFrame(this.currentFrame()) &&
      this.currentPlayerIndex() === 0 &&
      this.players().every((player) => this.isPlayerFinished(player))
    );
  }

  // Checks if a player has finished their last frame.
  private isPlayerFinished(player: Player): boolean {
    const lastFrame = player.frames[this.maxFrames - 1];
    return (
      lastFrame.rolls.length === 3 ||
      (lastFrame.rolls.length === 2 && !this.isMark(lastFrame))
    );
  }

  // Checks if a frame is a mark (strike or spare).
  private isMark(frame: Frame): boolean {
    return frame.isStrike || frame.isSpare;
  }

  // Updates the players signal with the given array of players.
  updatePlayers(updatedPlayers: Player[]): void {
    this.players.set(updatedPlayers);
  }

  //Checks if the current frame is the last frame.
  private isLastFrame(frameNumber:number):boolean{
    return frameNumber === this.maxFrames;
  }
}