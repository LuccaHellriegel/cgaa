# Story 3: Define & Allocate `GameData` Structure

## Story

**As a** Game System
**I want** to define the core `GameData` structure and allocate memory for it
**so that** the mutable state of the game session can be stored and efficiently accessed/modified by the game logic according to the Data-Oriented Design (DOD) with Structure of Arrays (SoA) pattern.

## Status

In Progress

## Context

Following the definition of immutable `Balance` data (Story 2), this story focuses on defining and initializing the main **mutable** state container, `GameData`. As specified in the architecture (`ai/architecture.md`), `GameData` will hold _all_ dynamic information for a game session (player state, entity states, timers, etc.). Critically, entity data (enemies, towers, projectiles, friends, camps) will be stored using a **Structure of Arrays (SoA)** pattern with **pre-allocated fixed-size arrays** to optimize performance and minimize runtime memory allocation/garbage collection during gameplay. The `Game` class will be responsible for allocating this `GameData` structure upon initialization.

## Estimation

Story Points: 2 (Defining the structure with SoA and pre-allocation is more involved)

## Acceptance Criteria

1.  - [x] A `src/gamedata.ts` file exists.
2.  - [x] A `GameData` type or interface is defined in `src/gamedata.ts`.
3.  - [x] `GameData` includes fields for global state (e.g., `gameStatus: 'playing' | 'won' | 'lost'`, `waveTimer: number`, `currentWaveIndex: number`, `playerSouls: number`, `activeEnemyCount: number`, `activeTowerCount: number`).
4.  - [x] `GameData` includes fields for player state (e.g., `playerX: number`, `playerY: number`, `playerHp: number`, `playerMode: 'attack' | 'interact'`, `playerAttackCooldown: number`).
5.  - [x] `GameData` includes **constants** defining maximum entity counts (e.g., `MAX_ENEMIES`, `MAX_TOWERS`, `MAX_PROJECTILES`, `MAX_FRIENDS`, `MAX_CAMPS`).
6.  - [x] `GameData` includes **pre-allocated, fixed-size arrays** for entity components following the SoA pattern (e.g., `enemy_isActive: boolean[]`, `enemy_x: number[]`, `enemy_hp: number[]`, `tower_isActive: boolean[]`, `tower_x: number[]`, etc., sized according to the constants).
7.  - [x] Helper types/interfaces for entity states (e.g., `EnemyType`, `TowerType`, `Vec2`) are defined, likely within `gamedata.ts` or `core/types.ts`.
8.  - [x] `GameData` includes fields for `grid: GridData` (defined later, placeholder for now) and `king: KingState | null`.
9.  - [x] The `Game` class (`src/game.ts`) imports the `GameData` type.
10. - [x] The `Game` class has a private property to hold the `GameData` instance (e.g., `private gameData: GameData`).
11. - [x] The `Game` class constructor **allocates and initializes** the `GameData` object, including pre-allocating the SoA arrays to their maximum sizes and setting default initial values (e.g., counters to 0, arrays filled with default/inactive states) via `createGameData`.
12. - [x] The initialized `GameData` object is passed to the `Board` constructor (updating the `Board` signature).
13. - [x] The `Board` class (`src/board.ts`) is updated to accept and store the `GameData` reference.

## Subtasks

1.  - [x] Define constants for max entity counts (e.g., `MAX_ENEMIES = 200`, `MAX_TOWERS = 50`, `MAX_PROJECTILES = 300`, `MAX_FRIENDS = 10`, `MAX_CAMPS = 10`) in `src/gamedata.ts`.
2.  - [x] Define basic entity type enums/strings if needed (e.g., `EnemyType`, `TowerType`) in `src/gamedata.ts` or `src/core/types.ts`.
3.  - [x] Define the `GameData` interface/type in `src/gamedata.ts`.
    1.  - [x] Add global state fields (`gameStatus`, timers, counters, souls).
    2.  - [x] Add player state fields (`playerX`, `playerY`, etc.).
    3.  - [x] Add placeholder fields for `grid` and `king`.
    4.  - [x] Define SoA array fields for enemies (`enemy_isActive`, `enemy_id`, `enemy_type`, `enemy_x`, `enemy_y`, `enemy_hp`, `enemy_targetId`, pathfinding fields...).
    5.  - [x] Define SoA array fields for towers (`tower_isActive`, `tower_id`, `tower_type`, `tower_x`, `tower_y`, `tower_hp`, `tower_cooldown`...).
    6.  - [x] Define SoA array fields for projectiles (`projectile_isActive`, `projectile_id`, ...).
    7.  - [x] Define SoA array fields for friends (`friend_isActive`, `friend_id`, ...).
    8.  - [x] Define SoA array fields for camps (`camp_isActive`, `camp_id`, ...).
4.  - [x] Implement an initialization function (e.g., `createGameData(): GameData`) or logic within the `Game` constructor.
    1.  - [x] Allocate the main `GameData` object.
    2.  - [x] Initialize global/player state fields with defaults.
    3.  - [x] Create the SoA arrays using the defined `MAX_` constants (e.g., `enemy_x = new Array(MAX_ENEMIES).fill(0)`). Initialize boolean arrays (`isActive`) to `false`.
5.  - [x] Modify `src/game.ts`:
    1.  - [x] Import `GameData` (and potentially `createGameData` if used).
    2.  - [x] Add `private gameData: GameData` property.
    3.  - [x] Call the initialization logic in the constructor and assign to `this.gameData`.
6.  - [x] Modify `src/board.ts`:
    1.  - [x] Import `GameData`.
    2.  - [x] Add a private `gameData` property of type `GameData`.
    3.  - [x] Update the constructor to accept `GameData` and assign it to `this.gameData`.

## Testing Requirements:\*\*

- No specific unit tests are required for this story, as it primarily involves type definition and initialization logic. Manual verification by running the application and ensuring no errors occur during initialization and that the `GameData` object appears correctly structured (via debugging/logging if necessary) is sufficient. Future stories will require >= 80% unit test coverage for logic functions operating on `GameData`.

## Story Wrap Up (To be filled in AFTER execution):\*\*

- **Agent Model Used:** Gemini 2.5 Pro
- **Agent Credit or Cost:** N/A
- **Date/Time Completed:** `<Timestamp>`
- **Commit Hash:** `<Git Commit Hash of resulting code>`
- **Change Log**
  - Created `src/core/types.ts` with `Vec2` interface.
  - Created `src/gamedata.ts` defining entity constants, types (`EnemyType`, `TowerType`, etc.), and the `GameData` interface using SoA.
  - Implemented `createGameData()` function in `src/gamedata.ts` to allocate and initialize `GameData` with default values and pre-allocated arrays.
  - Updated `src/game.ts` to import `GameData`, `createGameData`, add `gameData` property, initialize it, and pass it to `Board` constructor.
  - Updated `src/board.ts` to import `GameData`, add `gameData` property, and update constructor to accept `GameData`.

## Agent Notes & Chat Log Summary

- Agent completed all subtasks for defining and allocating the `GameData` structure.
- Created `src/gamedata.ts` and helper `src/core/types.ts`.
- Implemented `createGameData` initialization logic.
- Integrated `GameData` into `Game` and `Board` classes.
- Addressed user query regarding placeholder comments, clarifying they relate to future stories.
- Current state: All subtasks complete. Waiting for user review and approval to mark story as Complete.
