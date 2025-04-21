import { Balance } from './balance';
import { GameData } from './gamedata';
import { InputFrame } from './core/input';

/**
 * The main logic update function, called once per frame.
 * It orchestrates all game logic updates based on the current state,
 * balance data, player input, and elapsed time.
 *
 * @param balance Immutable game balance data.
 * @param gameData Mutable game state data.
 * @param input The collected input for the current frame.
 * @param dt Delta time in seconds since the last frame.
 */
export function TickAll(
  balance: Balance,
  gameData: GameData,
  input: InputFrame,
  dt: number
): void {
  // This function will be filled in by later stories.
  // It will contain calls to various logic subsystems (movement, spawning, combat, etc.).
  // console.log(`TickAll called with dt: ${dt}`); // Optional: for debugging
}
