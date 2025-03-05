import { Injectable } from '@angular/core';
import { Frame } from '../interfaces/bowling';

@Injectable({
  providedIn: 'root',
})
export class FrameService {
  getRemainingPins(frame: Frame, isTenthFrame: boolean, currentRoll: number): number {
    if (!frame) return 10;

    if (isTenthFrame) {
      if (currentRoll === 0) return 10; // First roll: 10 pins
      if (currentRoll === 1) {
        if (frame.isStrike) return 10; // Strike on first roll: 10 pins for second roll
        return 10 - frame.rolls[0]; // Remaining pins for second roll
      }
      if (currentRoll === 2) {
        if (frame.isStrike) return 10; // Strike: 10 pins for third roll
        if (frame.isSpare) return 10; // Spare: 10 pins for third roll
        return 0; // No more rolls allowed
      }
      if (currentRoll === 3) return 0; // No more rolls after third roll
      return 0; // Default: no more rolls
    }

    // For frames 1-9
    if (currentRoll === 0) return 10; // First roll: 10 pins
    if (currentRoll === 1) {
      if (frame.isStrike) return 0; // Strike: no more rolls in this frame
      return 10 - frame.rolls[0]; // Remaining pins
    }
    return 0; // No more rolls allowed in this frame
  }

  updateFrame(frame: Frame, pins: number): Frame {
    const newFrame = { ...frame, rolls: [...frame.rolls, pins] };
    console.log('Updating frame - Rolls:', newFrame.rolls, 'Pins:', pins);

    // Reset flags before updating
    newFrame.isStrike = false;
    newFrame.isSpare = false;
    newFrame.isSplit = false;
    newFrame.isGutter = false;

    if (pins === 0) {
      newFrame.isGutter = true;
      console.log('Marked as gutter (-)');
    } else if (newFrame.rolls.length <= 3 && pins === 10) { // Allow up to 3 strikes in 10th frame
      newFrame.isStrike = true;
      console.log('Marked as strike (X)');
    } else if (newFrame.rolls.length === 2) {
      const totalPins = newFrame.rolls[0] + newFrame.rolls[1];
      if (totalPins === 10) {
        newFrame.isSpare = true;
        console.log('Marked as spare (/)');
        // Simple split detection: if pins are spread (e.g., 1-9, 2-8, etc.), mark as split
        if (
          (newFrame.rolls[0] === 1 && newFrame.rolls[1] === 9) ||
          (newFrame.rolls[0] === 2 && newFrame.rolls[1] === 8) ||
          (newFrame.rolls[0] === 3 && newFrame.rolls[1] === 7) ||
          (newFrame.rolls[0] === 4 && newFrame.rolls[1] === 6)
        ) {
          newFrame.isSplit = true;
          console.log('Marked as split');
        }
      }
    }

    return newFrame;
  }

  isMark(frame: Frame): boolean {
    return frame.isStrike || frame.isSpare;
  }
}