import "./style.css";
import { Game } from "./Game";
import { PlayerManager } from "./PlayerManager";
import { EnemyManager } from "./EnemyManager";
import { Vector2D } from "./types";

// Debug flag for development visualizations
export const DEBUG = false;

// Create canvas element
const canvas = document.createElement("canvas");
canvas.id = "gameCanvas";
document.body.appendChild(canvas);

// Function to update canvas size
function updateCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Initial size setup
updateCanvasSize();

// Handle window resizing
window.addEventListener("resize", () => {
  updateCanvasSize();
});

// Initialize and run game
const game = new Game(canvas);

// Initialize managers
const playerManager = new PlayerManager(game);
const enemyManager = new EnemyManager(game, DEBUG);

// Set managers in game
game.setPlayerManager(playerManager);
game.setEnemyManager(enemyManager);

// Find a safe spawn position for the player
function findSafeSpawnPosition(game: Game, radius: number): Vector2D {
  const maxAttempts = 50;
  let attempts = 0;

  while (attempts < maxAttempts) {
    // Try positions in the center area of the map
    const x = game.WORLD_WIDTH * (0.4 + Math.random() * 0.2); // 40-60% of width
    const y = game.WORLD_HEIGHT * (0.4 + Math.random() * 0.2); // 40-60% of height

    // Check if position collides with any camp walls
    if (!game.getCampManager().entityCollidesWithWalls({ x, y, radius })) {
      return { x, y };
    }
    attempts++;
  }

  // Fallback to a position far from the center if no safe spot found
  return {
    x: game.WORLD_WIDTH * 0.25,
    y: game.WORLD_HEIGHT * 0.25,
  };
}

// Create initial player in a safe position
const spawnPosition = findSafeSpawnPosition(game, 20);
playerManager.createPlayer(spawnPosition);

// Generate enemies throughout the world
enemyManager.generateEnemies();

// Start the game
game.start();
