# Retro Bowling Game README

## Overview

This is a retro-styled bowling game built with Angular, featuring a vintage design inspired by classic bowling. The game allows multiple players to take turns rolling a ball, tracks scores, and displays a nostalgic scoreboard and bowling field.

## Components

* **App Component:** Root component managing layout and hosting other components.
* **Bowling Field Component:** Renders the bowling lane, pins, and ball animation.
* **Game Controls Component:** Manages player inputs and game controls.
* **Scoreboard Component:** Displays player scores and frame details.

## Services

* **Bowling Game Service:** Orchestrates overall game logic.
* **Frame Service:** Manages individual frame logic and pin calculations.
* **Game State Service:** Manages the game's state, including players and turns.
* **Scoring Service:** Calculates and updates player scores.

## Interfaces

* **Bowling Interface:** Defines 2 TypeScript interfaces for game entities, Player and Frame.

## Global Styles and Assets

* **Angular Theme SCSS:** Defines the Angular Material theme for a retro look.
* **Global Styles SCSS:** Sets global styles for the app.
* **Assets:** Includes images like the bowling lane texture.

## Getting Started

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Run the app: `ng serve`

Open your browser to `http://localhost:4200`.