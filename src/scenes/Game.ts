import { Scene } from "phaser";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  create() {
    // Game content will be implemented here

    // Temporary event to move to GameOver
    this.input.once("pointerdown", () => {
      this.scene.start("GameOver");
    });
  }
}
