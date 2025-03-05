import { Component, signal, computed, ViewChild } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BowlingGameService } from '../../services/bowling-game.service';
import { BowlingFieldComponent } from '../bowling-field/bowling-field.component';

@Component({
  selector: 'app-game-controls',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    BowlingFieldComponent
],
  templateUrl: './game-controls.component.html',
  styleUrls: ['./game-controls.component.scss'],
})
export class GameControlsComponent {
  // Private signal for the number of players, ensuring encapsulation
  private _numPlayers = signal(4);

  // Direct signal for player names, handling raw input for two-way binding
  playerNames = signal<string[]>(Array.from({ length: 4 }, () => ''));

  // Computed signal for displaying player names with defaults (e.g., "Player 1")
  displayedPlayerNames = computed(() =>
    this.playerNames().map((name, i) => name.trim() || `Player ${i + 1}`)
  );

  // Signals for game state, using boolean and number types for clarity
  gameStarted = signal(false);
  gameOver = signal(false);
  currentPlayer = signal<any>(null); // Consider creating a Player interface for type safety
  currentFrame = signal(1);
  remainingPins = signal(10);

  // Array of possible pin counts for each roll
  possiblePins: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  @ViewChild(BowlingFieldComponent) bowlingField!: BowlingFieldComponent;

  constructor(
    private gameService: BowlingGameService,
    private snackBar: MatSnackBar // Inject MatSnackBar for notifications
  ) {
    this.updateState();
    this.syncPlayerNames(); // Sync player names with numPlayers on initialization
  }

  // Getter for two-way binding with numPlayers
  get numPlayers(): number {
    return this._numPlayers();
  }

  // Setter for two-way binding, updating player names
  set numPlayers(value: number) {
    this._numPlayers.set(value);
    this.syncPlayerNames(); // Update player names when numPlayers changes
  }

  // Sync player names array with the number of players
  private syncPlayerNames(): void {
    const newNames = Array.from({ length: this._numPlayers() }, (_, i) =>
      this.playerNames()[i] || ''
    );
    this.playerNames.set(newNames);
  }

  // Check if all player names are filled (non-empty after trimming)
  allNamesFilled(): boolean {
    return this.playerNames().every((name) => name.trim().length > 0);
  }

  // Start the game with player names
  startGame(): void {
    this.gameService.startGame(this.playerNames());
    this.gameStarted.set(true);
    this.updateState();
  }

  // Handle a player's roll
  roll(pins: number): void {
    if (pins > this.remainingPins()) return;

    this.gameService.roll(pins);
    this.updateState();
    if (this.gameService.isGameOver()) {
      this.gameOver.set(true);
    }
  }

  // Reset the game to its initial state
  resetGame(): void {
    this.gameStarted.set(false);
    this.gameOver.set(false);
    this._numPlayers.set(4);
    this.currentPlayer.set(null);
    this.currentFrame.set(1);
    this.remainingPins.set(10);
    this.playerNames.set([]); // Reset player names
    this.gameService.startGame([]); // Reset the game service state
  }

  // Check if rolling is disabled (game not started, over, or no pins left)
  isRollDisabled(pins: number): boolean {
    return !this.gameStarted() || this.gameOver() || pins > this.remainingPins();
  }

  // Update component state based on game service
  private updateState(): void {
    this.currentPlayer.set(this.gameService.getCurrentPlayer()());
    this.currentFrame.set(this.gameService.getCurrentFrame());
    this.remainingPins.set(this.gameStarted() ? this.gameService.getRemainingPins() ?? 10 : 10);
    console.log('Current Player:', this.currentPlayer());
    console.log('Current Frame:', this.currentFrame());
    console.log('Remaining Pins:', this.remainingPins());
  }
}