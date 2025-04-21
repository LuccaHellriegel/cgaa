# Story 2: Define `Balance` Data Structure & Loading

## Story

**As a** Game System
**I want** to define and load immutable game balance configuration data (`Balance`)
**so that** core game parameters like player stats, tower costs, and limits are centrally managed and easily accessible throughout the application.

## Status

Complete

## Context

Following the implementation of the `Game` loop (Story 1), this story focuses on establishing the `Balance` data structure. This structure, as defined in the architecture (`ai/architecture.md`), holds all the immutable, design-time configuration parameters for the game. These parameters dictate the fundamental rules and stats, such as how much towers cost, the player's starting health, etc. Initially, we will define the structure in TypeScript and load hardcoded values. In later stories, this will be expanded to load from JSON files.

## Estimation

Story Points: 1

## Acceptance Criteria

1.  - [x] A `src/balance.ts` file exists.
2.  - [x] A `Balance` type or interface is defined in `src/balance.ts`.
3.  - [x] The `Balance` type includes initial fields for tower costs/types (at least 'Shooter', 'Healer'), player base stats (e.g., `maxHp`, `speed`), and a global tower limit (`maxTowers`).
4.  - [x] A function exists (e.g., `loadBalanceData`) that returns a `Balance` object populated with hardcoded default values for the defined fields.
5.  - [x] The `Game` class (`src/game.ts`) imports the `Balance` type and the loading function.
6.  - [x] The `Game` class stores the loaded `Balance` data in a private, read-only property.
7.  - [x] The `Game` class calls the loading function during its initialization (constructor).
8.  - [x] The loaded `Balance` data is passed to the `Board` constructor when the `Board` scene is initialized by `Game`.
9.  - [x] The `Board` class (`src/board.ts`) is updated to accept and store the `Balance` data.

## Subtasks

1.  - [x] Create `src/balance.ts` file.
2.  - [x] Define the `Balance` interface/type with initial fields:
    1.  - [x] `player`: { `maxHp`: number, `speed`: number }
    2.  - [x] `towers`: { `types`: { [key: string]: { `cost`: number, /_ other stats later _/ } }, `maxTowers`: number }
3.  - [x] Implement `loadBalanceData(): Balance` function in `src/balance.ts` with hardcoded values.
4.  - [x] Modify `src/game.ts`:
    1.  - [x] Import `Balance` and `loadBalanceData` from `./balance`.
    2.  - [x] Add a private readonly `balance` property of type `Balance`.
    3.  - [x] Call `loadBalanceData` in the constructor and assign the result to `this.balance`.
    4.  - [x] Pass `this.balance` to the `Board` constructor when creating the `Board` scene.
5.  - [x] Modify `src/board.ts`:
    1.  - [x] Import `Balance` from `./balance`.
    2.  - [x] Add a private readonly `balance` property of type `Balance`.
    3.  - [x] Update the constructor to accept a `Balance` object and assign it to `this.balance`.

## Testing Requirements:\*\*

- No specific unit tests are required for this story, as it primarily involves type definition and basic data loading/passing. Manual verification by running the application and ensuring no errors occur during initialization is sufficient. Future stories will require >= 80% unit test coverage (as per `architecture.md`).

## Story Wrap Up (To be filled in AFTER execution):\*\*

- **Agent Model Used:** Gemini 2.5 Pro
- **Agent Credit or Cost:** N/A
- **Date/Time Completed:** `<Timestamp>`
- **Commit Hash:** `<Git Commit Hash of resulting code>`
- **Change Log**
  - Created `src/balance.ts` with `Balance` interface and `loadBalanceData` function.
  - Defined initial player and tower balance parameters (hardcoded).
  - Updated `Game` class to load and store `Balance` data.
  - Updated `Board` class constructor to accept `Balance` data.
  - Passed `Balance` data from `Game` to `Board` upon initialization.
