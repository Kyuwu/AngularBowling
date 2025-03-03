import { Injectable, Signal, WritableSignal, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GameService {
  // Signal to store the frames of the bowling game
  private frames: WritableSignal<number[][]> = signal([]);
  // Signal to store the total score of the game
  private totalScore: WritableSignal<number> = signal(0);
  // Array to store the rolls of the current frame
  private currentFrame: number[] = [];
  // Index of the current frame
  private frameIndex = 0;
  // Array to store all rolls in the game
  private rolls: number[] = [];
  

  /**
   * Simulates a random roll in the bowling game.
   * Calculates the remaining pins and generates a random number of pins knocked down.
   */
  rollRandom() {
    let remainingPins = 10;
    // If it's the second roll of a non-strike frame, calculate remaining pins
    if (this.currentFrame.length === 1 && this.currentFrame[0] !== 10) {
      remainingPins = 10 - this.currentFrame[0];
    }
    // Generate a random number of pins knocked down
    let pinsKnockedDown = Math.floor(Math.random() * (remainingPins + 1));
    // Simulate the roll
    this.roll(pinsKnockedDown);
  }

  /**
   * Simulates a roll in the bowling game.
   * @param pins The number of pins knocked down in the roll.
   */
  roll(pins: number) {
    console.log(`Rolled: ${pins}`);
    // Add the roll to the rolls array
    this.rolls.push(pins);

    // If the game is over, do nothing
    if (this.frameIndex >= 10) {
      return;
    }

    // Add the roll to the current frame
    this.currentFrame.push(pins);

    // If the frame is complete, update the frames array and move to the next frame
    if (this.isFrameComplete()) {
      this.frames.update((frames) => [...frames, this.currentFrame]);
      this.currentFrame = [];
      this.frameIndex++;
    }

    // Update the total score
    this.updateScore();
  }

  /**
   * Checks if a frame is a strike.
   * @param frame Optional frame to check, if not provided, checks the current frame.
   * @returns True if the frame is a strike, false otherwise.
   */
  isStrike(frame?: number[]): boolean {
    if (frame) {
      return frame[0] === 10;
    }
    return this.currentFrame[0] === 10;
  }

  /**
   * Checks if a frame is a spare.
   * @param frame Optional frame to check, if not provided, checks the current frame.
   * @returns True if the frame is a spare, false otherwise.
   */
  isSpare(frame?: number[]): boolean {
    if (frame) {
      return frame.length === 2 && frame[0] + frame[1] === 10;
    }
    return this.currentFrame.length === 2 && this.currentFrame[0] + this.currentFrame[1] === 10;
  }

  /**
   * Checks if the current frame is complete.
   * @returns True if the frame is complete, false otherwise.
   */
  isFrameComplete(): boolean {
    // Special rules for the 10th frame
    if (this.frameIndex === 9) {
      if (this.currentFrame.length === 3) {
        return true;
      }
      if (this.currentFrame.length === 2) {
        if (this.currentFrame[0] === 10 || this.currentFrame[0] + this.currentFrame[1] === 10) {
          return false;
        } else {
          return true;
        }
      }
      if (this.currentFrame.length === 1 && this.currentFrame[0] !== 10) {
        return false;
      }
      return false;
    }
    // A frame is complete if it's a strike or has two rolls
    return this.isStrike() || this.currentFrame.length === 2;
  }

  /**
   * Updates the total score of the game.
   */
  updateScore() {
    let total = 0;
    const frames = this.frames();

    // Iterate through each frame and calculate the score
    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      let frameScore = frame.reduce((acc, val) => acc + val, 0);

      // Add bonus for strikes
      if (this.isStrike(frame)) {
        if (frames[i + 1]) {
          frameScore += frames[i + 1].reduce((acc, val) => acc + val, 0);
          if (frames[i + 1][0] === 10 && frames[i + 2]) {
            frameScore += frames[i + 2][0] || 0;
          }
        }
      }
      // Add bonus for spares
      else if (this.isSpare(frame)) {
        if (frames[i + 1]) {
          frameScore += frames[i + 1][0] || 0;
        }
      }
      total += frameScore;
    }

    // Update the total score signal
    this.totalScore.set(total);
  }

  /**
   * Gets the frames of the game.
   * @returns Signal containing the frames array.
   */
  getFrames(): Signal<number[][]> {
    return this.frames;
  }

  /**
   * Gets the total score of the game.
   * @returns Signal containing the total score.
   */
  getTotalScore(): Signal<number> {
    return this.totalScore;
  }

  /**
   * Gets all rolls of the game.
   * @returns Array containing all rolls.
   */
  getRolls(): number[] {
    return this.rolls;
  }

  /**
   * Resets the game to its initial state.
   */
  resetGame() {
    this.frames.set([]);
    this.totalScore.set(0);
    this.currentFrame = [];
    this.frameIndex = 0;
    this.rolls = [];
  }
}