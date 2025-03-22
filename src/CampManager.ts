import { Camp, Wall } from "./types";
import { Game } from "./Game";
import { CampGenerator } from "./CampGenerator";

export class CampManager {
  private camps: Camp[] = [];
  private nextCampId = 1;
  private generator: CampGenerator;

  constructor(game: Game) {
    this.generator = new CampGenerator(game);
  }

  generateCamps(count: number): void {
    const newCamps = this.generator.generateCamps(
      count,
      this.camps,
      this.nextCampId
    );

    this.camps.push(...newCamps);
    this.nextCampId += newCamps.length;
  }

  getCamps(): Camp[] {
    return this.camps;
  }

  render(ctx: CanvasRenderingContext2D): void {
    for (const camp of this.camps) {
      // Draw walls
      ctx.fillStyle = "#666666";
      for (const wall of camp.walls) {
        ctx.save();
        ctx.translate(wall.position.x, wall.position.y);
        ctx.fillRect(
          -wall.width / 2,
          -wall.height / 2,
          wall.width,
          wall.height
        );
        ctx.restore();
      }
    }
  }

  entityCollidesWithWalls(entity: {
    x: number;
    y: number;
    radius: number;
  }): boolean {
    for (const camp of this.camps) {
      for (const wall of camp.walls) {
        if (this.entityCollidesWithWall(entity, wall)) {
          return true;
        }
      }
    }
    return false;
  }

  private entityCollidesWithWall(
    entity: { x: number; y: number; radius: number },
    wall: Wall
  ): boolean {
    const halfWidth = wall.width / 2;
    const halfHeight = wall.height / 2;

    const closestX = Math.max(
      wall.position.x - halfWidth,
      Math.min(entity.x, wall.position.x + halfWidth)
    );
    const closestY = Math.max(
      wall.position.y - halfHeight,
      Math.min(entity.y, wall.position.y + halfHeight)
    );

    const distanceX = entity.x - closestX;
    const distanceY = entity.y - closestY;
    const distanceSquared = distanceX * distanceX + distanceY * distanceY;

    return distanceSquared < entity.radius * entity.radius;
  }
}
