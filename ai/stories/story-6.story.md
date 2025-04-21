# Story 6: Implement Basic `Logic.TickAll` Structure

## Story

**As a** Game System
**I want** to establish the main `Logic.TickAll` function and integrate it into the `Board`
**so that** there is a central entry point for all game logic processing, even if it does nothing initially.

## Status

Draft

## Context

With the `Game` loop (Story 1), `Board` component (Story 4), and `InputFrame` collection (Story 5) established, we need the central function where all game state modifications will occur. According to the architecture (`ai/architecture.md`), this is the `Logic.TickAll` function. It will receive the mutable `GameData`, the immutable `Balance` data, the current `InputFrame`, and the frame's delta time (`dt`).

This story focuses solely on creating the structure for `Logic.TickAll` and ensuring it's called correctly by the `Board` each frame. The function itself will initially be empty, doing no modifications to `GameData`.

## Estimation

Story Points: 0.25 (Simple setup)

## Acceptance Criteria

1.  - [ ] A `src/logic.ts` file exists (or `src/logic/index.ts` if planning for future modularity, let's stick to `src/logic.ts` for now based on arch doc v1).
2.  - [ ] `src/logic.ts` defines and exports a function `TickAll(balance: Balance, gameData: GameData, input: InputFrame, dt: number): void`.
3.  - [ ] The initial implementation of `TickAll` has an empty body (or just comments).
4.  - [ ] The `Board` class (`src/board.ts`) imports the `TickAll` function from `../logic`.
5.  - [ ] The `Board.tick()` method calls `TickAll(this.balance, this.gameData, inputFrame, dt)` after creating the `inputFrame` and before calling `resetInputFrameState()`.

## Subtasks

1.  - [ ] Create `src/logic.ts`.
2.  - [ ] Define the `TickAll` function signature (`TickAll(balance: Balance, gameData: GameData, input: InputFrame, dt: number): void`) in `src/logic.ts` with an empty body.
3.  - [ ] Import necessary types (`Balance`, `GameData`, `InputFrame`) into `src/logic.ts`.
4.  - [ ] Modify `src/board.ts`:
    1.  - [ ] Import `TickAll` from `../logic`.
    2.  - [ ] Call `TickAll(this.balance, this.gameData, inputFrame, dt)` within the `tick` method at the appropriate point (after input collection, before input reset).

## Testing Requirements:

- No specific unit tests are required for the empty `TickAll` function itself.
- Manual testing: Run the application and ensure no errors occur. Optionally add a `console.log` inside `TickAll` to verify it's being called each frame and remove it afterward.

## Story Wrap Up (To be filled in AFTER execution):

- **Agent Model Used:** `<Agent Model Name/Version>`
- **Agent Credit or Cost:** `<Cost/Credits Consumed>`
- **Date/Time Completed:** `<Timestamp>`
- **Commit Hash:** `<Git Commit Hash of resulting code>`
- **Change Log**
  - ...
