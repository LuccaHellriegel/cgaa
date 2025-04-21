# Story 1: Implement `Game` Component & Loop

## Story

**As a** Game System
**I want** to have a central `Game` component that manages the main loop and scene transitions
**so that** the game can run, update consistently over time, and manage different game states (like switching to the main gameplay board).

## Status

Complete

## Context

Following the initial project setup (Story 0), this story establishes the heart of the application: the `Game` component. This component, as defined in the architecture (`ai/architecture.md`), is responsible for the core `requestAnimationFrame` loop, calculating delta time (`dt`) for consistent updates, and managing the overall application state, including which scene is currently active. Initially, it will only manage transitioning to the `Board` scene. This aligns with the Data-Oriented Design by providing the central orchestration point before specific data structures (`Balance`, `GameData`) or logic are implemented.

## Estimation

Story Points: 1

## Acceptance Criteria

1.  - [x] A `Game` class/module exists in `src/game.ts`.
2.  - [x] The `Game` class implements a main loop using `requestAnimationFrame`.
3.  - [x] The main loop correctly calculates delta time (`dt`) between frames.
4.  - [x] The `Game` class has basic logic to initialize and switch to a placeholder `Board` scene/component (even if the `Board` is just a stub initially).
5.  - [x] The `main.ts` file imports and instantiates the `Game` class, starting the game loop upon page load.
6.  - [ ] The application runs without errors in the browser console, showing the `requestAnimationFrame` loop is active (e.g., via logging `dt`). (Requires manual verification)

## Subtasks

1.  - [x] Create `src/game.ts` file.
2.  - [x] Define the `Game` class structure.
3.  - [x] Implement the `requestAnimationFrame` loop logic within a method (e.g., `run()` or `start()`).
    1.  - [x] Store the timestamp of the previous frame.
    2.  - [x] Calculate `dt` on each frame.
    3.  - [x] Request the next frame recursively.
4.  - [x] Implement basic scene management placeholders.
    1.  - [x] Add a property to track the current scene (e.g., `currentScene`).
    2.  - [x] Create a method to switch scenes (e.g., `switchScene(newScene)`).
    3.  - [x] In the game loop, call an `update(dt)` method on the `currentScene`.
    4.  - [x] Initialize the `currentScene` to a placeholder `Board` instance (requires creating a minimal `src/board.ts` stub if it doesn't exist).
5.  - [x] Update `src/main.ts`.
    1.  - [x] Import the `Game` class.
    2.  - [x] Create an instance of `Game`.
    3.  - [x] Call the method to start the game loop (e.g., `game.run()`).
6.  - [x] Create a minimal `src/board.ts` stub if necessary for scene management testing.
    1.  - [x] Define a `Board` class with an empty `update(dt)` method.

## Testing Requirements:\*\*

- No specific unit tests are required for this story, as it primarily deals with the loop and basic structure. Manual verification by running the application and checking console logs for `dt` output is sufficient. Future stories will require >= 80% unit test coverage (as per `architecture.md`).

## Story Wrap Up (To be filled in AFTER execution):\*\*

- **Agent Model Used:** `<Agent Model Name/Version>`
- **Agent Credit or Cost:** `<Cost/Credits Consumed>`
- **Date/Time Completed:** `<Timestamp>`
- **Commit Hash:** `<Git Commit Hash of resulting code>`
- **Change Log**
  - ...
