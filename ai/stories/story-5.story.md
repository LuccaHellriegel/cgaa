# Story 5: Implement Fullscreen Canvas, `InputFrame`, and Basic Input Collection

## Story

**As a** Game System
**I want** to make the game canvas fill the entire browser window, define an `InputFrame` structure, implement listeners for keyboard/mouse input, and handle window resizing
**so that** the game utilizes the full screen space, input coordinates are accurate, and the layout adapts to window size changes.

## Status

Complete

## Context

With the `Game` loop (Story 1) and the `Board` component (Story 4) in place, we now need a way to capture user interactions **and ensure the game uses the full available screen space**. The architecture (`ai/architecture.md`) specifies collecting raw input once per frame into an `InputFrame` object. This object will encapsulate the state of relevant keys (WASD, F, potentially others later), mouse position, and mouse clicks. **Crucially, the canvas must fill the window, and mouse coordinates must be relative to the canvas.** The game also needs to adapt if the window is resized.

This story focuses on:

1.  Making the canvas element fill the browser window via CSS.
2.  Adding logic to handle window resize events, updating the canvas dimensions and storing them (e.g., in `GameData`).
3.  Defining the `InputFrame` type and setting up the necessary browser event listeners in a dedicated `input.ts` module.
4.  Integrating input collection and resize handling into the `Game` and `Board` components.

## Estimation

Story Points: 1.5 (Resize handling adds complexity)

## Acceptance Criteria

1.  - [x] A `src/core/input.ts` file exists.
2.  - [x] An `InputFrame` interface or type is defined in `src/core/input.ts` (or `src/core/types.ts` if preferred) including fields for `keysDown: Set<string>`, `mousePos: { x: number, y: number }`, `leftClick: boolean`, and `fKeyToggled: boolean` (as per PRD).
3.  - [x] `src/core/input.ts` implements functions to initialize input listeners (e.g., `initInputListeners(canvas: HTMLCanvasElement)`).
4.  - [x] Event listeners for `keydown` and `keyup` are added (e.g., to `window` or `document`) to track currently pressed keys in an internal state (e.g., a `Set`).
5.  - [x] An event listener for `mousemove` is added to the `canvas` element to track the current mouse position relative to the canvas.
6.  - [x] Event listeners for `mousedown` and `mouseup` are added (e.g., to `canvas`) to track if the left mouse button was clicked within the frame.
7.  - [x] An event listener for `keydown` tracks if the 'f' key was pressed _this frame_ to toggle modes (requires careful state management to only trigger once per press).
8.  - [x] `src/core/input.ts` exposes a function (e.g., `getCurrentInputFrame(): InputFrame`) that returns the current input state.
9.  - [x] `src/core/input.ts` exposes a function (e.g., `resetInputFrameState()`) to reset per-frame state (like `leftClick` and `fKeyToggled`) at the end of a frame.
10. - [x] The `Board` class (`src/board.ts`) imports the necessary functions/types from `input.ts`.
11. - [x] The `Board` constructor calls the input initialization function (e.g., `initInputListeners(canvas)`).
12. - [x] The `Board.tick()` method calls `getCurrentInputFrame()` at the beginning and `resetInputFrameState()` at the end.
13. - [x] CSS rules are applied (e.g., in `src/style.css` imported by `main.ts`) to make the `canvas` element fill the entire browser window.
14. - [x] `GameData` interface (`src/gamedata.ts`) includes fields for `canvasWidth: number` and `canvasHeight: number`.
15. - [x] `createGameData` function initializes `canvasWidth` and `canvasHeight` (e.g., to initial small values or based on window size).
16. - [x] The `Game` class (`src/game.ts`) stores a reference to the `canvas` element.
17. - [x] The `Game` class adds a `resize` event listener to the `window`.
18. - [x] The `resize` event handler updates the `canvas.width` and `canvas.height` attributes to match `window.innerWidth` and `window.innerHeight`.
19. - [x] The `resize` event handler updates `gameData.canvasWidth` and `gameData.canvasHeight`.
20. - [x] The initial canvas size is set correctly when the `Game` is constructed.
21. - [x] `createGameData` function initializes `canvasWidth` and `canvasHeight` (e.g., to 0, as `Board` will set the actual size).
22. - [x] `InputFrame` interface (`src/core/input.ts`) includes a boolean flag `windowResized`.
23. - [x] `src/core/input.ts` adds a `resize` event listener to `window` that sets an internal flag.
24. - [x] `getCurrentInputFrame` returns the `windowResized` flag state.
25. - [x] `resetInputFrameState` resets the internal `windowResized` flag.
26. - [x] The `Board` class stores a reference to the `canvas` element.
27. - [x] The `Board.tick()` method checks `inputFrame.windowResized`.
28. - [x] If `windowResized` is true, `Board` updates the `canvas.width`, `canvas.height`, `gameData.canvasWidth`, and `gameData.canvasHeight` based on `window.innerWidth/Height`.

## Subtasks

1.  - [x] Create `src/core/input.ts`.
2.  - [x] Define the `InputFrame` interface in `src/core/input.ts` (or move `Vec2` from `types.ts` here if needed, or import `Vec2`). Include `keysDown: Set<string>`, `mousePos: Vec2`, `leftClick: boolean`, `fKeyToggled: boolean`.
3.  - [x] Implement `InputManager` (or equivalent structure/functions) in `src/core/input.ts`:
    1.  - [x] Define internal state variables (e.g., `_keysDown = new Set<string>()`, `_mousePos = { x: 0, y: 0 }`, `_leftClickThisFrame = false`, `_fKeyToggledThisFrame = false`).
    2.  - [x] Create `initInputListeners(canvas: HTMLCanvasElement)` function.
    3.  - [x] Add `keydown` listener to `window`: adds `event.key.toLowerCase()` to `_keysDown`; sets `_fKeyToggledThisFrame = true` if `event.key.toLowerCase() === 'f'`.
    4.  - [x] Add `keyup` listener to `window`: removes `event.key.toLowerCase()` from `_keysDown`.
    5.  - [x] Add `mousemove` listener to `canvas`: updates `_mousePos` based on `event.offsetX` and `event.offsetY`.
    6.  - [x] Add `mousedown` listener to `canvas`: sets `_leftClickThisFrame = true` if `event.button === 0` (left button).
    7.  - [x] Add `mouseup` listener (optional, could just rely on the down state for the frame).
    8.  - [x] Create `getCurrentInputFrame(): InputFrame` function: returns a _copy_ of the current state (new object `{...}`).
    9.  - [x] Create `resetInputFrameState()`: sets `_leftClickThisFrame = false` and `_fKeyToggledThisFrame = false`.
4.  - [x] Modify `src/board.ts`:
    1.  - [x] Import `InputFrame`, `initInputListeners`, `getCurrentInputFrame`, `resetInputFrameState` from `../core/input`.
    2.  - [x] Call `initInputListeners(canvas)` in the constructor.
    3.  - [x] In `tick(dt: number)`:
        - [x] Call `const inputFrame = getCurrentInputFrame();` at the beginning.
        - [x] (Placeholder) Use `inputFrame` in the call to `Logic.TickAll` (when implemented).
        - [x] Call `resetInputFrameState();` at the end of the method.
5.  - [x] Create/Modify CSS (`src/style.css` or similar):
    1.  - [x] Add rules for `html, body` to remove margin/padding and hide overflow.
    2.  - [x] Add rules for the `canvas` element (`#game-canvas`) for `display: block; width: 100%; height: 100%;`.
    3.  - [x] Ensure CSS is imported in `src/main.ts`.
6.  - [x] Modify `src/gamedata.ts`:
    1.  - [x] Add `canvasWidth: number;` and `canvasHeight: number;` to `GameData` interface.
    2.  - [x] Initialize `canvasWidth` and `canvasHeight` in `createGameData()` (e.g., to 0).
7.  - [x] Modify `src/core/input.ts` (Refactoring Resize):
    1.  - [x] Add `windowResized: boolean` to `InputFrame` interface.
    2.  - [x] Add internal state `_windowResizedThisFrame`.
    3.  - [x] Add `window.addEventListener('resize', ...)` in `initInputListeners` to set `_windowResizedThisFrame`.
    4.  - [x] Update `getCurrentInputFrame` to include `windowResized`.
    5.  - [x] Update `resetInputFrameState` to reset `_windowResizedThisFrame`.
8.  - [x] Modify `src/board.ts` (Refactoring Resize):
    1.  - [x] Store `canvas` reference in constructor.
    2.  - [x] Add `handleResize()` method to update `canvas.width/height` and `gameData.canvasWidth/Height`.
    3.  - [x] Check `inputFrame.windowResized` in `tick()` and call `this.handleResize()` if true.

## Testing Requirements:\*\*

- Unit tests for `input.ts` are recommended to verify listener logic and state management (e.g., simulating events and checking `getCurrentInputFrame` output), aiming for >= 70% coverage for this module.
- Manual testing by running the application and logging the `inputFrame` in `Board.tick` to verify key presses, mouse movement, and clicks are registered correctly.

## Story Wrap Up (To be filled in AFTER execution):\*\*

- **Agent Model Used:** `<Agent Model Name/Version>`
- **Agent Credit or Cost:** `<Cost/Credits Consumed>`
- **Date/Time Completed:** `<Timestamp>`
- **Commit Hash:** `<Git Commit Hash of resulting code>`
- **Change Log**
  - Created `src/core/input.ts` with `InputFrame` interface and input handling logic.
  - Implemented listeners for keydown, keyup, mousemove, mousedown.
  - Added functions `initInputListeners`, `getCurrentInputFrame`, `resetInputFrameState`.
  - Integrated input handling into `Board.ts` constructor and `tick` method.
  - Added CSS (`src/style.css`) and import in `main.ts` to make canvas fullscreen.
  - Added `canvasWidth`/`Height` to `GameData`.
  - Added resize handling logic (`handleResize`, listener) to `Game.ts` initially.
  - **Refactored resize handling:**
    - Removed direct resize handling from `Game.ts`.
    - Added `windowResized` flag to `InputFrame` managed by `input.ts`.
    - Made `Board.ts` check the flag in `tick()` and call its own `handleResize()` method.
    - Updated story ACs and subtasks to reflect the input-driven approach.
  - Removed the `contextmenu` event listener from `input.ts` per user request.
