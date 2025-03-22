import "./style.css";
import { Game } from "./Game";

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

function gameLoop(): void {
  game.update();
  game.render();
  requestAnimationFrame(gameLoop);
}

gameLoop();
