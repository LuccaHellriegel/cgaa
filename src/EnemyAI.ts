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
    this.debug = debug;
    this.pathfinder = new Pathfinding(game);
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
    const movement = assertValue(
      enemy.movement,
      "Enemy must have movement component"
    );

    // Check for wall collisions
    const collidesWithWalls = this.game
      .getCampManager()
      .entityCollidesWithWalls({
        x: position.x,
        y: position.y,
        radius: enemy.size,
      });

    // If we hit a wall, immediately try to find a new target away from the wall
    if (collidesWithWalls) {
      // Stop current movement
      movement.direction = { x: 0, y: 0 };

      // Force state to WANDERING to ensure we look for a new path
      ai.state = "WANDERING";

      // Try to find a new target away from the current position
      const newTarget = this.findRandomWalkablePosition(enemy, true); // true for wall escape mode
      if (newTarget) {
        pathfinding.targetPosition = newTarget;
        pathfinding.needsPathUpdate = true;
        pathfinding.path = [];
        pathfinding.currentPathIndex = 0;
      }

      // Skip the rest of the update to allow new path to be calculated next frame
      return;
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
        // No movement during idle state
        movement.direction = { x: 0, y: 0 };
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

        // Calculate movement based on path
        if (pathfinding.path.length > 0) {
          // If we've reached the current point or don't have a current point
          if (
            pathfinding.currentPathIndex >= pathfinding.path.length ||
            (pathfinding.currentPathIndex < pathfinding.path.length &&
              this.hasReachedPosition(
                enemy,
                pathfinding.path[pathfinding.currentPathIndex],
                5
              ))
          ) {
            // Move to next point if available
            pathfinding.currentPathIndex++;

            // If we've reached the end of the path
            if (pathfinding.currentPathIndex >= pathfinding.path.length) {
              // If we haven't reached the final target yet, update path
              if (
                pathfinding.targetPosition &&
                !this.hasReachedPosition(enemy, pathfinding.targetPosition, 20)
              ) {
                pathfinding.needsPathUpdate = true;
                // Keep moving towards target while path updates
                const dx = pathfinding.targetPosition.x - position.x;
                const dy = pathfinding.targetPosition.y - position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                movement.direction =
                  distance > 0
                    ? { x: dx / distance, y: dy / distance }
                    : { x: 0, y: 0 };
              } else {
                // We've reached the target
                movement.direction = { x: 0, y: 0 };
                // Transition to waiting state
                ai.state = "WAITING";
                ai.waitUntil = now + ai.waitTime;
                // Reset path data
                pathfinding.path = [];
                pathfinding.currentPathIndex = 0;
                pathfinding.targetPosition = null;
              }
            }
          }

          // If we have a current path point to move to
          if (pathfinding.currentPathIndex < pathfinding.path.length) {
            const targetPoint = pathfinding.path[pathfinding.currentPathIndex];
            const dx = targetPoint.x - position.x;
            const dy = targetPoint.y - position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            movement.direction =
              distance > 0
                ? { x: dx / distance, y: dy / distance }
                : { x: 0, y: 0 };
          }
        } else {
          // No path available, stop moving
          movement.direction = { x: 0, y: 0 };
        }

        // Check if we need a path update due to being stuck
        if (
          pathfinding.targetPosition &&
          now - pathfinding.lastPathUpdateTime > 5000
        ) {
          pathfinding.needsPathUpdate = true;
        }
        break;

      case "WAITING":
        // No movement during waiting
        movement.direction = { x: 0, y: 0 };

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

  private findRandomWalkablePosition(
    enemy: Entity,
    isWallEscape: boolean = false
  ): Vector2D | null {
    const position = assertValue(enemy.position, "Enemy must have position");

    // Update pathfinding with latest obstacles
    const obstacles = this.getObstacles(enemy);
    const walls = this.game
      .getCampManager()
      .getCamps()
      .flatMap((camp) => camp.walls);
    this.pathfinder.updateObstacles(obstacles, walls);

    // Try to find a walkable position
    const attempts = isWallEscape ? 50 : 20; // More attempts when escaping walls
    const maxRange = isWallEscape ? 200 : 500; // Shorter range when escaping walls to find closer valid positions

    for (let i = 0; i < attempts; i++) {
      // Bias the search toward the enemy's camp if it has one and not escaping walls
      let baseX = position.x;
      let baseY = position.y;

      if (!isWallEscape && enemy.campId) {
        const camp = this.game
          .getCampManager()
          .getCamps()
          .find((c) => c.id === enemy.campId);
        if (camp) {
          baseX = camp.position.x;
          baseY = camp.position.y;
        }
      }

      // When escaping walls, try to move away from current position
      let range: number;
      if (isWallEscape) {
        // Start with a minimum range to ensure we move away from the wall
        range = Math.max(50, Math.min(50 + i * 10, maxRange));
      } else {
        range = Math.min(100 + i * 50, maxRange);
      }

      const angle = Math.random() * Math.PI * 2;
      const distance = isWallEscape ? range : Math.random() * range; // Use full range when escaping

      const x = baseX + Math.cos(angle) * distance;
      const y = baseY + Math.sin(angle) * distance;

      // Ensure position is within world bounds with padding
      const padding = enemy.size * 2;
      const boundedX = Math.max(
        padding,
        Math.min(this.game.WORLD_WIDTH - padding, x)
      );
      const boundedY = Math.max(
        padding,
        Math.min(this.game.WORLD_HEIGHT - padding, y)
      );

      // Check if position is walkable
      const pos = {
        x: boundedX,
        y: boundedY,
      };

      if (this.pathfinder.isWalkable(pos)) {
        // Double check that this position isn't too close to walls
        if (
          !this.game.getCampManager().entityCollidesWithWalls({
            x: boundedX,
            y: boundedY,
            radius: enemy.size + 5, // Add a small buffer
          })
        ) {
          return pos;
        }
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

    // During initialization, only consider the player as an obstacle
    // This avoids the circular dependency during EnemyManager initialization
    const player = this.game.getPlayer();
    if (player) {
      const position = assertValue(
        player.position,
        "Player must have position"
      );
      const radius = assertValue(player.size, "Player must have radius");
      obstacles.push({
        position,
        radius,
      });
    }

    // Only check other enemies if we're not in initialization
    try {
      const enemies = this.game.getEnemyManager().getEnemies();
      for (const enemy of enemies) {
        if (!enemy.isDead && enemy.id !== currentEnemy.id) {
          const position = assertValue(
            enemy.position,
            "Enemy must have position"
          );
          const radius = assertValue(enemy.size, "Enemy must have radius");
          obstacles.push({
            position,
            radius,
          });
        }
      }
    } catch (e) {
      // During initialization, EnemyManager won't be available yet
      // That's fine, we'll just use player as obstacle for initial positioning
    }

    return obstacles;
  }

  renderDebug(ctx: CanvasRenderingContext2D, enemy: Entity): void {
    if (!this.debug || !enemy.ai || !enemy.pathfinding) return;

    const context = assertValue(ctx, "Context must be provided");
    const position = assertValue(enemy.position, "Enemy must have position");
    const radius = assertValue(enemy.size, "Enemy must have radius");
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
