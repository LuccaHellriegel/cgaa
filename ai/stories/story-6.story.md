# Story 6: Implement Basic `Logic.TickAll` Structure

## Story

**As a** Game System
**I want** to establish the main `Logic.TickAll` function and integrate it into the `Board`
**so that** there is a central entry point for all game logic processing, even if it does nothing initially.

## Status

Complete

## Context

With the `Game` loop (Story 1), `Board` component (Story 4), and `InputFrame` collection (Story 5) established, we need the central function where all game state modifications will occur. According to the architecture (`ai/architecture.md`), this is the `Logic.TickAll` function. It will receive the mutable `GameData`, the immutable `Balance` data, the current `InputFrame`, and the frame's delta time (`dt`).

This story focuses solely on creating the structure for `Logic.TickAll` and ensuring it's called correctly by the `Board` each frame. The function itself will initially be empty, doing no modifications to `GameData`.

## Estimation

Story Points: 0.25 (Simple setup)

## Acceptance Criteria

1.  - [x] A `src/logic.ts` file exists (or `src/logic/index.ts` if planning for future modularity, let's stick to `src/logic.ts` for now based on arch doc v1).
2.  - [x] `src/logic.ts` defines and exports a function `TickAll(balance: Balance, gameData: GameData, input: InputFrame, dt: number): void`.
3.  - [x] The initial implementation of `TickAll` has an empty body (or just comments).
4.  - [x] The `Board` class (`src/board.ts`) imports the `TickAll` function from `../logic`.
5.  - [x] The `Board.tick()` method calls `TickAll(this.balance, this.gameData, inputFrame, dt)` after creating the `inputFrame` and before calling `resetInputFrameState()`.

## Subtasks

1.  - [x] Create `src/logic.ts`.
2.  - [x] Define the `TickAll` function signature (`TickAll(balance: Balance, gameData: GameData, input: InputFrame, dt: number): void`) in `src/logic.ts` with an empty body.
3.  - [x] Import necessary types (`Balance`, `GameData`, `InputFrame`) into `src/logic.ts`.
4.  - [x] Modify `src/board.ts`:
    1.  - [x] Import `TickAll` from `../logic`.
    2.  - [x] Call `TickAll(this.balance, this.gameData, inputFrame, dt)` within the `tick` method at the appropriate point (after input collection, before input reset).

## Testing Requirements:

- No specific unit tests are required for the empty `TickAll` function itself.
- Manual testing: Run the application and ensure no errors occur. Optionally add a `console.log` inside `TickAll` to verify it's being called each frame and remove it afterward.

## Story Wrap Up (To be filled in AFTER execution):

- **Agent Model Used:** Gemini 2.5 Pro
- **Agent Credit or Cost:** N/A
- **Date/Time Completed:** `<Timestamp>`
- **Commit Hash:** `<Git Commit Hash of resulting code>`
- **Change Log**
  - Created `src/logic.ts` with an empty `TickAll` function and required type imports (Balance, GameData, InputFrame).
  - Corrected the import path for `InputFrame` in `src/logic.ts` to `./core/input`.
  - Imported `TickAll` into `src/board.ts`.
  - Uncommented and correctly placed the call to `TickAll` within the `Board.tick` method.
  - Marked all subtasks and AC as complete.
