import { Entity } from "./Entity";
import { Game } from "./Game";
import { Vector2D } from "./types";
import { Pathfinding } from "./Pathfinding";
import { assert, assertValue } from "./utils/assert";

export class EnemyAI {
  private pathfinder: Pathfinding;
  private game: Game;
  private debug: boolean;

  constructor(game: Game, debug: boolean = false) {
    this.game = assertValue(game, "Game instance must be provided");
    this.pathfinder = new Pathfinding(game.WORLD_WIDTH, game.WORLD_HEIGHT, 30);
    this.debug = debug;
  }

  updateAI(enemy: Entity): void {
    // Skip if entity doesn't have AI or pathfinding components
    if (!enemy.ai || !enemy.pathfinding) return;

    const now = Date.now();
    const ai = assertValue(enemy.ai, "Enemy must have AI component");
    const pathfinding = assertValue(
      enemy.pathfinding,
      "Enemy must have pathfinding component"
    );
    const position = assertValue(enemy.position, "Enemy must have position");

    // Check for wall collisions
    const collidesWithWalls = this.game
      .getCampManager()
      .entityCollidesWithWalls({
        x: position.x,
        y: position.y,
        radius: enemy.radius,
      });

    if (collidesWithWalls) {
      pathfinding.needsPathUpdate = true;
    }

    switch (ai.state) {
      case "IDLE":
        // If idle time has passed, transition to wandering state
        if (now >= ai.waitUntil) {
          // Set new random target
          pathfinding.targetPosition =
            this.pathfinder.findRandomWalkablePosition();
          pathfinding.needsPathUpdate = true;
          ai.state = "WANDERING";
        }
        break;

      case "WANDERING":
        // If we have a target but no path, or path needs update, calculate path
        if (pathfinding.targetPosition && pathfinding.needsPathUpdate) {
          // Update obstacles before finding path
          const obstacles = this.getObstacles(enemy);
          const walls = this.game
            .getCampManager()
            .getCamps()
            .flatMap((camp) => camp.walls);
          this.pathfinder.updateObstacles(obstacles, walls);

          // Find path to target
          pathfinding.path = this.pathfinder.findPath(
            position,
            pathfinding.targetPosition
          );
          pathfinding.currentPathIndex = 0;
          pathfinding.needsPathUpdate = false;
          pathfinding.lastPathUpdateTime = now;

          // If no path could be found, get a new random target
          if (pathfinding.path.length === 0) {
            pathfinding.targetPosition =
              this.pathfinder.findRandomWalkablePosition();
            pathfinding.needsPathUpdate = true;
          }
        }

        // Check if we've reached our destination
        if (
          pathfinding.targetPosition &&
          this.hasReachedPosition(enemy, pathfinding.targetPosition, 20)
        ) {
          // Transition to waiting state
          ai.state = "WAITING";
          ai.waitUntil = now + ai.waitTime;

          // Reset path data
          pathfinding.path = [];
          pathfinding.currentPathIndex = 0;
          pathfinding.targetPosition = null;
        }
        // Check if we need a path update due to being stuck
        else if (
          pathfinding.targetPosition &&
          now - pathfinding.lastPathUpdateTime > 5000
        ) {
          pathfinding.needsPathUpdate = true;
        }
        break;

      case "WAITING":
        // If wait time has passed, transition back to idle
        if (now >= ai.waitUntil) {
          ai.state = "IDLE";
          ai.waitUntil = now + ai.idleTime;
        }
        break;
    }
  }

  findRandomTarget(enemy: Entity): void {
    const pathfinding = assertValue(
      enemy.pathfinding,
      "Enemy must have pathfinding component"
    );

    const newTarget = this.findRandomWalkablePosition(enemy);
    if (newTarget) {
      pathfinding.targetPosition = newTarget;
    }
  }

  private findRandomWalkablePosition(enemy: Entity): Vector2D | null {
    const position = assertValue(enemy.position, "Enemy must have position");

    // Update pathfinding with latest obstacles
    const obstacles = this.getObstacles(enemy);
    const walls = this.game
      .getCampManager()
      .getCamps()
      .flatMap((camp) => camp.walls);
    this.pathfinder.updateObstacles(obstacles, walls);

    // Try to find a walkable position
    const attempts = 20;
    const maxRange = 500; // Maximum distance to search

    for (let i = 0; i < attempts; i++) {
      // Bias the search toward the enemy's camp if it has one
      let baseX = position.x;
      let baseY = position.y;

      if (enemy.campId) {
        // Try to stay within the camp if assigned to one
        const camp = this.game
          .getCampManager()
          .getCamps()
          .find((c) => c.id === enemy.campId);
        if (camp) {
          baseX = camp.position.x;
          baseY = camp.position.y;
        }
      }

      // Generate position with increasing range
      const range = Math.min(100 + i * 50, maxRange);
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * range;

      const x = baseX + Math.cos(angle) * distance;
      const y = baseY + Math.sin(angle) * distance;

      // Check if position is walkable
      const pos = { x, y };
      if (this.pathfinder.isPositionWalkable(pos)) {
        return pos;
      }
    }

    return null;
  }

  private hasReachedPosition(
    entity: Entity,
    position: Vector2D,
    threshold: number
  ): boolean {
    const entityPos = assertValue(entity.position, "Entity must have position");
    assert(threshold > 0, "Threshold must be positive", threshold);

    const dx = entityPos.x - position.x;
    const dy = entityPos.y - position.y;
    const distanceSquared = dx * dx + dy * dy;
    return distanceSquared <= threshold * threshold;
  }

  private getObstacles(
    currentEnemy: Entity
  ): Array<{ position: Vector2D; radius: number }> {
    const obstacles: Array<{ position: Vector2D; radius: number }> = [];

    // Add other enemies as obstacles
    const enemies = this.game.getEnemyManager().getEnemies();
    for (const enemy of enemies) {
      if (!enemy.isDead && enemy.id !== currentEnemy.id) {
        const position = assertValue(
          enemy.position,
          "Enemy must have position"
        );
        const radius = assertValue(enemy.radius, "Enemy must have radius");
        obstacles.push({
          position,
          radius,
        });
      }
    }

    // Add player as obstacle
    const player = this.game.getPlayer();
    if (player) {
      const position = assertValue(
        player.position,
        "Player must have position"
      );
      const radius = assertValue(player.radius, "Player must have radius");
      obstacles.push({
        position,
        radius,
      });
    }

    return obstacles;
  }

  renderDebug(ctx: CanvasRenderingContext2D, enemy: Entity): void {
    if (!this.debug || !enemy.ai || !enemy.pathfinding) return;

    const context = assertValue(ctx, "Context must be provided");
    const position = assertValue(enemy.position, "Enemy must have position");
    const radius = assertValue(enemy.radius, "Enemy must have radius");
    const ai = assertValue(enemy.ai, "Enemy must have AI component");
    const pathfinding = assertValue(
      enemy.pathfinding,
      "Enemy must have pathfinding component"
    );

    // Draw AI state indicator
    const stateColors = {
      IDLE: "rgba(0, 255, 0, 0.3)",
      WANDERING: "rgba(255, 255, 0, 0.3)",
      WAITING: "rgba(0, 0, 255, 0.3)",
    };

    context.beginPath();
    context.arc(position.x, position.y, radius + 5, 0, Math.PI * 2);
    context.fillStyle = stateColors[ai.state];
    context.fill();
    context.closePath();

    // Draw path if wandering
    if (ai.state === "WANDERING" && pathfinding.path.length > 0) {
      context.beginPath();
      context.moveTo(position.x, position.y);

      for (
        let i = pathfinding.currentPathIndex;
        i < pathfinding.path.length;
        i++
      ) {
        const point = pathfinding.path[i];
        context.lineTo(point.x, point.y);
      }

      context.strokeStyle = "rgba(255, 255, 0, 0.3)";
      context.lineWidth = 2;
      context.stroke();
      context.closePath();

      // Draw target
      if (pathfinding.targetPosition) {
        context.beginPath();
        context.arc(
          pathfinding.targetPosition.x,
          pathfinding.targetPosition.y,
          5,
          0,
          Math.PI * 2
        );
        context.fillStyle = "rgba(255, 0, 0, 0.5)";
        context.fill();
        context.closePath();
      }
    }
  }
}
