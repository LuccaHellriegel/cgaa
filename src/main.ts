import "./style.css";
import { Game } from "./Game";

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

// Handle window resize
window.addEventListener("resize", updateCanvasSize);

// Initialize and run game
const game = new Game(canvas);
game.start();
