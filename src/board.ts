import { Balance } from './balance';
import { GameData } from './gamedata';
import {
  InputFrame,
  initInputListeners,
  getCurrentInputFrame,
  resetInputFrameState,
} from './core/input';

/**
 * Placeholder for the main gameplay scene.
 * Will manage the game board, entities, and interactions.
 */
export class Board {
  private balance: Balance;
  private gameData: GameData;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, balance: Balance, gameData: GameData) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D rendering context');
    }
    this.ctx = ctx;
    this.canvas = canvas;
    this.balance = balance;
    this.gameData = gameData;

    console.log('Board initialized');
    // Initialize input listeners
    initInputListeners(canvas);
  }

  /**
   * Main update loop for the board.
   * @param dt Delta time in seconds
   */
  public tick(dt: number): void {
    // 1. Collect Input (Story 5)
    const inputFrame: InputFrame = getCurrentInputFrame();

    // --- DEBUG: Log input frame --- (Remove later)
    if (
      inputFrame.keysDown.size > 0 ||
      inputFrame.leftClick ||
      inputFrame.fKeyToggled ||
      inputFrame.windowResized
    ) {
      console.log('Input:', {
        keys: Array.from(inputFrame.keysDown),
        mouse: inputFrame.mousePos,
        click: inputFrame.leftClick,
        toggle: inputFrame.fKeyToggled,
        resized: inputFrame.windowResized,
      });
    }
    // --- END DEBUG --- //

    // Handle Resize Input
    if (inputFrame.windowResized) {
      this.handleResize();
    }

    // 2. Update Game State (Logic) (Story 6+)
    // Logic.TickAll(this.balance, this.gameData, inputFrame, dt);

    // 3. Render Game State (Story 8+)
    // this.render();

    // 4. Check Game Status (for scene changes)
    // if (this.gameData.gameStatus !== 'playing') {
    //     // Signal game over/win to Game class
    // }

    // Placeholder to prevent unused variable error
    if (dt > 0) {
    }

    // Reset per-frame input state
    resetInputFrameState();
  }

  private handleResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = width;
    this.canvas.height = height;

    this.gameData.canvasWidth = width;
    this.gameData.canvasHeight = height;

    console.log(`Board handled resize to ${width}x${height}`);
    // Future rendering logic will use the updated ctx/gamedata dimensions.
  }

  // private collectInput(): InputFrame {
  //     // Implementation in Story 5
  //     return {};
  // }

  // private render(): void {
  //     // Implementation in Story 8+
  //     // Clear canvas
  //     this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

  //     // drawWorld(...)
  //     // drawEntities(...)
  //     // drawUI(...)
  // }
}
