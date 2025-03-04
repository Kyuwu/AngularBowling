import { Injectable, signal } from '@angular/core';
import Player from '../types/player';

@Injectable({
  providedIn: 'root',
})


export class PlayerService {
  players = signal<Player[]>([]);
  playerIndex = 1;
  playerName = signal<string>(''); // Holds the input field value

  constructor() {}

  setPlayerName(name: string) {
    this.playerName.set(name);
  }

  addPlayer(string: string) {
    const name = this.playerName().trim();
    if (name) {
      this.players.update(players => [...players, { id: this.playerIndex++, name}]);
      this.playerName.set(''); // Clear input after adding
    }
  }

  removePlayer(index: number) {
    this.players.update(players => players.filter((_, i) => i !== index));
  }
}
