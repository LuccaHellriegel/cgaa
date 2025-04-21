# Story 4: Implement Basic `Board` Component

## Story

**As a** Game System
**I want** to implement the `Board` component, which manages the main gameplay scene
**so that** it can orchestrate input collection, logic updates, and rendering based on the shared `Balance` and `GameData`.

## Status

Complete

## Context

Following the creation of the main `Game` loop (Story 1), `Balance` data (Story 2), and the `GameData` structure (Story 3), this story introduces the `Board` component. As defined in the architecture (`ai/architecture.md`), the `Board` is responsible for managing the active gameplay state. It receives the immutable `Balance` configuration and the mutable `GameData` state container from the `Game` class. Its primary role within the main loop is to:

1.  Collect user input (handled in Story 5).
2.  Call the core `Logic.TickAll` function, passing `GameData` to be mutated (handled in Story 6+).
3.  Orchestrate rendering of the current `GameData` state (handled in Story 8+).
4.  Check `GameData.gameStatus` to potentially signal scene changes back to `Game`.

This story focuses on creating the `Board` class structure, connecting it to `Game`, and setting up its `tick` method and basic rendering context access.

## Estimation

Story Points: 1

## Acceptance Criteria

1.  - [x] A `src/board.ts` file exists.
2.  - [x] A `Board` class is defined in `src/board.ts`.
3.  - [x] The `Board` class imports `Balance` and `GameData` types.
4.  - [x] The `Board` constructor accepts `Balance` and `GameData` objects as arguments and stores them as private properties.
5.  - [x] The `Board` constructor accepts the HTMLCanvasElement and stores its 2D rendering context (`CanvasRenderingContext2D`) as a private property.
6.  - [x] The `Board` class has a public `tick(dt: number)` method.
7.  - [x] The `Game` class (`src/game.ts`) imports the `Board` class.
8.  - [x] The `Game` class creates an instance of `Board`, passing the `Balance` data, `GameData` instance, and the canvas element during initialization.
9.  - [x] The `Game` class calls the `board.tick(dt)` method within its main loop (`gameLoop`).

## Subtasks

1.  - [x] Create `src/board.ts` file.
2.  - [x] Define the `Board` class in `src/board.ts`.
    1.  - [x] Import `Balance` from `../balance`.
    2.  - [x] Import `GameData` from `../gamedata`.
    3.  - [x] Add private properties for `balance: Balance`, `gameData: GameData`, and `ctx: CanvasRenderingContext2D`.
    4.  - [x] Implement the constructor to accept `HTMLCanvasElement`, `Balance`, and `GameData`, initialize properties, and get the 2D context. Handle potential null context.
    5.  - [x] Implement the public `tick(dt: number)` method (initially empty or with placeholder comments for input, logic, render calls).
3.  - [x] Modify `src/game.ts`:
    1.  - [x] Import `Board` from `./board`.
    2.  - [x] Add a private property `board: Board`.
    3.  - [x] In the `Game` constructor (or an `init` method), after creating `gameData`, instantiate the `Board` using the canvas, `this.balance`, and `this.gameData`. Assign it to `this.board`.
    4.  - [x] In the `gameLoop` method, call `this.board.tick(dt)` after calculating delta time.

## Testing Requirements:\*\*

- No specific unit tests are required for this story. Integration testing will occur as subsequent stories (input, logic, rendering) are added to the `Board.tick` method. Manual verification by running the application and ensuring no errors occur is sufficient.

## Story Wrap Up (To be filled in AFTER execution):\*\*

- **Agent Model Used:** `<Agent Model Name/Version>`
- **Agent Credit or Cost:** `<Cost/Credits Consumed>`
- **Date/Time Completed:** `<Timestamp>`
- **Commit Hash:** `<Git Commit Hash of resulting code>`
- **Change Log**
  - Created `src/board.ts` and defined the `Board` class.
  - Integrated `Board` into `src/game.ts`, passing `Balance`, `GameData`, and the canvas context.
  - Updated `Game.gameLoop` to call `board.tick(dt)`.
  - Removed redundant/incorrect `switchScene` logic from `Game` constructor.
  - Fixed linter error related to incorrect `Board` constructor arguments.
