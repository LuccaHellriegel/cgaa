import "./style.css";
import { Game } from "./Game";
import { PlayerManager } from "./PlayerManager";
import { EnemyManager } from "./EnemyManager";

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

// Create initial player in the center of the world
playerManager.createPlayer({
  x: game.WORLD_WIDTH / 2,
  y: game.WORLD_HEIGHT / 2,
});

// Generate enemies throughout the world
enemyManager.generateEnemies();

let lastTime = performance.now();

function gameLoop(): void {
  const currentTime = performance.now();
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  // Cap maximum delta time to prevent large jumps when tab is inactive
  const maxDeltaTime = 16.67; // Cap at ~16.67ms (60 fps)
  const cappedDeltaTime = Math.min(deltaTime, maxDeltaTime);

  // Update game components
  game.update();
  playerManager.update(cappedDeltaTime);
  enemyManager.update(cappedDeltaTime);

  // Render everything
  game.render();

  // Continue game loop
  requestAnimationFrame(gameLoop);
}

// Start the game loop
lastTime = performance.now();
gameLoop();
