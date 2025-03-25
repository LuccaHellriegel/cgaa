import { Game } from "./Game";

try {
  console.log("Starting game...");
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const game = new Game(canvas);
  game.start();
  console.log("Game started successfully");
} catch (error) {
  console.error("Error starting game:", error);
  // Display error on screen
  const errorDiv = document.createElement("div");
  errorDiv.style.color = "red";
  errorDiv.style.padding = "20px";
  errorDiv.style.fontFamily = "monospace";
  errorDiv.innerHTML = `<h2>Error starting game</h2><pre>${error}</pre>`;
  document.body.appendChild(errorDiv);
}
