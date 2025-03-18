import { Scene } from "phaser";
import { TextureManager } from "../textures/TextureManager";

export class Game extends Scene {
  private player!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wKey!: Phaser.Input.Keyboard.Key;
  private aKey!: Phaser.Input.Keyboard.Key;
  private sKey!: Phaser.Input.Keyboard.Key;
  private dKey!: Phaser.Input.Keyboard.Key;
  private speed: number = 300;

  constructor() {
    super("Game");
  }

  create() {
    // Get the TextureManager from the registry
    const textureManager = this.registry.get(
      "textureManager"
    ) as TextureManager;

    // Create a texture showcase
    this.createTextureShowcase(textureManager);

    // Create the player circle
    this.createPlayer(textureManager);

    // Set up keyboard input
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();

      // Add WASD keys
      this.input.keyboard.addKeys("W,A,S,D");
      this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    // Create a larger world than the screen
    this.physics.world.setBounds(0, 0, 2000, 2000);

    // Make the camera follow the player
    this.cameras.main.startFollow(this.player);

    // Add text instructions
    this.add
      .text(10, 10, "Use WASD keys to move and explore the textures", {
        color: "#ffffff",
        fontSize: "18px",
      })
      .setScrollFactor(0)
      .setDepth(10);
  }

  private createPlayer(textureManager: TextureManager) {
    // Use a generated texture for the player
    const textureKey = textureManager.getCircleTexture({
      radius: 20,
      color: 0xff0000,
      strokeColor: 0xffffff,
      strokeWidth: 2,
    });

    // Create the player as a sprite using the texture
    this.player = this.add.sprite(1000, 1000, textureKey);
    this.player.setDepth(10);

    // Set up physics for the player
    this.physics.add.existing(this.player);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
  }

  private createTextureShowcase(textureManager: TextureManager) {
    const colors = [
      0xff0000, // Red
      0x00ff00, // Green
      0x0000ff, // Blue
      0xffff00, // Yellow
      0xff00ff, // Magenta
      0x00ffff, // Cyan
      0xffffff, // White
    ];

    // Create a background
    this.add.rectangle(1000, 1000, 1500, 1500, 0x111111).setDepth(0);

    // Create a title for the showcase
    this.add
      .text(1000, 300, "TEXTURE SHOWCASE", {
        color: "#ffffff",
        fontSize: "32px",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(5);

    // Circle Textures Section
    this.add
      .text(1000, 350, "CIRCLE TEXTURES", {
        color: "#ffffff",
        fontSize: "24px",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(5);

    // Create a grid of circles with different sizes and colors
    // Size variation
    for (let size = 5; size <= 50; size += 5) {
      this.add
        .text(400, 400 + (size - 5) * 20, `Size: ${size}px`, {
          color: "#ffffff",
          fontSize: "14px",
        })
        .setDepth(5);

      // Create a row of circles with this size and different colors
      for (let i = 0; i < colors.length; i++) {
        const color = colors[i];
        const x = 600 + i * 100;
        const y = 400 + (size - 5) * 20;

        // Get the texture key for this circle
        const textureKey = textureManager.getCircleTexture({
          radius: size,
          color,
        });

        // Create a sprite using the texture
        this.add.sprite(x, y, textureKey).setDepth(1);
      }
    }

    // Triangle Textures Section
    this.add
      .text(1000, 1200, "TRIANGLE TEXTURES", {
        color: "#ffffff",
        fontSize: "24px",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(5);

    // Create a grid of triangles with different sizes and colors
    // Size variation
    for (let size = 10; size <= 60; size += 10) {
      this.add
        .text(400, 1250 + (size - 10) * 20, `Size: ${size}px`, {
          color: "#ffffff",
          fontSize: "14px",
        })
        .setDepth(5);

      // Create a row of triangles with this size and different colors
      for (let i = 0; i < colors.length; i++) {
        const color = colors[i];
        const x = 600 + i * 100;
        const y = 1250 + (size - 10) * 20;

        // Get the texture key for this triangle
        const textureKey = textureManager.getTriangleTexture({
          sideLength: size,
          color,
        });

        // Create a sprite using the texture
        this.add.sprite(x, y, textureKey).setDepth(1);
      }
    }

    // Create a grid of triangles with different stroke settings
    this.add
      .text(1000, 1500, "TRIANGLES WITH STROKE", {
        color: "#ffffff",
        fontSize: "24px",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(5);

    // Different stroke widths
    for (let strokeWidth = 1; strokeWidth <= 5; strokeWidth++) {
      const y = 1600 + (strokeWidth - 1) * 120;

      this.add
        .text(400, y, `Stroke: ${strokeWidth}px`, {
          color: "#ffffff",
          fontSize: "14px",
        })
        .setDepth(5);

      // Create a row of triangles with different colors
      for (let i = 0; i < colors.length; i++) {
        const color = colors[i];
        const x = 600 + i * 100;

        // Get the texture key for this triangle
        const textureKey = textureManager.getTriangleTexture({
          sideLength: 30,
          color,
          strokeColor: 0xffffff,
          strokeWidth,
        });

        // Create a sprite using the texture
        this.add.sprite(x, y, textureKey).setDepth(1);
      }
    }

    // Circles with Stroke Section
    this.add
      .text(1000, 700, "CIRCLES WITH STROKE", {
        color: "#ffffff",
        fontSize: "24px",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(5);

    // Different stroke widths
    for (let strokeWidth = 1; strokeWidth <= 5; strokeWidth++) {
      const y = 800 + (strokeWidth - 1) * 100;

      this.add
        .text(400, y, `Stroke: ${strokeWidth}px`, {
          color: "#ffffff",
          fontSize: "14px",
        })
        .setDepth(5);

      // Create a row of circles with different colors
      for (let i = 0; i < colors.length; i++) {
        const color = colors[i];
        const x = 600 + i * 100;

        // Get the texture key for this circle
        const textureKey = textureManager.getCircleTexture({
          radius: 20,
          color,
          strokeColor: 0xffffff,
          strokeWidth,
        });

        // Create a sprite using the texture
        this.add.sprite(x, y, textureKey).setDepth(1);
      }
    }
  }

  update() {
    const body = this.player.body as Phaser.Physics.Arcade.Body;

    // Reset velocity
    body.setVelocity(0);

    // Handle movement with WASD keys
    if (this.wKey && this.wKey.isDown) {
      body.setVelocityY(-this.speed);
    } else if (this.sKey && this.sKey.isDown) {
      body.setVelocityY(this.speed);
    }

    if (this.aKey && this.aKey.isDown) {
      body.setVelocityX(-this.speed);
    } else if (this.dKey && this.dKey.isDown) {
      body.setVelocityX(this.speed);
    }
  }
}
