import "./style.css";
import { Game } from "./Game";
import { PlayerManager } from "./PlayerManager";
import { EnemyManager } from "./EnemyManager";

// Create canvas element
const canvas = document.createElement("canvas");
canvas.id = "gameCanvas";
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

// Create instructions div
const instructions = document.createElement("div");
instructions.id = "instructions";
instructions.textContent =
  "WASD or Arrow Keys to move | Mouse to aim | Click to fire chain weapon";
document.body.appendChild(instructions);

// Initialize and run game
const game = new Game(canvas);

// Initialize managers
const playerManager = new PlayerManager(game);
const enemyManager = new EnemyManager(game);

// Set managers in game
game.setPlayerManager(playerManager);
game.setEnemyManager(enemyManager);

// Create initial player and enemies
playerManager.createPlayer({
  x: canvas.width / 2,
  y: canvas.height / 2,
});
enemyManager.generateEnemies();

let lastTime = performance.now();

function gameLoop(): void {
  const currentTime = performance.now();
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  // Update game components
  game.update();
  playerManager.update(deltaTime);
  enemyManager.update(deltaTime);

  // Render everything
  game.render();

  // Continue game loop
  requestAnimationFrame(gameLoop);
}

// Start the game loop
lastTime = performance.now();
gameLoop();
