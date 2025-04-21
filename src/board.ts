import { Balance } from './balance';

/**
 * Placeholder for the main gameplay scene.
 * Will manage the game board, entities, and interactions.
 */
export class Board {
  private readonly balance: Balance;

  constructor(balance: Balance) {
    this.balance = balance;
    console.log('Board initialized with balance data:', this.balance);
  }

  /**
   * Updates the board state.
   * Called every frame by the Game loop.
   * @param dt Delta time in seconds.
   */
  update(dt: number): void {
    // Placeholder - Game logic will go here later
    // We can now access balance data via this.balance
    // e.g., console.log(`Max towers allowed: ${this.balance.towers.maxTowers}`);
    // console.log(`Board update called with dt: ${dt.toFixed(4)}`); // Optional: uncomment for debugging
  }

  // Placeholder for rendering - will be added later
  render(ctx: CanvasRenderingContext2D): void {
    // Placeholder - Rendering logic will go here later
    // We can also access balance data here if needed for rendering decisions
    // e.g. const playerColor = this.balance.player.color || 'lightblue';
  }
}
