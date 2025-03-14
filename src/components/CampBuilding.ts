import { Scene } from "phaser";
import { BaseComponent } from "./BaseComponent";
import { WaveDirectionComponent } from "./WaveDirectionComponent";
import { WaveSpawningComponent } from "./WaveSpawningComponent";
import { assert } from "../utils/assert";

export enum BuildingSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

export interface BuildingConfig {
  size: BuildingSize;
  health: number;
  enemyType: string;
  spawnRate: number;
}

const BUILDING_CONFIGS: Record<BuildingSize, BuildingConfig> = {
  [BuildingSize.SMALL]: {
    size: BuildingSize.SMALL,
    health: 100,
    enemyType: "small",
    spawnRate: 1.5, // multiplier for camp's base spawn rate
  },
  [BuildingSize.MEDIUM]: {
    size: BuildingSize.MEDIUM,
    health: 200,
    enemyType: "medium",
    spawnRate: 2,
  },
  [BuildingSize.LARGE]: {
    size: BuildingSize.LARGE,
    health: 300,
    enemyType: "large",
    spawnRate: 2.5,
  },
};

export class CampBuilding extends BaseComponent {
  private config: BuildingConfig;
  private health: number;
  private sprite: Phaser.GameObjects.Rectangle;
  private healthBar: Phaser.GameObjects.Rectangle;
  private healthBarBackground: Phaser.GameObjects.Rectangle;
  private isDestroyed: boolean = false;
  private isQuestTarget: boolean = false;
  private isCooperating: boolean = false;
  private questMarker: Phaser.GameObjects.Text | null = null;
  private cooperationMarker: Phaser.GameObjects.Text | null = null;
  private id: string;
  private waveDirectionComponent: WaveDirectionComponent;
  private waveSpawningComponent: WaveSpawningComponent;

  constructor(scene: Scene, x: number, y: number, size: BuildingSize) {
    super({ scene, x, y });
    this.id = `camp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    this.config = BUILDING_CONFIGS[size];
    this.health = this.config.health;
    this.waveDirectionComponent = new WaveDirectionComponent(scene, this);
    this.waveSpawningComponent = new WaveSpawningComponent(scene, this);

    // Create building sprite with unique visuals based on size
    const width =
      size === BuildingSize.SMALL ? 30 : size === BuildingSize.MEDIUM ? 45 : 60;
    const height =
      size === BuildingSize.SMALL ? 30 : size === BuildingSize.MEDIUM ? 45 : 60;

    // Create a container for the camp visuals
    const container = scene.add.container(x, y);

    // Create base building shape
    this.sprite = scene.add.rectangle(
      0,
      0,
      width,
      height,
      this.getCampColor(size)
    );
    container.add(this.sprite);

    // Add decorative elements based on size
    if (size === BuildingSize.SMALL) {
      // Small camp: Simple watchtower
      const tower = scene.add.rectangle(
        -width / 4,
        -height / 4,
        width / 4,
        height / 2,
        0x444444
      );
      container.add(tower);
    } else if (size === BuildingSize.MEDIUM) {
      // Medium camp: Fortified walls
      const wallThickness = 4;
      const walls = [
        scene.add.rectangle(
          -width / 2,
          -height / 2,
          width,
          wallThickness,
          0x444444
        ), // Top
        scene.add.rectangle(
          -width / 2,
          height / 2,
          width,
          wallThickness,
          0x444444
        ), // Bottom
        scene.add.rectangle(
          -width / 2,
          -height / 2,
          wallThickness,
          height,
          0x444444
        ), // Left
        scene.add.rectangle(
          width / 2,
          -height / 2,
          wallThickness,
          height,
          0x444444
        ), // Right
      ];
      container.add(walls);
    } else {
      // Large camp: Fortress with towers and gate
      const towerSize = { width: width / 5, height: height / 3 };
      const towers = [
        scene.add.rectangle(
          -width / 2,
          -height / 2,
          towerSize.width,
          towerSize.height,
          0x444444
        ), // Top left
        scene.add.rectangle(
          width / 2 - towerSize.width,
          -height / 2,
          towerSize.width,
          towerSize.height,
          0x444444
        ), // Top right
        scene.add.rectangle(
          -width / 2,
          height / 2 - towerSize.height,
          towerSize.width,
          towerSize.height,
          0x444444
        ), // Bottom left
        scene.add.rectangle(
          width / 2 - towerSize.width,
          height / 2 - towerSize.height,
          towerSize.width,
          towerSize.height,
          0x444444
        ), // Bottom right
      ];
      const gate = scene.add.rectangle(
        0,
        height / 2 - towerSize.height / 2,
        width / 3,
        towerSize.height / 2,
        0x8b4513
      );
      container.add([...towers, gate]);
    }

    // Add physics
    scene.physics.add.existing(this.sprite, true);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setSize(width, height);

    // Create health bar
    const barWidth = width;
    const barHeight = 5;
    const barY = -height / 2 - barHeight - 2;

    this.healthBarBackground = scene.add.rectangle(
      0,
      barY,
      barWidth,
      barHeight,
      0x000000
    );
    this.healthBar = scene.add.rectangle(
      0,
      barY,
      barWidth,
      barHeight,
      0x00ff00
    );
    container.add([this.healthBarBackground, this.healthBar]);
    this.updateHealthBar();

    // Make camp interactive
    this.sprite.setInteractive();
    this.sprite.on("pointerdown", () => {
      this.scene.events.emit("showDiplomatMenu", this);
    });
  }

  private getCampColor(size: BuildingSize): number {
    switch (size) {
      case BuildingSize.SMALL:
        return 0x8b8b8b; // Light gray for small camps
      case BuildingSize.MEDIUM:
        return 0x707070; // Medium gray for medium camps
      case BuildingSize.LARGE:
        return 0x555555; // Dark gray for large camps
      default:
        return 0x666666;
    }
  }

  public markAsQuestTarget(): void {
    this.isQuestTarget = true;

    // Create quest target marker
    if (!this.questMarker) {
      this.questMarker = this.scene.add.text(
        this.sprite.x,
        this.sprite.y + this.sprite.height / 2 + 10,
        "❌",
        {
          fontSize: "24px",
          color: "#ff0000",
        }
      );
      this.questMarker.setOrigin(0.5);
      this.questMarker.setDepth(5);
    }
  }

  public setCooperating(value: boolean): void {
    if (this.isCooperating !== value) {
      this.isCooperating = value;

      // Update building appearance
      if (value) {
        this.sprite.setFillStyle(0x44ff44); // Green tint for cooperating camps

        // Create cooperation marker
        if (!this.cooperationMarker) {
          this.cooperationMarker = this.scene.add.text(
            this.sprite.x,
            this.sprite.y - this.sprite.height / 2 - 20,
            "C",
            {
              fontSize: "24px",
              color: "#44ff44",
              backgroundColor: "#000000",
              padding: { x: 4, y: 2 },
            }
          );
          this.cooperationMarker.setOrigin(0.5);
          this.cooperationMarker.setDepth(5);
        }

        // Play cooperation sound
        const audioManager = this.scene.registry.get("audioManager");
        if (audioManager) {
          audioManager.playSound("cooperation");
        }
      } else {
        this.sprite.setFillStyle(0x666666); // Reset to default color
        if (this.cooperationMarker) {
          this.cooperationMarker.destroy();
          this.cooperationMarker = null;
        }
        // Clear wave target when cooperation ends
        this.setWaveTarget(null);
      }

      // TODO: Add effects/animation when camp changes to cooperating state
      // Currently cooperation state changes without fanfare or clear feedback
      this.emit("stateChanged");
    }
  }

  public isCooperatingState(): boolean {
    return this.isCooperating;
  }

  public isQuestTargetState(): boolean {
    return this.isQuestTarget;
  }

  public takeDamage(amount: number): void {
    if (this.isDestroyed) return;

    this.health = Math.max(0, this.health - amount);
    this.updateHealthBar();

    // Play hit sound
    this.scene.registry.get("audioManager").playSound("hit");

    // Flash red
    this.sprite.setFillStyle(0xff0000);
    this.scene.time.delayedCall(100, () => {
      if (!this.isDestroyed) {
        this.sprite.setFillStyle(0x666666);
      }
    });

    if (this.health <= 0 && !this.isDestroyed) {
      this.isDestroyed = true;
      this.emit("stateChanged");
      this.destroy();
    }
  }

  private updateHealthBar(): void {
    const healthPercent = this.health / this.config.health;
    const width = this.healthBarBackground.width;
    this.healthBar.setDisplaySize(width * healthPercent, this.healthBar.height);
    this.healthBar.setX(
      this.healthBarBackground.x - (width - this.healthBar.displayWidth) / 2
    );
  }

  public getConfig(): BuildingConfig {
    return this.config;
  }

  public getSprite(): Phaser.GameObjects.Rectangle {
    return this.sprite;
  }

  public isDestroyedState(): boolean {
    return this.isDestroyed;
  }

  public update(time: number, delta: number): void {
    // Update health bar position to follow the building
    if (this.healthBar && this.healthBarBackground) {
      this.healthBarBackground.setPosition(this.sprite.x, this.sprite.y - 30);
      this.healthBar.setPosition(this.sprite.x, this.sprite.y - 30);
      this.healthBar.setScale(this.health / this.config.health, 1);
    }

    // Update marker positions
    if (this.questMarker) {
      this.questMarker.setPosition(
        this.sprite.x,
        this.sprite.y + this.sprite.height / 2 + 10
      );
    }
    if (this.cooperationMarker) {
      this.cooperationMarker.setPosition(
        this.sprite.x,
        this.sprite.y - this.sprite.height / 2 - 20
      );
    }

    // Update components
    this.waveDirectionComponent.update(time, delta);
    this.waveSpawningComponent.update(time, delta);
  }

  public destroy(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    // Play destroy sound
    this.scene.registry.get("audioManager").playSound("destroy");

    // Create simple destroy effect
    const numParticles = 20;
    for (let i = 0; i < numParticles; i++) {
      const angle = (i / numParticles) * Math.PI * 2;
      const particle = this.scene.add.circle(
        this.sprite.x,
        this.sprite.y,
        3,
        0xff0000
      );

      this.scene.tweens.add({
        targets: particle,
        x: this.sprite.x + Math.cos(angle) * 50,
        y: this.sprite.y + Math.sin(angle) * 50,
        alpha: 0,
        scale: 0,
        duration: 500,
        onComplete: () => {
          particle.destroy();
        },
      });
    }

    // Emit camp destroyed event
    this.scene.events.emit("campDestroyed", this);

    // Clean up
    this.healthBar.destroy();
    this.healthBarBackground.destroy();
    if (this.questMarker) {
      this.questMarker.destroy();
    }
    if (this.cooperationMarker) {
      this.cooperationMarker.destroy();
    }
    this.waveDirectionComponent.destroy();
    this.waveSpawningComponent.destroy();
    this.sprite.destroy();
  }

  public getId(): string {
    return this.id;
  }

  public unmarkAsQuestTarget(): void {
    this.isQuestTarget = false;
    if (this.questMarker) {
      this.questMarker.destroy();
      this.questMarker = null;
    }
  }

  public setWaveTarget(camp: CampBuilding | null): void {
    assert(
      camp === null || camp instanceof CampBuilding,
      "Wave target must be a CampBuilding or null"
    );

    // Update wave direction component
    this.waveDirectionComponent.setTargetCamp(camp);
  }

  public getWaveTarget(): CampBuilding | null {
    return this.waveDirectionComponent.getTargetCamp();
  }

  public on(event: string, callback: Function): void {
    this.addListener(event, callback);
  }

  public off(event: string, callback: Function): void {
    this.removeListener(event, callback);
  }
}
