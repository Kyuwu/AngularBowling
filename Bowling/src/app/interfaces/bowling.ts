export interface Frame {
  rolls: number[]; // Array of pins knocked down per roll (max 3 in 10th frame for bonuses)
  score: number; // Score for this specific frame (before bonuses)
  runningTotal: number; // Running total up to and including this frame
  isStrike: boolean; // True if first roll is 10
  isSpare: boolean; // True if first two rolls sum to 10
  isSplit?: boolean; // Optional: True if rolls create a split (pins apart, hard to spare)
  isGutter?: boolean; // Optional: True if no pins are hit (roll = 0)
}

export interface Player {
  name: string;
  frames: Frame[];
  totalScore: number; // Overall total score (same as the last frame's runningTotal)
}