import { Scene } from "phaser";

interface GameOverData {
  score: number;
}

export class GameOver extends Scene {
  constructor() {
    super("GameOver");
  }

  create(data: GameOverData) {
    // Display game over message
    this.add
      .text(this.scale.width / 2, 200, "Game Over", {
        fontFamily: "Arial",
        fontSize: "64px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // Display score
    this.add
      .text(this.scale.width / 2, 300, `Score: ${data.score}`, {
        fontFamily: "Arial",
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // Add options
    const menuItems = [
      { text: "Try Again", action: () => this.scene.start("Game") },
      { text: "Main Menu", action: () => this.scene.start("MainMenu") },
    ];

    menuItems.forEach((item, index) => {
      const y = 400 + index * 60;
      const text = this.add
        .text(this.scale.width / 2, y, item.text, {
          fontFamily: "Arial",
          fontSize: "32px",
          color: "#ffffff",
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on("pointerover", () => text.setTint(0x00ff00))
        .on("pointerout", () => text.clearTint())
        .on("pointerdown", item.action);
    });
  }
}
