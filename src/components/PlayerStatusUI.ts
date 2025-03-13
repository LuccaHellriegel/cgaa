import { Scene } from "phaser";
import { GraphicsGenerator } from "../graphics/GraphicsGenerator";

export class PlayerStatusUI {
  private scene: Scene;
  private container: Phaser.GameObjects.Container;
  private healthBarContainer: Phaser.GameObjects.Container;
  private healthBar: Phaser.GameObjects.Rectangle;
  private healthBarBackground: Phaser.GameObjects.Rectangle;
  private healthText: Phaser.GameObjects.Text;
  private soulsContainer: Phaser.GameObjects.Container;
  private soulsIcon: Phaser.GameObjects.Arc;
  private soulsText: Phaser.GameObjects.Text;
  private soulsParticles: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Scene) {
    this.scene = scene;
    this.container = this.scene.add.container(0, 0);
    this.container.setDepth(100);
    this.container.setScrollFactor(0);

    this.createHealthBar();
    this.createSoulsCounter();
    this.setupParticles();

    // Listen for screen resize
    this.scene.scale.on("resize", this.updatePositions, this);
    this.updatePositions();
  }

  private updatePositions(): void {
    // Adjust positions based on screen size
    const margin = 20;

    if (this.healthBarContainer) {
      this.healthBarContainer.setPosition(margin, margin);
    }

    if (this.soulsContainer) {
      this.soulsContainer.setPosition(margin, margin + 40);
    }
  }

  private createHealthBar(): void {
    this.healthBarContainer = this.scene.add.container(0, 0);

    // Health bar background
    this.healthBarBackground = this.scene.add.rectangle(
      100,
      0,
      200,
      20,
      0x000000
    );
    this.healthBarBackground.setStrokeStyle(2, 0xffffff);

    // Health bar
    this.healthBar = this.scene.add.rectangle(100, 0, 200, 20, 0x00ff00);
    this.healthBar.setOrigin(0.5, 0.5);

    // Health text
    this.healthText = this.scene.add.text(100, 0, "100/100", {
      fontSize: "16px",
      color: "#ffffff",
    });
    this.healthText.setOrigin(0.5);

    this.healthBarContainer.add([
      this.healthBarBackground,
      this.healthBar,
      this.healthText,
    ]);
    this.container.add(this.healthBarContainer);
  }

  private createSoulsCounter(): void {
    this.soulsContainer = this.scene.add.container(0, 0);

    // Souls icon
    this.soulsIcon = this.scene.add.circle(
      15,
      0,
      8,
      GraphicsGenerator.Colors.SOUL
    );
    this.soulsIcon.setStrokeStyle(2, 0xffffff);

    // Souls text
    this.soulsText = this.scene.add.text(35, -10, "0", {
      fontSize: "20px",
      fontStyle: "bold",
      color: "#00ffff",
    });

    this.soulsContainer.add([this.soulsIcon, this.soulsText]);
    this.container.add(this.soulsContainer);
  }

  private setupParticles(): void {
    this.soulsParticles = this.scene.add.particles(0, 0, "particle", {
      tint: [GraphicsGenerator.Colors.SOUL],
      speed: { min: 20, max: 50 },
      scale: { start: 0.5, end: 0 },
      blendMode: Phaser.BlendModes.ADD,
      lifespan: 500,
      maxParticles: 5,
      active: false,
    });
  }

  public updateHealth(current: number, max: number): void {
    const percentage = current / max;
    this.healthBar.setScale(percentage, 1);
    this.healthText.setText(`${current}/${max}`);

    // Update color based on health percentage
    let color = 0x00ff00; // Green
    if (percentage <= 0.3) {
      color = 0xff0000; // Red
    } else if (percentage <= 0.6) {
      color = 0xffff00; // Yellow
    }
    this.healthBar.setFillStyle(color);
  }

  public updateSouls(amount: number, animate: boolean = false): void {
    const currentAmount = parseInt(this.soulsText.text);
    this.soulsText.setText(amount.toString());

    if (animate && amount > currentAmount) {
      // Play collection animation
      this.soulsParticles.explode(5, this.soulsIcon.x, this.soulsIcon.y);

      // Scale animation for the icon
      this.scene.tweens.add({
        targets: this.soulsIcon,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 100,
        yoyo: true,
        ease: "Quad.easeOut",
      });
    }
  }

  public showDamageEffect(): void {
    this.scene.cameras.main.flash(100, 255, 0, 0, true);
    this.healthBarContainer.setScale(1.2);
    this.scene.tweens.add({
      targets: this.healthBarContainer,
      scaleX: 1,
      scaleY: 1,
      duration: 100,
      ease: "Bounce.easeOut",
    });
  }

  public showHealEffect(): void {
    const particles = this.scene.add.particles(0, 0, "particle", {
      tint: [GraphicsGenerator.Colors.HEAL],
      speed: { min: 30, max: 60 },
      scale: { start: 0.3, end: 0 },
      blendMode: Phaser.BlendModes.ADD,
      lifespan: 400,
      maxParticles: 8,
    });

    particles.explode(
      8,
      this.healthBarContainer.x + 100,
      this.healthBarContainer.y
    );
    this.scene.time.delayedCall(400, () => particles.destroy());
  }

  public destroy(): void {
    this.scene.scale.off("resize", this.updatePositions, this);
    this.soulsParticles.destroy();
    this.container.destroy();
  }
}
