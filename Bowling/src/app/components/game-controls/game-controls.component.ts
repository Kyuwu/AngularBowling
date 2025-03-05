import { Component, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { BowlingGameService } from '../../services/bowling-game.service';

@Component({
  selector: 'app-game-controls',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './game-controls.component.html',
  styleUrls: ['./game-controls.component.scss'],
})
export class GameControlsComponent {
  private _numPlayers = signal<number>(4); // Private Signal for numPlayers
  playerNames = computed(() => 
    Array.from({ length: this._numPlayers() }, (_, i) => `Player ${i + 1}`)
  );
  gameStarted = signal<boolean>(false);
  gameOver = signal<boolean>(false);
  currentPlayer = signal<any>(null);
  currentFrame = signal<number>(1);
  remainingPins = signal<number>(10); // Track remaining pins for the current roll
  possiblePins: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(private gameService: BowlingGameService, private cdr: ChangeDetectorRef) {
    this.updateState();
  }

  // Getter for two-way binding
  get numPlayers(): number {
    return this._numPlayers();
  }

  // Setter for two-way binding
  set numPlayers(value: number) {
    this._numPlayers.set(value);
    // Optionally trigger change detection if needed, but computed signal should handle it
    // this.cdr.detectChanges();
  }

  allNamesFilled(): boolean {
    return this.playerNames().every((name) => name.trim().length > 0);
  }

  startGame() {
    this.gameService.startGame(this.playerNames());
    this.gameStarted.set(true);
    this.updateState();
  }

  roll(pins: number) {
    if (pins > this.remainingPins()) return;

    this.gameService.roll(pins);
    this.updateState();
    console.log('Rolled in 10th frame, rolls:', this.gameService.getCurrentPlayer()().frames[9]?.rolls);
    if (this.gameService.isGameOver()) {
      this.gameOver.set(true);
    }
  }

  resetGame() {
    this.gameStarted.set(false);
    this.gameOver.set(false);
    this._numPlayers.set(4); // Reset to default using the private Signal
    this.currentPlayer.set(null);
    this.currentFrame.set(1);
    this.remainingPins.set(10);
    this.gameService.startGame([]); // Reset the game state
  }

  private updateState() {
    this.currentPlayer.set(this.gameService.getCurrentPlayer()());
    this.currentFrame.set(this.gameService.getCurrentFrame()());
    
    // Safely get remaining pins only if the game has started
    if (this.gameStarted()) {
      const pins = this.gameService.getRemainingPins();
      this.remainingPins.set(pins || 10); // Default to 10 if getRemainingPins returns undefined
    } else {
      this.remainingPins.set(10); // Default to 10 before the game starts
    }

    console.log('Current Player:', this.currentPlayer());
    console.log('Current Frame:', this.currentFrame());
    console.log('Remaining Pins:', this.remainingPins());
  }

  isRollDisabled(pins: number): boolean {
    return pins > this.remainingPins();
  }
}