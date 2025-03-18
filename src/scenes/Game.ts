import { Scene } from "phaser";

export class Game extends Scene {
  private circle!: Phaser.GameObjects.Arc;
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
    // Create the circle in the middle of the world
    this.circle = this.add.circle(0, 0, 50, 0xff0000);
    this.circle.setDepth(1);

    // Set up physics for the circle
    this.physics.add.existing(this.circle);
    const body = this.circle.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);

    // Create a larger world than the screen
    this.physics.world.setBounds(0, 0, 2000, 2000);

    // Make the camera follow the circle
    this.cameras.main.startFollow(this.circle);

    // Set up keyboard input
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();

      // Add WASD keys, making sure they're properly initialized
      this.input.keyboard.addKeys("W,A,S,D");
      this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }
  }

  update() {
    const body = this.circle.body as Phaser.Physics.Arcade.Body;

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
