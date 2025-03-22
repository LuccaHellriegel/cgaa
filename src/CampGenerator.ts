import { Vector2D, Camp, Wall, Entrance } from "./types";
import { Game } from "./Game";

export class CampGenerator {
  private readonly MIN_CAMP_RADIUS = 200;
  private readonly MAX_CAMP_RADIUS = 400;
  private readonly MIN_CAMP_DISTANCE = 400;
  private readonly WALL_THICKNESS = 25;
  private readonly ENTRANCE_WIDTH = 80;

  constructor(private game: Game) {}

  generateCamps(
    count: number,
    existingCamps: Camp[],
    nextCampId: number
  ): Camp[] {
    const worldArea = this.game.WORLD_WIDTH * this.game.WORLD_HEIGHT;
    const maxCamps = Math.floor(
      worldArea /
        (Math.PI * Math.pow(this.MAX_CAMP_RADIUS + this.MIN_CAMP_DISTANCE, 2))
    );
    const safeCount = Math.min(count, maxCamps);

    const maxAttempts = 100;
    let successfulCamps = 0;
    let totalAttempts = 0;
    const newCamps: Camp[] = [];
    let currentCampId = nextCampId;

    while (successfulCamps < safeCount && totalAttempts < maxAttempts) {
      const camp = this.generateCamp(currentCampId, [
        ...existingCamps,
        ...newCamps,
      ]);
      if (camp) {
        newCamps.push(camp);
        successfulCamps++;
        currentCampId++;
      }
      totalAttempts++;
    }

    return newCamps;
  }

  private generateCamp(campId: number, existingCamps: Camp[]): Camp | null {
    const maxAttempts = 50;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const radius =
        this.MIN_CAMP_RADIUS +
        Math.random() * (this.MAX_CAMP_RADIUS - this.MIN_CAMP_RADIUS);
      const position = this.findValidCampPosition(radius, existingCamps);

      if (position) {
        const camp: Camp = {
          id: campId,
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

    return null;
  }

  private findValidCampPosition(
    radius: number,
    existingCamps: Camp[]
  ): Vector2D | null {
    const margin = radius + this.WALL_THICKNESS;

    const x = margin + Math.random() * (this.game.WORLD_WIDTH - 2 * margin);
    const y = margin + Math.random() * (this.game.WORLD_HEIGHT - 2 * margin);

    const position = { x, y };

    for (const camp of existingCamps) {
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
    const edgeBuffer = Math.min(50, camp.radius / 2);

    for (let i = 0; i < count; i++) {
      const angle = i * angleStep + (Math.random() * 0.2 - 0.1);
      const entranceX = camp.position.x + Math.cos(angle) * camp.radius;
      const entranceY = camp.position.y + Math.sin(angle) * camp.radius;

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

    if (entrances.length === 0) {
      const distToLeft = camp.position.x;
      const distToRight = this.game.WORLD_WIDTH - camp.position.x;
      const distToTop = camp.position.y;
      const distToBottom = this.game.WORLD_HEIGHT - camp.position.y;

      const distances = [
        { dist: distToLeft, angle: Math.PI, dir: { x: -1, y: 0 } },
        { dist: distToRight, angle: 0, dir: { x: 1, y: 0 } },
        { dist: distToTop, angle: -Math.PI / 2, dir: { x: 0, y: -1 } },
        { dist: distToBottom, angle: Math.PI / 2, dir: { x: 0, y: 1 } },
      ];

      distances.sort((a, b) => b.dist - a.dist);

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
    const RADIUS_MULTIPLIER = 0.9;
    const squareSize = Math.round(camp.radius * RADIUS_MULTIPLIER * 2);
    const halfSize = squareSize / 2;

    const wallConfigs = [
      {
        x: camp.position.x,
        y: camp.position.y - halfSize,
        width: squareSize,
        height: this.WALL_THICKNESS,
        isVertical: false,
      },
      {
        x: camp.position.x,
        y: camp.position.y + halfSize,
        width: squareSize,
        height: this.WALL_THICKNESS,
        isVertical: false,
      },
      {
        x: camp.position.x - halfSize,
        y: camp.position.y,
        width: this.WALL_THICKNESS,
        height: squareSize,
        isVertical: true,
      },
      {
        x: camp.position.x + halfSize,
        y: camp.position.y,
        width: this.WALL_THICKNESS,
        height: squareSize,
        isVertical: true,
      },
    ];

    walls.push(
      {
        position: {
          x: camp.position.x - halfSize,
          y: camp.position.y - halfSize,
        },
        width: this.WALL_THICKNESS,
        height: this.WALL_THICKNESS,
        rotation: 0,
      },
      {
        position: {
          x: camp.position.x + halfSize,
          y: camp.position.y - halfSize,
        },
        width: this.WALL_THICKNESS,
        height: this.WALL_THICKNESS,
        rotation: 0,
      },
      {
        position: {
          x: camp.position.x - halfSize,
          y: camp.position.y + halfSize,
        },
        width: this.WALL_THICKNESS,
        height: this.WALL_THICKNESS,
        rotation: 0,
      },
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

    for (const config of wallConfigs) {
      let needsEntrance = false;
      let entrancePos = 0;
      let entranceWidth = 0;

      for (const entrance of camp.entrances) {
        const dx = entrance.position.x - camp.position.x;
        const dy = entrance.position.y - camp.position.y;
        const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);

        if (Math.abs(distanceFromCenter - camp.radius) < camp.radius * 0.2) {
          if (config.isVertical) {
            const distToWall = Math.abs(entrance.position.x - config.x);
            if (distToWall < this.WALL_THICKNESS * 2) {
              needsEntrance = true;
              entrancePos = entrance.position.y - (camp.position.y - halfSize);
              entranceWidth = entrance.width;
              break;
            }
          } else {
            const distToWall = Math.abs(entrance.position.y - config.y);
            if (distToWall < this.WALL_THICKNESS * 2) {
              needsEntrance = true;
              entrancePos = entrance.position.x - (camp.position.x - halfSize);
              entranceWidth = entrance.width;
              break;
            }
          }
        }
      }

      if (needsEntrance) {
        const wallSegments = [
          { start: 0, end: entrancePos - entranceWidth / 2 },
          { start: entrancePos + entranceWidth / 2, end: squareSize },
        ];

        for (const segment of wallSegments) {
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
}
