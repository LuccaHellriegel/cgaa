# Circle Gladiator Army Arena (CGAA) - Technical Architecture Document

**Version:** 1.0
**Date:** 2025-04-20

## 1. Introduction

This document outlines the technical architecture for Circle Gladiator Army Arena (CGAA). It focuses exclusively on the "how" of implementation, providing guidance on the technical patterns, data structures, and coding standards that will fulfill the product requirements defined in the PRD.

The primary goal of this architecture is to implement a high-performance 2D game using **Data-Oriented Design (DOD)** with **mutable state** within a **Structure of Arrays (SoA)** pattern and **pre-allocated data structures**.

## 2. Architectural Goals and Constraints

### Goals

- **Performance:** Achieve smooth real-time gameplay on the target web platform by minimizing runtime overhead. This is the primary driver for choosing mutable DOD/SoA and pre-allocation. Logic functions must be highly efficient.
- **Maintainability:** Despite the performance focus, maintain reasonable code organization and clarity through separation of concerns (Data vs. Logic vs. Rendering) and clear standards.
- **Correctness:** Ensure game logic accurately reflects the rules defined in the PRD.
- **Testability:** Enable effective unit testing of core logic functions and integration testing of component interactions.
- **Simplicity (MVP):** Focus on delivering the core gameplay loop defined in the PRD without over-engineering for features outside the MVP scope.

### Constraints

- **Technology Stack:** Must use TypeScript, HTML Canvas API directly (no external rendering frameworks like PixiJS or Phaser for MVP), Vite, Vitest, and EasyStar.js as specified.
- **Architecture:** Must implement Data-Oriented Design (DOD) with mutable state modification.
- **Data Structure:** Must use a Structure of Arrays (SoA) pattern for entity data within the main `GameData` object, with arrays pre-allocated to fixed maximum sizes. No runtime object creation for entities during the main game loop.
- **Platform:** Web browsers supporting modern JavaScript and Canvas API.
- **Scope:** Limited to the features defined in the CGAA MVP PRD.
- **Team:** Development will involve junior developers and AI agents, requiring clear, explicit standards and documentation.

## 3. Architectural Representation / Views

### 3.1. High-Level Overview

- **Architectural Style:** Monolithic Frontend Application with Data-Oriented Design (DOD).
  - **Justification:** The application is a single-player, client-side web game with no backend requirements for the MVP. A monolith is the simplest approach. DOD (specifically SoA with mutable state) is chosen explicitly for performance as mandated by the PRD and subsequent clarifications.
- **Diagram (C4 Context Level):**

  ```mermaid
  graph TD
      User[User] -- Interacts via Keyboard/Mouse --> CGAA[Circle Gladiator Army Arena (Web App)]
      CGAA -- Renders to --> Browser[Web Browser (Canvas API)]
      CGAA -- Loads Balance Data from --> Config[JSON Config Files]
  ```

### 3.2. Component View

- **Key Components:**

  1.  **`Game` (game.ts):** Top-level controller. Manages the main game loop (`requestAnimationFrame`), scene switching (initially just `Board`), loading `Balance` data, and initializing/allocating the `GameData` structure.
  2.  **`Balance` (balance.ts):** Holds immutable configuration data (stats, costs, waves, etc.). Loaded once from JSON files at startup. Read-only during gameplay.
  3.  **`GameData` (gamedata.ts):** The single source of truth for **mutable** game state. Implemented using **Structure of Arrays (SoA)** with pre-allocated fixed-size arrays (e.g., `enemy_x: number[]`, `enemy_hp: number[]`). Contains all dynamic game information (player state, entity component arrays, timers, game status, grid). **Directly mutated by `Logic` functions.**
  4.  **`Board` (board.ts):** Manages the main gameplay scene. Collects input into `InputFrame`, calls `Logic.TickAll` (passing mutable `GameData`), orchestrates rendering via `Rendering` functions (reading the mutated `GameData`), and checks `GameData.gameStatus` for scene changes.
  5.  **`Logic` (logic.ts):** A collection of **static functions** responsible for all game rules and state transitions. Takes `Balance`, the **mutable** `GameData` object, `InputFrame`, and `dt` as input. **Directly modifies the properties (arrays) of the passed-in `GameData` object.** Functions typically return `void`. Initially implemented in a single file. Includes sub-logic for player, enemies, towers, combat, camps, diplomacy, pathfinding requests, game flow, etc.
  6.  **`Rendering` (rendering/\*.ts):** Collection of functions responsible for drawing the game state onto the HTML Canvas. Reads data from `GameData`. Does not modify `GameData`. Includes functions for drawing the world, entities (player, enemies, towers, etc.), UI elements, and utilities (health bars).
  7.  **`Core Utils` (core/\*.ts):** Low-level utilities:
      - `input.ts`: Raw input listeners, `InputFrame` definition.
      - `types.ts`: Shared types (Vec2, Entity IDs, Enums).
      - `pathfinding.ts`: Wrapper/integration for the `EasyStar.js` library. Manages path requests and results.
      - `arenaGen.ts`: Implements Cellular Automata generation logic.
  8.  **`Config` (config/\*.json):** Static JSON files defining the `Balance` data.

- **Diagram (C4 Component Level - Simplified):**

  ```mermaid
  graph TD
      subgraph "CGAA Web Application"
          Game -- Manages --> Board
          Game -- Initializes --> GameDataSoA[GameData (SoA)]
          Game -- Loads --> BalanceData[Balance (from JSON)]

          Board -- Collects --> InputUtils[Core/Input]
          Board -- Calls --> LogicTick[Logic.TickAll]
          Board -- Reads --> GameDataSoA
          Board -- Orchestrates --> Rendering

          LogicTick -- Reads --> BalanceData
          LogicTick -- Reads --> InputFrame[InputFrame (from Board)]
          LogicTick -- MUTATES --> GameDataSoA
          LogicTick -- Uses --> PathfindingUtils[Core/Pathfinding (EasyStar.js)]

          Rendering -- Reads --> GameDataSoA
          Rendering -- Draws to --> CanvasAPI[HTML Canvas API]

          InputUtils -- Provides Raw Input --> Board
          PathfindingUtils -- Reads Grid --> GameDataSoA
      end

      User[User] -- Interacts --> InputUtils
      CanvasAPI -- Displays --> User
      BalanceData -- Loaded from --> JSONFiles[Config/*.json]
  ```

### 3.3. Data View

- **Primary Data Structures:**
  - **`Balance`:** Immutable configuration object loaded from JSON. Contains definitions for player stats, enemy types, tower types, wave schedules, camp templates, King stats, etc.
  - **`GameData` (SoA):** The core mutable state object. Contains:
    - Global state: `gameStatus`, `waveTimer`, `currentWaveIndex`, `playerSouls`, `activeEnemyCount`, `activeTowerCount`, etc.
    - Player state: `playerX`, `playerY`, `playerHp`, `playerMode`, `playerAttackCooldown`.
    - Entity Component Arrays (Pre-allocated, Fixed Size, SoA):
      - `enemy_isActive: boolean[]`
      - `enemy_id: number[]`
      - `enemy_type: EnemyType[]`
      - `enemy_x: number[]`
      - `enemy_y: number[]`
      - `enemy_hp: number[]`
      - `enemy_targetId: (number | null)[]`
      - `enemy_pathfindingStatus: ('idle' | 'pending' | 'found' | 'failed')[]`
      - `enemy_currentPathSegmentIndex: number[]`
      - `enemy_pathSegments: Vec2[][]` (or similar structure for paths)
      - _(Similar arrays for `tower_`, `projectile*`, `friend*`, `camp*`, `campBuilding*`)\_
    - `grid: GridData` (`width`, `height`, `walls: boolean[][]`) - Mutated by tower placement/selling, camp destruction.
    - `king: KingState | null` (Contains King's specific state if active, potentially also SoA if complex).
    - Constants defining max sizes (e.g., `MAX_ENEMIES`, `MAX_TOWERS`).
- **Database:** None required for MVP. State is ephemeral and managed entirely client-side in `GameData`.
- **Data Access:** `Logic` functions directly access and mutate the arrays within the `GameData` object passed by reference. `Rendering` functions read from `GameData`. `Balance` data is read-only.

### 3.4. Deployment View

- **Target Environment:** Static Web Host (e.g., Vercel, Netlify, GitHub Pages). The application consists solely of static assets (HTML, CSS, JS) generated by Vite.
- **CI/CD:**
  - Source Control: Git (repository hosted on GitHub, GitLab, etc.).
  - Build: Use Vite (`npm run build`) to produce optimized static assets.
  - Testing: Run unit and integration tests (`npm run test`) via Vitest within the CI pipeline. Enforce code coverage checks.
  - Deployment: Configure the chosen static host provider to automatically deploy the built assets upon pushes/merges to the main branch (e.g., using GitHub Actions or the provider's built-in Git integration).

## 4. Initial Project Setup (Manual Steps)

Story 0 requires the following manual steps by the user (developer):

1.  **Git Repository:** Initialize a Git repository (`git init`) and set up the remote (e.g., on GitHub).
2.  **Project Generation (Vite):** Use the Vite CLI to scaffold the project.
    ```bash
    npm create vite@latest cgaa-game --template vanilla-ts
    cd cgaa-game
    npm install
    ```
    _Justification:_ Vite provides a fast development server and optimized builds for modern web projects using TypeScript, aligning with PRD requirements. The `vanilla-ts` template gives a minimal starting point.
3.  **Install Core Dependencies:**
    ```bash
    npm install -D vitest prettier eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier eslint-plugin-prettier happy-dom # Or jsdom
    npm install easystarjs
    npm install -D @types/easystarjs
    ```
4.  **Configuration Files:**
    - Create/configure `.prettierrc.json` (see Patterns and Standards).
    - Create/configure `.eslintrc.cjs` (see Patterns and Standards).
    - Configure `vite.config.ts` for Vitest integration (test environment setup using `happy-dom` or `jsdom`).
    - Configure `tsconfig.json` as needed (e.g., strict mode enabled, paths).
5.  **Basic HTML:** Ensure `index.html` contains a `<canvas>` element with a unique ID (e.g., `id="game-canvas"`).
6.  **LLM Setup:** (If applicable) Ensure any local LLMs are running or API keys for remote LLMs are configured in the development environment if AI agents will be used for coding assistance.

## 5. Technology Stack (Opinionated & Specific)

| Category            | Technology          | Version        | Notes                                                                                             |
| :------------------ | :------------------ | :------------- | :------------------------------------------------------------------------------------------------ |
| Language            | TypeScript          | `~5.4.x`       | Strong typing, modern JS features. Strict mode enabled.                                           |
| Build Tool          | Vite                | `~5.2.x`       | Fast HMR, optimized builds.                                                                       |
| Rendering           | HTML Canvas API     | Browser Native | Direct 2D rendering.                                                                              |
| Architecture        | Data-Oriented (SoA) | N/A            | Structure of Arrays, Mutable State, Pre-allocation.                                               |
| State Management    | Mutable `GameData`  | N/A            | Single mutable state object passed by reference.                                                  |
| Pathfinding         | EasyStar.js         | `~1.4.x`       | Asynchronous A\* pathfinding library for JS grids. Requires `@types/easystarjs` for TS.           |
| Config Format       | JSON                | N/A            | For `Balance` data.                                                                               |
| Version Control     | Git                 | Latest         | Standard SCM.                                                                                     |
| Code Formatting     | Prettier            | `~3.2.x`       | Enforced via ESLint plugin and pre-commit hooks (recommended).                                    |
| Linting             | ESLint              | `~8.x`         | With `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `eslint-plugin-prettier`.   |
| Unit/Integration    | Vitest              | `~1.5.x`       | Fast test runner, integrates with Vite/TS. Use `happy-dom` or `jsdom` for environment.            |
| E2E Test Framework  | Playwright/Cypress  | `Latest`       | Choose one for browser automation testing (Playwright recommended for robust Canvas interaction). |
| Package Manager     | npm                 | `10.x+`        | Or Yarn / pnpm.                                                                                   |
| Runtime Environment | Node.js             | `20.x LTS`     | For build tools and testing.                                                                      |
| Deployment Env      | Static Web Host     | N/A            | Vercel, Netlify, GitHub Pages, etc.                                                               |

_(Note: Specific minor versions (`.x`) should be updated to the latest stable releases at project start, but major versions should be adhered to.)_

## 6. Patterns and Standards (Opinionated & Specific)

- **Architectural/Design Patterns:**

  - **Data-Oriented Design (DOD):** Core principle. Separation of data (`GameData`) and behavior (`Logic`).
  - **Structure of Arrays (SoA):** Mandatory for entity data within `GameData` for cache efficiency.
  - **Mutable State:** `Logic` functions directly mutate the `GameData` object passed to them.
  - **Pre-allocation:** `GameData` arrays must be allocated with fixed maximum sizes at initialization.
  - **Static Logic Functions:** All game logic resides in static functions within the `Logic` module/namespace. Avoid state within `Logic` itself.
  - **Game Loop:** Standard `requestAnimationFrame` loop managed by `Game`.
  - **Input Polling/Processing:** Collect input state once per frame (`Board`) into `InputFrame`.
  - **Object Pooling (Consideration):** While not mandatory for MVP, consider implementing a simple object pool or free list mechanism to manage active/inactive slots within the pre-allocated SoA arrays if performance profiling indicates significant overhead in finding free slots or managing entity lifecycles. Start with a simple `activeCount` and `isActive` flag approach.
  - **Cellular Automata:** Use for arena generation as specified.
  - **A\* Pathfinding:** Use `EasyStar.js` for pathfinding requests. Manage asynchronous results.

- **API Design Standards:**

  - N/A (No external API).
  - **Internal Function Signatures:** Must be strictly typed using TypeScript. `Logic` functions consistently take `(Balance, GameData, InputFrame, dt)` or a subset if not all are needed. Rendering functions take `(CanvasRenderingContext2D, GameData)` or specific parts of `GameData`.

- **Coding Standards:**

  - **Style Guide:** Airbnb TypeScript Style Guide (via ESLint config: `eslint-config-airbnb-typescript/base` potentially, adapted as needed).
  - **Formatter:** Prettier (mandatory). Configure `.prettierrc.json` (e.g., `printWidth: 80`, `tabWidth: 2`, `semi: true`, `singleQuote: true`, `trailingComma: 'es5'`). Integrate with ESLint (`eslint-plugin-prettier`, `eslint-config-prettier`).
  - **Linter:** ESLint (mandatory). Configure `.eslintrc.cjs` with `@typescript-eslint/parser`, recommended rules (`@typescript-eslint/recommended`), and Prettier integration. Enforce rules like no unused variables, explicit types where needed, etc.
  - **Naming Conventions:**
    - Files: `kebab-case.ts` (e.g., `game-logic.ts`, `draw-entities.ts`). Exception: Main classes like `Game.ts`, `Board.ts`.
    - Classes/Types/Interfaces/Enums: `PascalCase`.
    - Variables/Functions/Methods: `camelCase`.
    - Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_ENEMIES`).
    - Private members (if classes used): Prefix with `_` (convention, not enforced by JS).
  - **Documentation:** TSDoc comments (`/** ... */`) are mandatory for all exported functions, classes, types, and complex internal logic. Explain purpose, parameters, return values, and side effects (mutations).
  - **Modularity:** Keep functions focused on a single responsibility. Use helper functions for complex logic. (Initially in `logic.ts`, refactor later if needed).
  - **Immutability (where applicable):** `Balance` data must remain immutable after loading. Avoid mutating input parameters unless it's the explicit `GameData` object in `Logic` functions.

- **Error Handling Strategy:**
  - **Validation:** Perform checks within `Logic` functions before mutating state (e.g., can the player afford this tower? is the placement valid?).
  - **Logging:** Use `console.error` for unexpected errors during development. Use `console.warn` for recoverable issues or potential problems.
  - **User Feedback:** Provide visual feedback for invalid actions (e.g., cannot build tower here) rather than throwing exceptions that halt the game.
  - **Robustness:** Aim to prevent invalid states rather than relying heavily on exception handling during the core game loop.

## 7. Folder Structure

```

cgaa-game/
├── public/ # Static assets (e.g., favicon)
├── src/
│ ├── main.ts # Entry point, initializes Game
│ ├── game.ts # Game class (loop, scene mgmt, GameData allocation)
│ ├── board.ts # Board class (input, logic call, render orchestration)
│ ├── balance.ts # Balance type definition, loading from JSON
│ ├── gamedata.ts # GameData type definition (SoA structure, constants)
│ ├── logic.ts # ALL Logic functions (TickAll, player, enemy, combat...) - MUTATES GameData
│ ├── rendering/
│ │ ├── index.ts # Main render orchestrator
│ │ ├── drawWorld.ts # Draw arena, grid
│ │ ├── drawEntities.ts # Draw player, enemies, towers, etc.
│ │ ├── drawUI.ts # Draw HUD, menus, indicators
│ │ └── drawUtils.ts # Health bars, shapes, effects
│ ├── core/
│ │ ├── input.ts # Input listeners, InputFrame definition
│ │ ├── types.ts # Shared types (Vec2, Enums, IDs)
│ │ ├── pathfinding.ts# EasyStar.js wrapper/integration
│ │ └── arenaGen.ts # Cellular Automata implementation
│ ├── config/ # Balance data
│ │ ├── player.json
│ │ ├── towers.json
│ │ ├── enemies.json
│ │ ├── waves.json
│ │ ├── camps.json
│ │ └── king.json
│ └── styles/ # Optional CSS
│ └── main.css
├── tests/
│ ├── unit/ # Unit tests (logic.test.ts, utils.test.ts) - Place adjacent to src files
│ └── integration/ # Integration tests (board.test.ts, game.test.ts)
│ └── setup/ # Test setup files (e.g., Vitest config, mocks)
├── index.html # Main HTML file
├── tsconfig.json # TypeScript configuration
├── vite.config.ts # Vite configuration
├── .eslintrc.cjs # ESLint configuration
├── .prettierrc.json # Prettier configuration
├── package.json
└── README.md

```

_(Note 1: `logic.ts` may be split into `src/logic/_.ts` later as per the PRD if complexity warrants it, following the same mutation patterns.)*
*(Note 2: Unit tests (`_.test.ts`) should ideally be placed adjacent to the source files within the `src`directory itself, e.g.,`src/logic.test.ts`. The `/tests/unit` folder might be omitted or used for broader unit test utilities.)_

## 8. Testing Strategy (Opinionated & Specific)

- **Required Test Types:**

  - **Unit Tests:** Primary focus. Test individual `Logic` helper functions and core utilities (`arenaGen`, `pathfinding` wrapper). Crucially, test that `Logic` functions correctly **mutate** a provided sample `GameData` (SoA structure) based on inputs. Test `Balance` loading/parsing.
  - **Integration Tests:** Test the collaboration between components, e.g., `Board` collecting input, calling `Logic.TickAll`, and triggering `Rendering` based on the mutated `GameData`. Test `Game`'s scene management based on `GameData.gameStatus`.
  - **End-to-End (E2E) Tests:** Use Playwright (preferred) or Cypress to simulate user interactions (keyboard/mouse) on the Canvas. Verify high-level gameplay features (movement, building, enemy spawning, win/loss). Assertions may require inspecting `GameData` (potentially exposed via a debug flag/function) or using visual regression testing if feasible.

- **Frameworks/Libraries:**

  - Unit/Integration: **Vitest `~1.5.x`** (with `happy-dom` or `jsdom` environment).
  - E2E: **Playwright `Latest`** (recommended) or Cypress `Latest`.

- **Code Coverage Requirement:** Mandatory **>= 80%** line coverage for unit tests, enforced via Vitest's coverage reporting integrated into the CI pipeline.

- **Testing Standards:**
  - **Structure:** Use Arrange-Act-Assert (AAA) pattern for clarity in unit tests.
  - **Location:** Unit test files (`*.test.ts`) must be located adjacent to the source file they test within the `src` directory (e.g., `src/logic.test.ts` tests `src/logic.ts`). Integration tests can reside in the `tests/integration` directory.
  - **State Management:** Tests for `Logic` functions require careful setup of initial `GameData` (SoA structure). Use helper functions to create representative initial states. Deep copy state if necessary between tests to avoid interference.
  - **Assertions:** Assert specific changes within the mutated `GameData` arrays at expected indices.
  - **Mocking:** Mock external dependencies like `Date.now()` or `requestAnimationFrame` if needed for specific tests (Vitest provides utilities). Mock `EasyStar.js` behavior for pathfinding logic tests.
  - **E2E Selectors:** Rely on stable selectors (e.g., Canvas element ID). Interacting with specific game elements on Canvas might require coordinate-based clicks or potentially adding debug attributes/hooks accessible by the test runner.

## 9. Core AI Agent Rules (for `ai/rules.md`)

1.  **Formatting:** Strictly adhere to the Prettier configuration (`.prettierrc.json`). Format code before committing.
2.  **Linting:** Strictly adhere to the ESLint configuration (`.eslintrc.cjs`). Resolve all linting errors and warnings.
3.  **Naming Conventions:** Follow project naming conventions: `kebab-case.ts` for files, `PascalCase` for types/classes, `camelCase` for functions/variables, `UPPER_SNAKE_CASE` for constants.
4.  **Testing:** Place unit test files (`*.test.ts`) adjacent to the source file in `src/`. Ensure unit tests cover logic branches and achieve >= 80% line coverage. Use AAA pattern.
5.  **Documentation:** Add TSDoc comments (`/** ... */`) to all exported functions, classes, types, and complex logic blocks, explaining purpose, params, returns, and **mutations**.
6.  **Data Access:** Access game state **only** through the `GameData` object. `Logic` functions **must** mutate the passed `GameData` object directly, operating on its SoA arrays. Rendering functions **must only read** from `GameData`.
7.  **Immutability:** Treat the `Balance` object as strictly immutable. Do not modify function parameters unless it is the `GameData` object within a `Logic` function.
8.  **Error Handling:** Use `console.error` or `console.warn` for logging. Avoid throwing exceptions in the main game loop; handle errors gracefully (e.g., invalid input feedback).
9.  **Structure:** Place new logic within the main `logic.ts` file initially. Place rendering functions within the appropriate `src/rendering/` file. Place core utilities in `src/core/`.

## 10. Security Considerations

As a purely client-side application for the MVP with no backend or persistent storage, the security attack surface is minimal. Considerations are primarily focused on client-side integrity:

- **Input Validation:** Sanitize or validate user input where necessary, although the primary risk is self-disruption rather than server compromise. Ensure logic functions validate actions (e.g., build coordinates within bounds, sufficient souls).
- **State Validation:** Logic functions should include sanity checks to prevent entering impossible states (e.g., negative HP, building outside grid).
- **Code Obfuscation (Post-MVP):** If cheating becomes a concern later (e.g., if leaderboards are added), code obfuscation/minification during the build process can make client-side manipulation slightly harder, but not impossible.
- **No Sensitive Data:** The MVP does not handle any sensitive user data.

## 11. Architectural Decisions (ADRs)

1.  **ADR-001: Architecture Style - Mutable DOD with SoA**
    - **Context:** PRD requires high performance for a real-time web game and specifies DOD with mutable state. User clarified preference for SoA.
    - **Decision:** Adopt Data-Oriented Design using a Structure of Arrays (SoA) for entity data within a single, mutable `GameData` object. Logic functions will directly mutate this object. Arrays will be pre-allocated.
    - **Rationale:** Directly addresses performance requirements by minimizing object overhead, improving cache locality, and reducing garbage collection pressure compared to Object-Oriented or immutable approaches. Aligns with PRD mandate and user clarification.
2.  **ADR-002: Pathfinding Library - EasyStar.js**
    - **Context:** Need A\* pathfinding on a grid for enemies. Performance and non-blocking behavior are important.
    - **Decision:** Use the `EasyStar.js` library.
    - **Rationale:** Provides asynchronous pathfinding suitable for real-time games, preventing main thread blocking. Designed for JS grid-based games and supports TypeScript. Simpler API compared to more complex AI frameworks.
3.  **ADR-003: Arena Generation - Cellular Automata**
    - **Context:** Need random 50x50 arena generation with walls, ensuring connectivity.
    - **Decision:** Use Cellular Automata algorithm with a flood-fill post-processing step to ensure connectivity.
    - **Rationale:** Creates natural-looking cave/arena structures suitable for the game type. The connectivity step explicitly addresses the requirement. Offers tunable parameters. Considered a good fit compared to Random Walk or Maze generation.
4.  **ADR-004: Logic Structure - Single File Initial**
    - **Context:** Need to organize game logic functions. PRD suggested multiple files, but initial simplicity is desired.
    - **Decision:** Start with a single `src/logic.ts` file containing `Logic.TickAll` and static helper functions for different game aspects.
    - **Rationale:** Simplifies initial development and reduces file overhead for the MVP. Can be refactored into separate modules (`logic/player.ts`, `logic/enemy.ts`, etc.) later if complexity increases, following the same DOD/mutation patterns.

## 12. Glossary

- **A\*:** A pathfinding algorithm used to find the shortest path between two points on a graph or grid, considering costs.
- **Balance:** The immutable configuration data object containing game design parameters (stats, costs, waves, etc.).
- **Board:** The component managing the main gameplay scene, input handling, logic invocation, and render orchestration.
- **Canvas API:** The standard HTML API for drawing graphics via JavaScript.
- **Cellular Automata (CA):** A computational model used here for generating grid-based maps by applying rules to cells based on their neighbors.
- **Data-Oriented Design (DOD):** An architectural approach emphasizing the separation of data and behavior, often organizing data for efficient processing (e.g., cache locality).
- **EasyStar.js:** A specific JavaScript library chosen for asynchronous A\* pathfinding.
- **Game:** The top-level component managing the game loop, scenes, and initialization.
- **GameData:** The central, mutable object holding the entire dynamic state of the game, structured using SoA.
- **InputFrame:** A structure containing the processed user input state for a single frame (key presses, mouse position, clicks).
- **Logic:** The collection of static functions responsible for implementing game rules and mutating `GameData`.
- **Mutable State:** Game state (`GameData`) that is modified directly (in-place) by logic functions.
- **MVP:** Minimum Viable Product. The smallest version of the product that can be released and provide core value.
- **Pre-allocation:** Allocating memory (e.g., for arrays in `GameData`) upfront with a fixed maximum size to avoid runtime allocation overhead.
- **PRD:** Product Requirements Document.
- **Rendering:** The process of drawing the game state onto the screen (Canvas).
- **SoA (Structure of Arrays):** A data layout pattern where components of objects are stored in parallel arrays (e.g., `position_x[]`, `position_y[]`, `health[]`) instead of an array of objects (`object[{x, y, health}]`).
- **Vite:** A modern frontend build tool used for development and bundling.
- **Vitest:** A test runner framework used for unit and integration testing.
