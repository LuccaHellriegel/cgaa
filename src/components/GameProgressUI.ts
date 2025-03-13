import { Scene } from "phaser";
import { GraphicsGenerator } from "../graphics/GraphicsGenerator";

export interface ObjectiveMarker {
  id: string;
  position: Phaser.Math.Vector2;
  type: "camp" | "quest" | "enemy";
  distance?: number;
}

export class GameProgressUI {
  private scene: Scene;
  private container: Phaser.GameObjects.Container;
  private waveContainer: Phaser.GameObjects.Container;
  private waveText: Phaser.GameObjects.Text;
  private timerText: Phaser.GameObjects.Text;
  private objectiveMarkers: Map<string, Phaser.GameObjects.Container> =
    new Map();
  private minimap: Phaser.GameObjects.Container;
  private minimapObjects: Map<string, Phaser.GameObjects.Arc> = new Map();

  constructor(scene: Scene) {
    this.scene = scene;
    this.container = this.scene.add.container(0, 0);
    this.container.setDepth(90); // Below PlayerStatusUI
    this.container.setScrollFactor(0);

    this.createWaveInfo();
    this.createMinimap();

    // Listen for screen resize
    this.scene.scale.on("resize", this.updatePositions, this);
  }

  private createWaveInfo(): void {
    this.waveContainer = this.scene.add.container(0, 0);

    // Wave counter background
    const background = this.scene.add.rectangle(0, 0, 180, 50, 0x000000, 0.7);
    background.setStrokeStyle(1, 0xffffff);

    // Wave counter text
    this.waveText = this.scene.add.text(-70, -15, "Wave: 1", {
      fontSize: "18px",
      color: "#ffffff",
      fontStyle: "bold",
    });

    // Next wave timer
    this.timerText = this.scene.add.text(-70, 10, "Next: 0:30", {
      fontSize: "14px",
      color: "#ffff00",
    });

    this.waveContainer.add([background, this.waveText, this.timerText]);
    this.container.add(this.waveContainer);
    this.updatePositions();
  }

  private createMinimap(): void {
    const size = Math.min(150, this.scene.scale.width * 0.15);

    this.minimap = this.scene.add.container(0, 0);

    // Minimap background
    const background = this.scene.add.rectangle(
      0,
      0,
      size,
      size,
      0x000000,
      0.7
    );
    background.setStrokeStyle(1, 0xffffff);
    this.minimap.add(background);

    // Player marker (always centered)
    const playerMarker = this.scene.add.circle(
      0,
      0,
      4,
      GraphicsGenerator.Colors.PLAYER
    );
    this.minimap.add(playerMarker);

    this.container.add(this.minimap);
    this.updatePositions();
  }

  public updatePositions(): void {
    const padding = 50;

    if (this.waveContainer) {
      // Position wave info in the top-right corner with proper padding
      this.waveContainer.setPosition(
        this.scene.scale.width - padding - 90, // Offset by half the container width
        padding
      );
    }

    if (this.minimap) {
      const size = Math.min(150, this.scene.scale.width * 0.15);
      this.minimap.setPosition(
        this.scene.scale.width - size / 2 - padding,
        this.scene.scale.height - size / 2 - padding
      );

      // Resize minimap background if needed
      const background = this.minimap.getAt(0) as Phaser.GameObjects.Rectangle;
      if (background) {
        background.width = size;
        background.height = size;
      }
    }
  }

  public updateWaveInfo(wave: number, timeToNext: number): void {
    this.waveText.setText(`Wave: ${wave}`);

    const minutes = Math.floor(timeToNext / 60);
    const seconds = Math.floor(timeToNext % 60);
    this.timerText.setText(
      `Next: ${minutes}:${seconds.toString().padStart(2, "0")}`
    );

    // Flash timer when wave is about to start
    if (timeToNext <= 10) {
      this.timerText.setColor("#ff0000");
    } else {
      this.timerText.setColor("#ffff00");
    }
  }

  public updateObjectiveMarkers(objectives: ObjectiveMarker[]): void {
    // Clear old markers
    this.objectiveMarkers.forEach((marker) => marker.destroy());
    this.objectiveMarkers.clear();

    // We'll let updateMinimapPositions handle the minimap markers instead of creating them here
    // This avoids duplicate creation and removal of minimap markers

    objectives.forEach((objective) => {
      // Create marker container
      const marker = this.scene.add.container(
        objective.position.x,
        objective.position.y
      );

      // Create marker based on type
      let color: number;
      switch (objective.type) {
        case "camp":
          color = GraphicsGenerator.Colors.NEUTRAL;
          break;
        case "quest":
          color = GraphicsGenerator.Colors.WARNING;
          break;
        case "enemy":
          color = GraphicsGenerator.Colors.ENEMY;
          break;
      }

      // Marker circle
      const circle = this.scene.add.circle(0, 0, 10, color, 0.8);
      circle.setStrokeStyle(2, 0xffffff);
      marker.add(circle);

      // Distance text if provided
      if (objective.distance !== undefined) {
        const distanceText = this.scene.add.text(
          15,
          -5,
          `${Math.round(objective.distance)}m`,
          {
            fontSize: "12px",
            color: "#ffffff",
          }
        );
        marker.add(distanceText);
      }

      this.objectiveMarkers.set(objective.id, marker);
    });
  }

  public updateMinimapPositions(
    playerPosition: Phaser.Math.Vector2,
    objectives: ObjectiveMarker[]
  ): void {
    // Get minimap size from the background rectangle
    const background = this.minimap.getAt(0) as Phaser.GameObjects.Rectangle;
    const minimapSize = background ? background.width : 150;
    const halfSize = minimapSize / 2;

    // Adjust scale factor - using a reasonable scale for the game world
    const scale = 0.05; // Reduced from 0.1 to avoid positions going out of bounds
    const maxDistance = halfSize - 4; // Maximum distance from center, leaving room for marker size

    // Create a set of current objective IDs to track which markers should remain
    const currentObjectiveIds = new Set(objectives.map((obj) => obj.id));

    // Remove any markers that aren't in the current objectives (cleanup old markers)
    this.minimapObjects.forEach((marker, id) => {
      if (!currentObjectiveIds.has(id)) {
        marker.destroy();
        this.minimapObjects.delete(id);
      }
    });

    objectives.forEach((objective) => {
      let minimapMarker = this.minimapObjects.get(objective.id);

      // If marker doesn't exist, create a new one
      if (!minimapMarker) {
        let color: number;
        switch (objective.type) {
          case "camp":
            color = GraphicsGenerator.Colors.NEUTRAL;
            break;
          case "quest":
            color = GraphicsGenerator.Colors.WARNING;
            break;
          case "enemy":
            color = GraphicsGenerator.Colors.ENEMY;
            break;
        }

        minimapMarker = this.scene.add.circle(0, 0, 2, color);
        this.minimapObjects.set(objective.id, minimapMarker);
        this.minimap.add(minimapMarker);
      }

      // Calculate relative position to player
      let relativeX = (objective.position.x - playerPosition.x) * scale;
      let relativeY = (objective.position.y - playerPosition.y) * scale;

      // Apply bounds checking to keep markers inside the minimap
      // Calculate distance from center
      const distance = Math.sqrt(relativeX * relativeX + relativeY * relativeY);

      // If marker would be outside the minimap bounds, scale it to the edge
      if (distance > maxDistance && distance > 0) {
        const ratio = maxDistance / distance;
        relativeX *= ratio;
        relativeY *= ratio;
      }

      minimapMarker.setPosition(relativeX, relativeY);
    });
  }

  public showOffscreenIndicator(objective: ObjectiveMarker): void {
    const marker = this.objectiveMarkers.get(objective.id);
    if (!marker) return;

    // Calculate if objective is off screen
    const camera = this.scene.cameras.main;
    const bounds = {
      left: camera.scrollX,
      right: camera.scrollX + camera.width,
      top: camera.scrollY,
      bottom: camera.scrollY + camera.height,
    };

    const isOffscreen =
      objective.position.x < bounds.left ||
      objective.position.x > bounds.right ||
      objective.position.y < bounds.top ||
      objective.position.y > bounds.bottom;

    if (isOffscreen) {
      // Calculate angle to objective
      const centerX = camera.scrollX + camera.width / 2;
      const centerY = camera.scrollY + camera.height / 2;
      const angle = Phaser.Math.Angle.Between(
        centerX,
        centerY,
        objective.position.x,
        objective.position.y
      );

      // Position indicator on screen edge
      const radius = Math.min(camera.width, camera.height) / 2 - 50;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      marker.setPosition(x, y);
      marker.setAlpha(0.8);
    } else {
      marker.setPosition(objective.position.x, objective.position.y);
      marker.setAlpha(1);
    }
  }

  public destroy(): void {
    this.scene.scale.off("resize", this.updatePositions, this);
    this.objectiveMarkers.forEach((marker) => marker.destroy());
    this.minimapObjects.forEach((marker) => marker.destroy());
    this.container.destroy();
  }
}
