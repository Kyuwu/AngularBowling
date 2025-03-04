import {
  Injectable,
  Signal,
  WritableSignal,
  signal,
  computed,
  OnDestroy,
} from '@angular/core';

@Injectable() // Removing providedIn: 'root' to make it component-specific
export class GameService implements OnDestroy {
  private frames: WritableSignal<number[][]> = signal([]);
  private totalScore: WritableSignal<number> = signal(0);
  private currentFrame: number[] = [];
  private frameIndex = 0;
  private rolls: number[] = [];

  private computedCumulativeScores = computed(() => {
    let scores: number[] = [];
    let total = 0;

    this.frames().forEach((_, index) => {
      total += this.calculateFrameScore(index);
      scores.push(total);
    });

    return scores;
  });

  rollRandom() {
    let remainingPins = this.getRemainingPins();
    let pinsKnockedDown = Math.floor(Math.random() * (remainingPins + 1));
    this.roll(pinsKnockedDown);
  }

  roll(pins: number) {
    console.log(`Rolled: ${pins}`);
    if (this.frameIndex >= 10) return;

    this.rolls.push(pins);
    this.currentFrame.push(pins);

    if (this.isFrameComplete()) {
      this.frames.update(frames => [...frames, this.currentFrame]);
      this.currentFrame = [];
      this.frameIndex++;
    }

    this.updateTotalScore();
  }

  private getRemainingPins(): number {
    return this.currentFrame.length === 1 && this.currentFrame[0] !== 10
      ? 10 - this.currentFrame[0]
      : 10;
  }

  private isStrike(frame: number[] = this.currentFrame): boolean {
    return frame.length === 1 && frame[0] === 10;
  }

  private isSpare(frame: number[] = this.currentFrame): boolean {
    return frame.length === 2 && frame[0] + frame[1] === 10;
  }

  private isFrameComplete(): boolean {
    return this.frameIndex === 9
      ? this.isTenthFrameComplete()
      : this.isStrike() || this.currentFrame.length === 2;
  }

  private isTenthFrameComplete(): boolean {
    return (
      this.currentFrame.length === 3 ||
      (this.currentFrame.length === 2 && this.currentFrame[0] + this.currentFrame[1] < 10)
    );
  }

  private updateTotalScore() {
    this.totalScore.set(
      this.frames().reduce((total, _, index) => total + this.calculateFrameScore(index), 0)
    );
  }

  private calculateFrameScore(frameIndex: number): number {
    const frames = this.frames();
    if (!frames[frameIndex]) return 0;

    let frame = frames[frameIndex];
    let score = frame.reduce((sum, roll) => sum + roll, 0);

    return frameIndex < 9
      ? score + this.getBonus(frameIndex)
      : score;
  }

  private getBonus(frameIndex: number): number {
    return this.isStrike(this.frames()[frameIndex])
      ? this.getStrikeBonus(frameIndex)
      : this.isSpare(this.frames()[frameIndex])
        ? this.getSpareBonus(frameIndex)
        : 0;
  }

  private getStrikeBonus(frameIndex: number): number {
    const frames = this.frames();
    let nextFrame = frames[frameIndex + 1] || [];
    let bonus = nextFrame[0] || 0;

    return bonus + (nextFrame.length > 1 ? nextFrame[1] || 0 : frames[frameIndex + 2]?.[0] || 0);
  }

  private getSpareBonus(frameIndex: number): number {
    return this.frames()[frameIndex + 1]?.[0] || 0;
  }

  getFrames(): Signal<number[][]> {
    return this.frames.asReadonly();
  }

  getTotalScore(): Signal<number> {
    return this.totalScore.asReadonly();
  }

  getCumulativeScores(): Signal<number[]> {
    return this.computedCumulativeScores;
  }

  getRolls(): number[] {
    return this.rolls;
  }

  resetGame() {
    this.frames.set([]);
    this.totalScore.set(0);
    this.currentFrame = [];
    this.frameIndex = 0;
    this.rolls = [];
  }

  displayRoll(frame: number[], roll: number, rollIndex: number, frameIndex: number): string {
    return roll === 10
      ? 'X'
      : roll === 0
        ? '-'
        : rollIndex === 1 && frame[0] + roll === 10
          ? '/'
          : roll.toString();
  }

  ngOnDestroy() {
    // Perform any cleanup here if needed.
    console.log('GameService destroyed.');
  }
}