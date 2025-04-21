import { Board } from './board';
import { Balance, loadBalanceData } from './balance';
import { GameData, createGameData } from './gamedata';

/**
 * Represents the main game controller. Manages the game loop, scene transitions,
 * and global game state initialization.
 */
export class Game {
  private readonly balance: Balance;
  private readonly gameData: GameData;
  private board: Board;
  private lastTimestamp: number = 0;
  private animationFrameId: number | null = null;
  // Placeholder for the current scene - will be refined later
  private currentScene: Board | null = null; // Use specific type now

  constructor() {
    console.log('Loading balance data...');
    this.balance = loadBalanceData();
    console.log('Balance data loaded.');

    console.log('Allocating GameData...');
    this.gameData = createGameData();
    console.log('GameData allocated.');
    // Potentially log parts of gameData for verification if needed
    // console.log('Initial Player HP:', this.gameData.playerHp);
    // console.log('Max Enemies:', this.gameData.enemy_isActive.length);

    // Get canvas element (ensure it exists)
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    if (!canvas) {
      throw new Error("Canvas element with ID 'game-canvas' not found!");
    }

    console.log('Initializing Board...');
    this.board = new Board(canvas, this.balance, this.gameData);
    console.log('Board initialized.');

    console.log('Game initialized');
  }

  /**
   * Starts the main game loop.
   */
  start(): void {
    if (this.animationFrameId === null) {
      this.lastTimestamp = performance.now();
      console.log('Starting game loop...');
      this.gameLoop(this.lastTimestamp);
    }
  }

  /**
   * Stops the main game loop.
   */
  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
      console.log('Game loop stopped.');
    }
  }

  /**
   * The core game loop, called recursively via requestAnimationFrame.
   * @param timestamp The current timestamp provided by requestAnimationFrame.
   */
  private gameLoop(timestamp: number): void {
    const dt = (timestamp - this.lastTimestamp) / 1000; // Delta time in seconds
    this.lastTimestamp = timestamp;

    // Update the board
    this.board.tick(dt);

    // Scene management logic (if needed) will be handled differently,
    // potentially based on gameData.gameStatus checked within Board or here.
    // The old this.currentScene logic is removed for now.

    // Request the next frame
    this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
  }

  // --- Scene Management (Basic Placeholders) ---

  /**
   * Switches the active scene.
   * @param newScene The scene instance to switch to.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  switchScene(newScene: Board): void {
    // TODO: Refactor scene management if needed. For now, Board is the only 'scene'.
    // This method is likely not needed for the MVP scope as defined
    // unless we introduce menu/gameover screens.
    // console.warn('switchScene called, but likely not needed for current scope.');
    // this.currentScene = newScene; // Removing this as board is handled directly
  }
}
