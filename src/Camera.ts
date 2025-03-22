import { Entity } from "./Entity";
import { Vector2D } from "./types";
import { assertValue } from "./utils/assert";

export class Camera {
  public position: Vector2D = { x: 0, y: 0 };
  public viewportWidth: number;
  public viewportHeight: number;
  public worldWidth: number;
  public worldHeight: number;

  constructor(
    viewportWidth: number,
    viewportHeight: number,
    worldWidth: number,
    worldHeight: number
  ) {
    this.viewportWidth = assertValue(
      viewportWidth,
      "Viewport width must be provided"
    );
    this.viewportHeight = assertValue(
      viewportHeight,
      "Viewport height must be provided"
    );
    this.worldWidth = assertValue(worldWidth, "World width must be provided");
    this.worldHeight = assertValue(
      worldHeight,
      "World height must be provided"
    );
  }

  followEntity(entity: Entity, smoothFactor: number = 0.1): void {
    const targetX = entity.position.x - this.viewportWidth / 2;
    const targetY = entity.position.y - this.viewportHeight / 2;

    this.position.x += (targetX - this.position.x) * smoothFactor;
    this.position.y += (targetY - this.position.y) * smoothFactor;

    this.position.x = Math.max(
      0,
      Math.min(this.position.x, this.worldWidth - this.viewportWidth)
    );
    this.position.y = Math.max(
      0,
      Math.min(this.position.y, this.worldHeight - this.viewportHeight)
    );
  }

  worldToScreen(worldPos: Vector2D): Vector2D {
    return {
      x: worldPos.x - this.position.x,
      y: worldPos.y - this.position.y,
    };
  }

  screenToWorld(screenPos: Vector2D): Vector2D {
    return {
      x: screenPos.x + this.position.x,
      y: screenPos.y + this.position.y,
    };
  }

  isEntityVisible(entity: Entity): boolean {
    return (
      entity.position.x + entity.radius >= this.position.x &&
      entity.position.x - entity.radius <=
        this.position.x + this.viewportWidth &&
      entity.position.y + entity.radius >= this.position.y &&
      entity.position.y - entity.radius <= this.position.y + this.viewportHeight
    );
  }
}
