import { Injectable } from '@angular/core';
import { Frame } from '../interfaces/bowling';

@Injectable({
  providedIn: 'root',
})
export class FrameService {
  // Calculates the number of remaining pins for a given frame and roll.
  getRemainingPins(frame: Frame, isTenthFrame: boolean, currentRoll: number): number {
    // If no frame is provided, assume all 10 pins are standing.
    if (!frame) return 10;

    // Handle remaining pins differently for the 10th frame.
    if (isTenthFrame) {
      return this.calculateTenthFrameRemainingPins(frame, currentRoll);
    }

    // Handle remaining pins for frames 1-9.
    return this.calculateRegularFrameRemainingPins(frame, currentRoll);
  }

  // Calculates remaining pins for the 10th frame.
  private calculateTenthFrameRemainingPins(frame: Frame, currentRoll: number): number {
    if (currentRoll === 0) return 10; // First roll: 10 pins.
    if (currentRoll === 1) {
      return frame.isStrike ? 10 : 10 - frame.rolls[0]; // 10 if strike, else remaining pins.
    }
    if (currentRoll === 2) {
      return frame.isStrike || frame.isSpare ? 10 : 0; // 10 if strike/spare, else 0.
    }
    return 0; // No more rolls after the third roll.
  }

  // Calculates remaining pins for frames 1-9.
  private calculateRegularFrameRemainingPins(frame: Frame, currentRoll: number): number {
    if (currentRoll === 0) return 10; // First roll: 10 pins.
    if (currentRoll === 1) {
      return frame.isStrike ? 0 : 10 - frame.rolls[0]; // 0 if strike, else remaining pins.
    }
    return 0; // No more rolls allowed in this frame.
  }

  // Updates a frame with the given number of pins knocked down.
  updateFrame(frame: Frame, pins: number): Frame {
    // Create a new frame object to avoid mutating the original.
    const newFrame = { ...frame, rolls: [...frame.rolls, pins] };
    console.log('Updating frame - Rolls:', newFrame.rolls, 'Pins:', pins);

    // Reset frame flags before updating.
    this.resetFrameFlags(newFrame);

    // Update frame flags based on the number of pins knocked down.
    this.updateFrameFlags(newFrame, pins);

    return newFrame;
  }

  // Resets frame flags to their default values.
  private resetFrameFlags(frame: Frame): void {
    frame.isStrike = false;
    frame.isSpare = false;
    frame.isSplit = false;
    frame.isGutter = false;
  }

  // Updates frame flags based on the number of pins knocked down.
  private updateFrameFlags(frame: Frame, pins: number): void {
    if (pins === 0) {
      frame.isGutter = true;
      console.log('Marked as gutter (-)');
    } else if (frame.rolls.length <= 3 && pins === 10) { // Allow up to 3 strikes in 10th frame
      frame.isStrike = true;
      console.log('Marked as strike (X)');
    } else if (frame.rolls.length === 2 && frame.rolls[0] + frame.rolls[1] === 10) {
      frame.isSpare = true;
      console.log('Marked as spare (/)');
      this.detectSplit(frame); // Check for a split.
    }
  }

  // Detects if a spare is a split.
  private detectSplit(frame: Frame): void {
    const roll1 = frame.rolls[0];
    const roll2 = frame.rolls[1];
    if (
      (roll1 === 1 && roll2 === 9) ||
      (roll1 === 2 && roll2 === 8) ||
      (roll1 === 3 && roll2 === 7) ||
      (roll1 === 4 && roll2 === 6)
    ) {
      frame.isSplit = true;
      console.log('Marked as split');
    }
  }

  // Checks if a frame is a mark (strike or spare).
  isMark(frame: Frame): boolean {
    return frame.isStrike || frame.isSpare;
  }
}