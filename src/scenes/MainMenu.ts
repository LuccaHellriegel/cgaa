import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    // Add title
    this.add
      .text(this.scale.width / 2, 100, "Circle Gladiator Army Arena", {
        fontFamily: "Arial",
        fontSize: "48px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // Add menu options
    const menuItems = [
      { text: "Start Game", scene: "Game" },
      { text: "How to Play", scene: "Tutorial" },
      { text: "Options", scene: "Options" },
    ];

    menuItems.forEach((item, index) => {
      const y = this.scale.height / 2 + index * 60;
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
        .on("pointerdown", () => this.scene.start(item.scene));
    });
  }
}
