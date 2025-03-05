import { Injectable, signal, computed } from '@angular/core';
import { Player, Frame } from '../interfaces/bowling';
import { FrameService } from './frame.service';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private players = signal<Player[]>([]);
  private currentPlayerIndex = signal<number>(0);
  private currentFrame = signal<number>(1);
  private maxFrames = 10;

  constructor() {}

  startGame(playerNames: string[]) {
    if (!playerNames || playerNames.length === 0) {
      throw new Error('At least one player is required');
    }

    const newPlayers: Player[] = playerNames.map((name, index) => ({
      name: name.trim() || `Player ${index + 1}`,
      frames: Array(this.maxFrames)
        .fill(null)
        .map(() => ({
          rolls: [],
          score: 0,
          runningTotal: 0,
          isStrike: false,
          isSpare: false,
          isSplit: false,
          isGutter: false,
        })),
      totalScore: 0,
    }));

    this.players.set(newPlayers);
    this.currentPlayerIndex.set(0);
    this.currentFrame.set(1);
  }

  getPlayers() {
    return this.players;
  }

  getCurrentPlayer() {
    return computed(() => {
      const players = this.players();
      const index = this.currentPlayerIndex();
      return players[index] || { name: '', frames: [], totalScore: 0 };
    });
  }

  getCurrentFrame() {
    return this.currentFrame;
  }

  getMaxFrames(): number {
    return this.maxFrames;
  }

  getCurrentPlayerIndex(): number {
    return this.currentPlayerIndex();
  }

  advanceTurn(frameService: FrameService) {
    const currentPlayer = this.getCurrentPlayer()();
    const currentFrame = currentPlayer.frames[this.currentFrame() - 1];
    console.log('Advancing turn - Current Frame:', this.currentFrame(), 'Rolls:', currentFrame.rolls, 'Is Mark:', frameService.isMark(currentFrame));

    if (this.currentFrame() === this.maxFrames) {
      if (
        currentFrame.rolls.length === 3 || // Three rolls allowed for strike or spare
        (currentFrame.rolls.length === 2 && !frameService.isMark(currentFrame))
      ) {
        this.moveToNextPlayer();
      }
    } else if (frameService.isMark(currentFrame) || currentFrame.rolls.length === 2) {
      this.moveToNextPlayer();
    }
  }

  private moveToNextPlayer() {
    this.currentPlayerIndex.update((index) => (index + 1) % this.players().length);
    if (this.currentPlayerIndex() === 0) {
      this.currentFrame.update((frame) => Math.min(frame + 1, this.maxFrames));
    }
    console.log('Moved to next player/frame - Current Player Index:', this.currentPlayerIndex(), 'Current Frame:', this.currentFrame());
  }

  isGameOver(): boolean {
    return (
      this.currentFrame() === this.maxFrames &&
      this.currentPlayerIndex() === 0 &&
      this.players().every((player) => {
        const lastFrame = player.frames[this.maxFrames - 1];
        return (
          lastFrame.rolls.length === 3 || // Three rolls for strike or spare
          (lastFrame.rolls.length === 2 && !this.isMark(lastFrame))
        );
      })
    );
  }

  private isMark(frame: Frame): boolean {
    return frame.isStrike || frame.isSpare;
  }

  updatePlayers(updatedPlayers: Player[]) {
    this.players.set(updatedPlayers);
  }
}