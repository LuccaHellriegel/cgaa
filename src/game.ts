import { Board } from './board';
import { Balance, loadBalanceData } from './balance';

/**
 * Represents the main game controller. Manages the game loop, scene transitions,
 * and global game state initialization.
 */
export class Game {
  private readonly balance: Balance;
  private lastTimestamp: number = 0;
  private animationFrameId: number | null = null;
  // Placeholder for the current scene - will be refined later
  private currentScene: Board | null = null; // Use specific type now

  constructor() {
    console.log('Loading balance data...');
    this.balance = loadBalanceData();
    console.log('Balance data loaded:', this.balance);

    console.log('Game initialized');
    // Initialize the first scene (Board), passing the balance data
    this.switchScene(new Board(this.balance));
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

    // Update the current scene
    if (this.currentScene) {
      this.currentScene.update(dt);
    } else {
      // Log dt if there's no scene (shouldn't happen after constructor)
      console.warn('No current scene to update!');
      console.log(`dt: ${dt.toFixed(4)}s`);
    }

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
    // Type the parameter
    // Add potential teardown for the old scene here later
    if (
      this.currentScene &&
      typeof (this.currentScene as any).destroy === 'function'
    ) {
      (this.currentScene as any).destroy(); // Example teardown call
    }

    this.currentScene = newScene;
    console.log(
      `Switched to scene: ${newScene?.constructor?.name || 'Unknown'}`
    );

    // Add potential initialization for the new scene here later
    if (
      this.currentScene &&
      typeof (this.currentScene as any).init === 'function'
    ) {
      (this.currentScene as any).init(); // Example initialization call
    }
  }
}
