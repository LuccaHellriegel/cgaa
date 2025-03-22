import { Vector2D, Camp, Wall, Entrance } from "./types";
import { Game } from "./Game";

export class CampManager {
  private camps: Camp[] = [];
  private nextCampId = 1;
  private readonly MIN_CAMP_RADIUS = 200;
  private readonly MAX_CAMP_RADIUS = 400;
  private readonly MIN_CAMP_DISTANCE = 400;
  private readonly WALL_THICKNESS = 25;
  private readonly ENTRANCE_WIDTH = 80;

  constructor(private game: Game) {}

  generateCamps(count: number): void {
    const worldArea = this.game.WORLD_WIDTH * this.game.WORLD_HEIGHT;
    const maxCamps = Math.floor(
      worldArea /
        (Math.PI * Math.pow(this.MAX_CAMP_RADIUS + this.MIN_CAMP_DISTANCE, 2))
    );
    const safeCount = Math.min(count, maxCamps);

    console.log(
      `Attempting to generate ${safeCount} camps (max possible: ${maxCamps})`
    );

    const maxAttempts = 100;
    let successfulCamps = 0;
    let totalAttempts = 0;

    while (successfulCamps < safeCount && totalAttempts < maxAttempts) {
      const camp = this.generateCamp();
      if (camp) {
        this.camps.push(camp);
        successfulCamps++;
        console.log(
          `Successfully generated camp ${successfulCamps}/${safeCount}`
        );
      }
      totalAttempts++;
    }

    if (successfulCamps < safeCount) {
      console.warn(
        `Only generated ${successfulCamps}/${safeCount} camps after ${totalAttempts} attempts`
      );
    }
  }

  private generateCamp(): Camp | null {
    const maxAttempts = 50;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const radius =
        this.MIN_CAMP_RADIUS +
        Math.random() * (this.MAX_CAMP_RADIUS - this.MIN_CAMP_RADIUS);
      const position = this.findValidCampPosition(radius);

      if (position) {
        const camp: Camp = {
          id: this.nextCampId++,
          position,
          radius,
          color: this.generateCampColor(),
          walls: [],
          entrances: [],
        };

        const entranceCount = 1 + Math.floor(Math.random() * 3); // 1-3 entrances
        camp.entrances = this.generateEntrances(camp, entranceCount);
        camp.walls = this.generateWalls(camp);

        return camp;
      }

      attempts++;
    }

    console.warn("Failed to generate valid camp position after max attempts");
    return null;
  }

  private findValidCampPosition(radius: number): Vector2D | null {
    // Use a smaller margin that's just enough to keep camps from the edges
    const margin = radius + this.WALL_THICKNESS;

    const x = margin + Math.random() * (this.game.WORLD_WIDTH - 2 * margin);
    const y = margin + Math.random() * (this.game.WORLD_HEIGHT - 2 * margin);

    const position = { x, y };

    // Check if position overlaps with existing camps
    for (const camp of this.camps) {
      const dx = camp.position.x - position.x;
      const dy = camp.position.y - position.y;
      const minDistance = camp.radius + radius + this.MIN_CAMP_DISTANCE;

      if (dx * dx + dy * dy < minDistance * minDistance) {
        return null;
      }
    }

    return position;
  }

  private generateEntrances(camp: Camp, count: number): Entrance[] {
    const entrances: Entrance[] = [];
    const angleStep = (Math.PI * 2) / count;
    const edgeBuffer = Math.min(50, camp.radius / 2); // Reduced buffer, scaled with camp size

    // Try primary entrance positions first
    for (let i = 0; i < count; i++) {
      const angle = i * angleStep + (Math.random() * 0.2 - 0.1); // Small variation
      const entranceX = camp.position.x + Math.cos(angle) * camp.radius;
      const entranceY = camp.position.y + Math.sin(angle) * camp.radius;

      // Skip if too close to map edge
      if (
        entranceX < edgeBuffer ||
        entranceX > this.game.WORLD_WIDTH - edgeBuffer ||
        entranceY < edgeBuffer ||
        entranceY > this.game.WORLD_HEIGHT - edgeBuffer
      ) {
        continue;
      }

      entrances.push({
        position: { x: entranceX, y: entranceY },
        width: this.ENTRANCE_WIDTH,
        direction: {
          x: Math.cos(angle),
          y: Math.sin(angle),
        },
      });
    }

    // If no entrances were created, force at least one entrance on the most suitable side
    if (entrances.length === 0) {
      // Calculate distances to each edge
      const distToLeft = camp.position.x;
      const distToRight = this.game.WORLD_WIDTH - camp.position.x;
      const distToTop = camp.position.y;
      const distToBottom = this.game.WORLD_HEIGHT - camp.position.y;

      // Find the side with most space
      const distances = [
        { dist: distToLeft, angle: Math.PI, dir: { x: -1, y: 0 } },
        { dist: distToRight, angle: 0, dir: { x: 1, y: 0 } },
        { dist: distToTop, angle: -Math.PI / 2, dir: { x: 0, y: -1 } },
        { dist: distToBottom, angle: Math.PI / 2, dir: { x: 0, y: 1 } },
      ];

      // Sort by distance from edge, descending
      distances.sort((a, b) => b.dist - a.dist);

      // Use the side with most space
      const bestSide = distances[0];
      const entranceX =
        camp.position.x + Math.cos(bestSide.angle) * camp.radius;
      const entranceY =
        camp.position.y + Math.sin(bestSide.angle) * camp.radius;

      entrances.push({
        position: { x: entranceX, y: entranceY },
        width: this.ENTRANCE_WIDTH,
        direction: bestSide.dir,
      });
    }

    return entrances;
  }

  private generateWalls(camp: Camp): Wall[] {
    const walls: Wall[] = [];
    const RADIUS_MULTIPLIER = 0.9; // Slightly reduce radius for square shape
    const squareSize = Math.round(camp.radius * RADIUS_MULTIPLIER * 2);
    const halfSize = squareSize / 2;

    // Create wall configs for each side of the square
    const wallConfigs = [
      // Top wall
      {
        x: camp.position.x,
        y: camp.position.y - halfSize,
        width: squareSize,
        height: this.WALL_THICKNESS,
        isVertical: false,
      },
      // Bottom wall
      {
        x: camp.position.x,
        y: camp.position.y + halfSize,
        width: squareSize,
        height: this.WALL_THICKNESS,
        isVertical: false,
      },
      // Left wall
      {
        x: camp.position.x - halfSize,
        y: camp.position.y,
        width: this.WALL_THICKNESS,
        height: squareSize,
        isVertical: true,
      },
      // Right wall
      {
        x: camp.position.x + halfSize,
        y: camp.position.y,
        width: this.WALL_THICKNESS,
        height: squareSize,
        isVertical: true,
      },
    ];

    // Add corner blocks to ensure walls connect
    walls.push(
      // Top-Left corner
      {
        position: {
          x: camp.position.x - halfSize,
          y: camp.position.y - halfSize,
        },
        width: this.WALL_THICKNESS,
        height: this.WALL_THICKNESS,
        rotation: 0,
      },
      // Top-Right corner
      {
        position: {
          x: camp.position.x + halfSize,
          y: camp.position.y - halfSize,
        },
        width: this.WALL_THICKNESS,
        height: this.WALL_THICKNESS,
        rotation: 0,
      },
      // Bottom-Left corner
      {
        position: {
          x: camp.position.x - halfSize,
          y: camp.position.y + halfSize,
        },
        width: this.WALL_THICKNESS,
        height: this.WALL_THICKNESS,
        rotation: 0,
      },
      // Bottom-Right corner
      {
        position: {
          x: camp.position.x + halfSize,
          y: camp.position.y + halfSize,
        },
        width: this.WALL_THICKNESS,
        height: this.WALL_THICKNESS,
        rotation: 0,
      }
    );

    // Process each wall config
    for (const config of wallConfigs) {
      // Check if any entrance intersects with this wall
      let needsEntrance = false;
      let entrancePos = 0;
      let entranceWidth = 0;

      for (const entrance of camp.entrances) {
        const dx = entrance.position.x - camp.position.x;
        const dy = entrance.position.y - camp.position.y;
        const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);

        // Make the entrance detection more lenient
        if (Math.abs(distanceFromCenter - camp.radius) < camp.radius * 0.2) {
          // More forgiving distance check
          if (config.isVertical) {
            // For vertical walls, check if entrance is close to this wall's x-coordinate
            const distToWall = Math.abs(entrance.position.x - config.x);
            if (distToWall < this.WALL_THICKNESS * 2) {
              // More forgiving wall distance check
              needsEntrance = true;
              entrancePos = entrance.position.y - (camp.position.y - halfSize);
              entranceWidth = entrance.width;
              break;
            }
          } else {
            // For horizontal walls, check if entrance is close to this wall's y-coordinate
            const distToWall = Math.abs(entrance.position.y - config.y);
            if (distToWall < this.WALL_THICKNESS * 2) {
              // More forgiving wall distance check
              needsEntrance = true;
              entrancePos = entrance.position.x - (camp.position.x - halfSize);
              entranceWidth = entrance.width;
              break;
            }
          }
        }
      }

      if (needsEntrance) {
        // Create wall segments with a gap for the entrance
        const wallSegments = [
          { start: 0, end: entrancePos - entranceWidth / 2 },
          { start: entrancePos + entranceWidth / 2, end: squareSize },
        ];

        for (const segment of wallSegments) {
          // Only create if segment is long enough
          if (segment.end - segment.start > 10) {
            walls.push({
              position: {
                x: config.isVertical
                  ? config.x
                  : camp.position.x -
                    halfSize +
                    segment.start +
                    (segment.end - segment.start) / 2,
                y: config.isVertical
                  ? camp.position.y -
                    halfSize +
                    segment.start +
                    (segment.end - segment.start) / 2
                  : config.y,
              },
              width: config.isVertical
                ? config.width
                : segment.end - segment.start,
              height: config.isVertical
                ? segment.end - segment.start
                : config.height,
              rotation: 0,
            });
          }
        }
      } else {
        // Add a single wall if no entrance
        walls.push({
          position: {
            x: config.x,
            y: config.y,
          },
          width: config.width,
          height: config.height,
          rotation: 0,
        });
      }
    }

    return walls;
  }

  private generateCampColor(): string {
    const themes = [
      "#FF6B6B", // Red theme
      "#4ECDC4", // Teal theme
      "#45B7D1", // Blue theme
      "#96CEB4", // Green theme
      "#FFEEAD", // Yellow theme
    ];
    return themes[Math.floor(Math.random() * themes.length)];
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
    // Find the closest point on the rectangle to the circle
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

    // Calculate distance from closest point to circle center
    const distanceX = entity.x - closestX;
    const distanceY = entity.y - closestY;
    const distanceSquared = distanceX * distanceX + distanceY * distanceY;

    // Check if the distance is less than the circle's radius
    return distanceSquared < entity.radius * entity.radius;
  }
}
