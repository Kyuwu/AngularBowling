import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { BowlingGameService } from '../../services/bowling-game.service';
import { BowlingFieldComponent } from '../bowling-field/bowling-field.component';

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
    BowlingFieldComponent,
  ],
  templateUrl: './game-controls.component.html',
  styleUrls: ['./game-controls.component.scss'],
})
export class GameControlsComponent {
  // Private signal to store the number of players. Using a private signal
  // enforces encapsulation, preventing direct external modification.
  private _numPlayers = signal(4);

  // Computed property to generate player names based on the number of players.
  // Computed properties are used for derived data, ensuring that the names
  // are automatically updated when _numPlayers changes.
  playerNames = computed(() =>
    Array.from({ length: this._numPlayers() }, (_, i) => `Player ${i + 1}`)
  );

  // Signals to manage the game state. Signals are used for reactive state management,
  // allowing the component to react to changes in these values.
  gameStarted = signal(false);
  gameOver = signal(false);
  currentPlayer = signal<any>(null); // Using <any> here, consider creating a Player interface.
  currentFrame = signal(1);
  remainingPins = signal(10);

  // Array of possible pin counts for each roll.
  possiblePins: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Inject the BowlingGameService for game logic.
  constructor(private gameService: BowlingGameService) {
    // Initialize the component state by calling updateState.
    this.updateState();
  }

  // Getter for the number of players. Used for two-way data binding.
  get numPlayers(): number {
    return this._numPlayers();
  }

  // Setter for the number of players. Used for two-way data binding.
  set numPlayers(value: number) {
    this._numPlayers.set(value);
  }

  // Check if all player names are filled.
  // Using .every() is a clean and efficient way to check if all elements
  // in an array satisfy a condition.
  allNamesFilled(): boolean {
    return this.playerNames().every((name) => name.trim().length > 0);
  }

  // Start the game by initializing the game service and updating the state.
  startGame(): void {
    this.gameService.startGame(this.playerNames());
    this.gameStarted.set(true);
    this.updateState();
  }

  // Handle a player's roll.
  roll(pins: number): void {
    // Prevent rolling more pins than remaining. Early return to prevent unnecessary logic.
    if (pins > this.remainingPins()) return;

    this.gameService.roll(pins);
    this.updateState();

    // Check if the game is over and update the state accordingly.
    if (this.gameService.isGameOver()) {
      this.gameOver.set(true);
    }
  }

  // Reset the game to its initial state.
  resetGame(): void {
    this.gameStarted.set(false);
    this.gameOver.set(false);
    this._numPlayers.set(4);
    this.currentPlayer.set(null);
    this.currentFrame.set(1);
    this.remainingPins.set(10);
    this.gameService.startGame([]); // Reset the game service state.
  }

  // Check if a roll is disabled based on the remaining pins.
  isRollDisabled(pins: number): boolean {
    return pins > this.remainingPins();
  }

  // Update the component state based on the game service.
  private updateState(): void {
    // Update the current player and frame from the game service.
    this.currentPlayer.set(this.gameService.getCurrentPlayer()());
    this.currentFrame.set(this.gameService.getCurrentFrame()());

    // Update the remaining pins, using the nullish coalescing operator (??)
    // to default to 10 if getRemainingPins returns null or undefined.
    // Ternary operator to set the value only when the game has started.
    this.remainingPins.set(
      this.gameStarted() ? this.gameService.getRemainingPins() ?? 10 : 10
    );

    // Logging the current state for debugging purposes.
    // Consider removing or using a more robust logging mechanism in production.
    console.log('Current Player:', this.currentPlayer());
    console.log('Current Frame:', this.currentFrame());
    console.log('Remaining Pins:', this.remainingPins());
  }
}