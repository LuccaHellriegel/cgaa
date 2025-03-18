import { Scene } from "phaser";

export class GameOver extends Scene {
  constructor() {
    super("GameOver");
  }

  create() {
    // Game over content will be implemented here

    // Temporary event to return to MainMenu
    this.input.once("pointerdown", () => {
      this.scene.start("MainMenu");
    });
  }
}
