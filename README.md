# Retro Bowling Game README

## Overview

This is a retro-styled bowling game built with Angular, featuring an old-school, vintage design inspired by classic bowling score sheets and wooden lanes. The game allows multiple players to take turns rolling a ball to knock down pins, tracks scores, and displays a nostalgic scoreboard and bowling field. This README explains the project’s file structure, the purpose of each service, and the functionality of each component.

## Project Structure

The project follows the standard Angular application structure, with components, services, interfaces, and styles organized in a modular way. Below is an overview of the key directories and files:

retro-bowling-game/
├── src/
│   ├── app/
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.component.ts
│   │   ├── app.routes.ts
│   │   ├── app.config.ts
│   │   ├── components/
│   │   │   ├── bowling-field/
│   │   │   │   ├── bowling-field.component.html
│   │   │   │   ├── bowling-field.component.scss
│   │   │   │   └── bowling-field.component.ts
│   │   │   ├── game-controls/
│   │   │   │   ├── game-controls.component.html
│   │   │   │   ├── game-controls.component.scss
│   │   │   │   └── game-controls.component.ts
│   │   │   └── scoreboard/
│   │   │   │   ├── scoreboard.component.html
│   │   │   │   ├── scoreboard.component.scss
│   │   │   │   └── scoreboard.component.ts
│   │   ├── interfaces/
│   │   │   └── bowling.ts
│   │   ├── services/
│   │   │   ├── bowling-game.service.ts
│   │   │   ├── frame.service.ts
│   │   │   ├── game-state.service.ts
│   │   │   └── scoring.service.ts
│   │   ├── assets/
│   │   │   ├── bowling-floor.jpg
│   │   ├── angular-theme.scss
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.scss
│   └── ...
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
├── karma.conf.js
└── README.md

## File Descriptions

### Components

Components handle the UI and user interactions, rendering the game’s interface with a retro, old-school bowling aesthetic.

#### `app.component.ts/html/scss`

* **Location:** `src/app/`
* **Purpose:** Defines the root component and layout, hosting `GameControlsComponent` and `ScoreboardComponent`.
* **Functionality:**
    * Renders the main app container with a retro parchment background, brown borders, and monospace font.
    * Uses Signals or services to manage game-wide state and layout positioning (e.g., scoreboard on left, bowling field on right during gameplay).

#### `bowling-field.component.ts/html/scss`

* **Location:** `src/app/components/bowling-field/`
* **Purpose:** Renders the retro-styled bowling lane, pins, and ball animation, simulating a roll and displaying remaining pins.
* **Functionality:**
    * Displays a wooden lane with a parchment background and white pins in a triangular formation.
    * Animates a bowling ball rolling from left to right, triggering random pin knock-downs.
    * Updates `remainingPins` dynamically based on rolls, using SVG for pins and CSS for animations.
    * Maintains an old-school look with brown borders and monospace fonts.

#### `game-controls.component.ts/html/scss`

* **Location:** `src/app/components/game-controls/`
* **Purpose:** Manages the game controls UI, including player name inputs, the number of players selector, roll buttons, and game state toggles (start, reset). It integrates with the bowling field and game services to handle rolls and game progression.
* **Functionality:**
    * Allows users to select the number of players (1–8) and enter player names.
    * Displays the current player’s turn, frame, and remaining pins.
    * Provides buttons to roll pins (0–10) or reset the game.
    * Uses Signals for reactive state management (e.g., `gameStarted`, `gameOver`, `playerNames`, `remainingPins`).
    * Triggers animations in `BowlingFieldComponent` and updates the game state via `BowlingGameService`.

#### `scoreboard.component.ts/html/scss`

* **Location:** `src/app/components/scoreboard/`
* **Purpose:** Displays the retro scoreboard, showing player names, rolls (strikes, spares, gutters), and running totals in a vintage grid format.
* **Functionality:**
    * Renders a table with player names, frame-by-frame rolls (e.g., “X” for strikes, “/” for spares, “-” for gutters), and scores.
    * Uses Signals to reactively update scores and rolls from `BowlingGameService`.
    * Features an old-school design with parchment background, brown borders, monospace font, and bold text for emphasis, including red splits and gray gutters.

### Services

Services manage the game logic, state, and scoring, providing data and functionality to components.

#### `bowling-game.service.ts`

* **Location:** `src/app/services/bowling-game.service.ts`
* **Purpose:** Orchestrates the overall game logic, coordinating `GameStateService`, `FrameService`, and `ScoringService` to manage player turns, rolls, and game completion.
* **Functionality:**
    * Initializes the game with player names.
    * Handles player rolls, updating frames and advancing turns.
    * Provides methods to check game state (e.g., `isGameOver`, `getRemainingPins`, `getCurrentPlayer`, `getCurrentFrame`).
    * Integrates with other services for frame updates, scoring, and state management.

#### `frame.service.ts`

* **Location:** `src/app/services/frame.service.ts`
* **Purpose:** Manages individual frame logic, including pin calculations, roll tracking, and mark detection (strikes, spares, splits, gutters).
* **Functionality:**
    * Calculates remaining pins for each roll (`getRemainingPins`).
    * Updates frame state with rolls, setting flags for strikes, spares, splits, and gutters (`updateFrame`).
    * Determines if a frame is a mark (strike or spare) for scoring and turn advancement (`isMark`).
    * Supports special rules for the 10th frame (up to three rolls).

#### `game-state.service.ts`

* **Location:** `src/app/services/game-state.service.ts`
* **Purpose:** Manages the game’s state, including players, current player, current frame, and turn advancement.
* **Functionality:**
    * Initializes players and frames with `startGame`.
    * Tracks and advances turns using Signals (`players`, `currentPlayerIndex`, `currentFrame`).
    * Determines if the game is over (`isGameOver`) and handles last-frame logic.
    * Integrates with `FrameService` to check frame marks and manage turn progression.

#### `scoring.service.ts`

* **Location:** `src/app/services/scoring.service.ts`
* **Purpose:** Calculates and updates player scores, including bonuses for strikes and spares.
* **Functionality:**
    * Computes frame scores and running totals (`calculateScores`).
    * Updates player scores reactively via `BowlingGameService` and `GameStateService`.
    * Handles special scoring for the 10th frame, strikes (10 + next two rolls), and spares (10 + next roll).

### Interfaces

#### `bowling.ts`

* **Location:** `src/app/interfaces/bowling.ts`
* **Purpose:** Defines TypeScript interfaces for game entities like `Player` and `Frame`.
* **Functionality:**
    * `Player`: Describes a player with a name, frames array, and total score.
    * `Frame`: Details a frame with rolls, score, running total, and flags (strike, spare, split, gutter) for game logic.

### Global Styles and Assets

#### `angular-theme.scss`

* **Location:** `src/angular-theme.scss`
* **Purpose:** Defines the Angular Material theme for the app, applying an old-school, retro look with parchment-like colors, brown borders, and monospace fonts.
* **Functionality:**
    * Sets primary,