# Story 7: Implement Arena Generation & Grid Data

## Story

**As a** Game System
**I want** to define the `GridData` structure within `GameData` and implement logic to generate a random 50x50 arena with walls
**so that** the playable area for the game session is established with defined boundaries and obstacles for movement and placement, ensuring path connectivity.

## Status

Draft

## Context

Following the setup of core data structures and the main logic loop (`TickAll`), this story focuses on creating the physical environment for the game. The PRD specifies a 50x50 grid with randomly generated walls. The architecture document (`ai/architecture.md`) recommends using **Cellular Automata** for the generation process. This generated grid data will be stored within the mutable `GameData` structure. Path connectivity between key areas (e.g., spawn points, friend locations) must be ensured after generation. This grid will be used later for rendering (Story 8) and pathfinding (Story 15).

## Estimation

Story Points: 1 (Cellular Automata implementation and connectivity check can be involved)

## Acceptance Criteria

1.  - [ ] A `GridData` type/interface is defined, likely within `src/gamedata.ts` or `src/core/types.ts`, containing at least `width: number`, `height: number`, and `walls: boolean[][]`.
2.  - [ ] The `GameData` interface (`src/gamedata.ts`) includes a field `grid: GridData`.
3.  - [ ] An arena generation function exists (e.g., `generateArena(width: number, height: number): GridData`), potentially in `src/core/arenaGen.ts` as suggested by the architecture.
4.  - [ ] The generation function implements a Cellular Automata algorithm (or similar) to create wall patterns within the specified dimensions (50x50).
5.  - [ ] The generation function includes logic to ensure basic path connectivity (e.g., ensuring the center is reachable from edges, or running a flood fill).
6.  - [ ] The `Game` class constructor (or an initialization function called by it) calls the `generateArena` function.
7.  - [ ] The resulting `GridData` is stored in the `gameData.grid` property during game initialization.
8.  - [ ] The `MAX_GRID_WIDTH` and `MAX_GRID_HEIGHT` constants (e.g., 50) are defined, likely in `gamedata.ts`.

## Subtasks

1.  - [ ] Define `GridData` interface/type (with `width`, `height`, `walls`) in `src/core/types.ts` (as it's a fundamental geometric type).
2.  - [ ] Add `grid: GridData` field to the `GameData` interface in `src/gamedata.ts`.
3.  - [ ] Define `MAX_GRID_WIDTH` and `MAX_GRID_HEIGHT` constants in `src/gamedata.ts`.
4.  - [ ] Create `src/core/arenaGen.ts`.
5.  - [ ] Implement the Cellular Automata generation logic within `generateArena(width, height)` in `arenaGen.ts`.
    1.  - [ ] Initialize grid randomly (e.g., 45% walls).
    2.  - [ ] Run simulation steps (e.g., 4-5 rule: a wall stays a wall if it has >= 4 wall neighbors, becomes a wall if it has >= 5).
    3.  - [ ] Add borders around the generated area.
6.  - [ ] Implement connectivity check/ensure logic within `generateArena` (e.g., flood fill from center, connect largest areas if needed).
7.  - [ ] Modify `src/game.ts`:
    1.  - [ ] Import `generateArena` and `GridData`.
    2.  - [ ] Call `generateArena(MAX_GRID_WIDTH, MAX_GRID_HEIGHT)` during initialization (e.g., within `createGameData` or in the `Game` constructor after `createGameData`).
    3.  - [ ] Assign the result to `this.gameData.grid`.
8.  - [ ] Modify `src/gamedata.ts` (`createGameData` function): Ensure `grid` is properly initialized, perhaps with a placeholder or the generated data.

## Testing Requirements:\*\*

- Unit tests (`>= 80%` coverage) for the `generateArena` function in `arenaGen.ts`:
  - Test grid dimensions match input.
  - Test basic properties of generated walls (e.g., some walls exist, some floors exist).
  - Test connectivity logic (e.g., a known reachable point is marked reachable by a flood fill).
- Manual verification: Run the game and (if possible via temporary logging or debugging) inspect the `gameData.grid.walls` structure to see if it looks like a reasonable cave/arena layout.

## Story Wrap Up (To be filled in AFTER execution):\*\*

- **Agent Model Used:** `<Agent Model Name/Version>`
- **Agent Credit or Cost:** `<Cost/Credits Consumed>`
- **Date/Time Completed:** `<Timestamp>`
- **Commit Hash:** `<Git Commit Hash of resulting code>`
- **Change Log**
  - ...
