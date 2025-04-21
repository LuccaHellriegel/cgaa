import { Vec2 } from './types';

/**
 * Represents the state of user input for a single frame.
 */
export interface InputFrame {
  /** Set of keys currently held down (lowercase). */
  keysDown: Set<string>;
  /** Mouse position relative to the canvas. */
  mousePos: Vec2;
  /** Was the left mouse button clicked this frame? */
  leftClick: boolean;
  /** Was the 'f' key toggle pressed this frame? */
  fKeyToggled: boolean;
  /** Did the window resize this frame? */
  windowResized: boolean;
}

// Internal state for the input manager
const _keysDown = new Set<string>();
const _mousePos: Vec2 = { x: 0, y: 0 };
let _leftClickThisFrame = false;
let _fKeyToggledThisFrame = false;
let _windowResizedThisFrame = false;
let _isInitialized = false;

/**
 * Initializes the input event listeners.
 * Should only be called once.
 * @param canvas The HTML canvas element to attach mouse listeners to.
 */
export function initInputListeners(canvas: HTMLCanvasElement): void {
  if (_isInitialized) {
    console.warn('Input listeners already initialized.');
    return;
  }

  console.log('Initializing input listeners...');

  // Keyboard Listeners (attached to window for global capture)
  window.addEventListener('keydown', (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (!_keysDown.has(key)) {
      // Prevent continuous firing for held keys for toggle
      if (key === 'f') {
        _fKeyToggledThisFrame = true;
      }
    }
    _keysDown.add(key);
  });

  window.addEventListener('keyup', (event: KeyboardEvent) => {
    _keysDown.delete(event.key.toLowerCase());
  });

  // Mouse Listeners (attached to the canvas)
  canvas.addEventListener('mousemove', (event: MouseEvent) => {
    console.log('Mouse moved:', event.offsetX, event.offsetY);
    _mousePos.x = event.offsetX;
    _mousePos.y = event.offsetY;
  });

  canvas.addEventListener('mousedown', (event: MouseEvent) => {
    if (event.button === 0) {
      // 0 = Left mouse button
      _leftClickThisFrame = true;
    }
    // Prevent default browser actions like text selection on rapid clicks
    event.preventDefault();
  });

  // We don't strictly need mouseup for leftClickThisFrame,
  // as it resets each frame anyway.
  // canvas.addEventListener('mouseup', (event: MouseEvent) => {
  //     if (event.button === 0) {
  //         // console.log('Left mouse up');
  //     }
  // });

  // Window Resize Listener
  window.addEventListener('resize', () => {
    _windowResizedThisFrame = true;
    // Note: We don't update dimensions here, the Board will do that
    // when it processes the InputFrame.
  });

  _isInitialized = true;
  console.log('Input listeners initialized.');
}

/**
 * Returns the current input state for this frame.
 * Creates a copy of the state to prevent direct modification.
 */
export function getCurrentInputFrame(): InputFrame {
  // Return a copy of the keysDown set to prevent external modification
  return {
    keysDown: new Set(_keysDown),
    mousePos: { ..._mousePos }, // Return a copy
    leftClick: _leftClickThisFrame,
    fKeyToggled: _fKeyToggledThisFrame,
    windowResized: _windowResizedThisFrame,
  };
}

/**
 * Resets the per-frame input state (clicks, toggles).
 * Should be called at the end of each game tick.
 */
export function resetInputFrameState(): void {
  _leftClickThisFrame = false;
  _fKeyToggledThisFrame = false;
  _windowResizedThisFrame = false;
}
