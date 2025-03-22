import { Entity } from "./Entity";
import { Game } from "./Game";
import { Vector2D } from "./types";
import { assert, assertValue, assertRange } from "./utils/assert";
import { ChainWeapon } from "./ChainWeapon";
import { Pathfinding } from "./Pathfinding";

function createEnemyWeapon(
  startX: number,
  startY: number,
  linkCount = 10
): ChainWeapon {
  const weapon = new ChainWeapon(startX, startY, linkCount);
  // Override the retract speed to be slower
  weapon.retractSpeed = 10; // Reduced from 25 to 10
  return weapon;
}

export class EnemyManager {
  private enemies: Entity[];
  private game: Game;
  private static entityIdCounter: number = 0; // Counter for entity IDs
  private readonly ENEMY_COUNT = 15;
  private readonly POOL_SIZE = 30; // Maximum number of entities to keep in pool
  private pathfinder: Pathfinding;
  private debug: boolean;

  constructor(game: Game, debug: boolean = false) {
    this.game = assertValue(game, "Game instance must be provided");
    this.enemies = [];
    this.pathfinder = new Pathfinding(game.WORLD_WIDTH, game.WORLD_HEIGHT, 30);
    this.debug = debug;
    this.initializePool();
  }

  private initializePool(): void {
    // Pre-create a pool of enemies
    for (let i = 0; i < this.POOL_SIZE; i++) {
      const enemy = this.createEnemy(
        { x: 0, y: 0 }, // Initial position doesn't matter as it will be set on spawn
        20 // Default radius
      );
      enemy.isDead = true; // Mark as dead initially
      this.enemies.push(enemy);
    }
  }

  generateEnemies(): void {
    for (let i = 0; i < this.ENEMY_COUNT; i++) {
      this.spawnNewEnemy();
    }
  }

  spawnNewEnemy(): Entity {
    let x: number, y: number;
    let validPosition: boolean;
    const player = this.game.getPlayer();

    do {
      validPosition = true;
      x = Math.random() * (this.game.WORLD_WIDTH - 60) + 30;
      y = Math.random() * (this.game.WORLD_HEIGHT - 60) + 30;

      if (player) {
        const dx = x - player.position.x;
        const dy = y - player.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          validPosition = false;
        }
      }
    } while (!validPosition);

    const radius = Math.random() * 10 + 15;
    const position = { x, y };

    // Find a dead enemy in the pool
    const deadEnemy = this.findDeadEnemy();
    if (deadEnemy) {
      this.reviveEnemy(deadEnemy, position, radius);
      return deadEnemy;
    }

    // If pool is full, find the oldest dead enemy
    const oldestDeadEnemy = this.findOldestDeadEnemy();
    if (oldestDeadEnemy) {
      this.reviveEnemy(oldestDeadEnemy, position, radius);
      return oldestDeadEnemy;
    }

    // If pool isn't at max size yet, create a new enemy
    if (this.enemies.length < this.POOL_SIZE) {
      return this.createEnemy(position, radius);
    }

    // If we get here, reuse the first dead enemy
    const fallbackEnemy = this.enemies[0];
    this.reviveEnemy(fallbackEnemy, position, radius);
    return fallbackEnemy;
  }

  private findDeadEnemy(): Entity | undefined {
    return this.enemies.find((enemy) => enemy.isDead);
  }

  private findOldestDeadEnemy(): Entity | undefined {
    // Find the dead enemy with the lowest ID (oldest)
    return this.enemies
      .filter((enemy) => enemy.isDead)
      .sort((a, b) => a.id - b.id)[0];
  }

  private reviveEnemy(enemy: Entity, position: Vector2D, radius: number): void {
    // Reset entity state
    enemy.isDead = false;
    enemy.position = position;
    enemy.radius = radius;

    // Reset health
    enemy.health.current = enemy.health.max;
    enemy.health.invulnerableUntil = 0;

    // Reset combat component
    enemy.combat.lastAttackTime = 0;
    enemy.combat.weapon = createEnemyWeapon(position.x, position.y, 10);

    // Reset render component
    enemy.render.color = `hsl(${Math.random() * 60 + 340}, 80%, 60%)`;
    enemy.render.targetAngle = 0;

    // Reset movement component
    enemy.movement.direction = { x: 0, y: 0 };

    // Reset or initialize pathfinding component
    if (enemy.pathfinding) {
      enemy.pathfinding.path = [];
      enemy.pathfinding.currentPathIndex = 0;
      enemy.pathfinding.targetPosition = null;
      enemy.pathfinding.needsPathUpdate = true;
      enemy.pathfinding.lastPathUpdateTime = 0;
    } else {
      enemy.pathfinding = {
        path: [],
        currentPathIndex: 0,
        targetPosition: null,
        needsPathUpdate: true,
        lastPathUpdateTime: 0,
      };
    }

    // Reset or initialize AI state machine
    if (enemy.ai) {
      enemy.ai.state = "IDLE";
      enemy.ai.waitUntil = Date.now();
      enemy.ai.idleTime = 1000 + Math.random() * 2000; // 1-3 seconds
      enemy.ai.waitTime = 2000 + Math.random() * 3000; // 2-5 seconds
    } else {
      enemy.ai = {
        state: "IDLE",
        waitUntil: Date.now(),
        idleTime: 1000 + Math.random() * 2000,
        waitTime: 2000 + Math.random() * 3000,
      };
    }
  }

  private createEnemy(position: Vector2D, radius: number = 20): Entity {
    const validPosition = assertValue(position, "Position must be provided");
    assert(
      validPosition.x >= 0 && validPosition.y >= 0,
      "Position must be non-negative",
      validPosition
    );

    const enemyColor = `hsl(${Math.random() * 60 + 340}, 80%, 60%)`;
    const enemy: Entity = {
      id: this.generateEntityId(),
      isDead: false,
      position: validPosition,
      radius: radius,
      movement: {
        speed: 0.1,
        direction: { x: 0, y: 0 },
        turnSpeed: 0.1,
      },
      health: {
        current: 50,
        max: 50,
        invulnerableUntil: 0,
      },
      combat: {
        weapon: createEnemyWeapon(validPosition.x, validPosition.y, 10),
        detectionRange: 200,
        attackCooldown: 2000,
        lastAttackTime: 0,
      },
      render: {
        color: enemyColor,
        targetAngle: 0,
      },
      // Add pathfinding component
      pathfinding: {
        path: [],
        currentPathIndex: 0,
        targetPosition: null,
        needsPathUpdate: true,
        lastPathUpdateTime: 0,
      },
      // Add AI state machine
      ai: {
        state: "IDLE",
        waitUntil: Date.now(),
        idleTime: 1000 + Math.random() * 2000, // 1-3 seconds
        waitTime: 2000 + Math.random() * 3000, // 2-5 seconds
      },
    };

    this.enemies.push(enemy);
    return enemy;
  }

  update(deltaTime: number): void {
    const validDelta = assertRange(
      deltaTime,
      0,
      Infinity,
      "Delta time must be positive"
    );

    for (const enemy of this.enemies) {
      if (enemy.isDead) continue;

      // Only update enemies near the camera view
      if (this.isEnemyNearCamera(enemy)) {
        this.updateMovement(enemy, validDelta);
        this.updateCombat(enemy, validDelta);
        this.checkCollisions(enemy);
        this.updateAI(enemy);
      }
    }

    // Spawn new enemies if below threshold
    if (this.getActiveEnemies().length < this.ENEMY_COUNT / 2) {
      this.spawnNewEnemy();
    }
  }

  private isEnemyNearCamera(enemy: Entity): boolean {
    const bufferDistance = 300; // Distance beyond viewport to start updating
    const camera = this.game.camera;

    return (
      enemy.position.x + enemy.radius + bufferDistance >= camera.position.x &&
      enemy.position.x - enemy.radius - bufferDistance <=
        camera.position.x + camera.viewportWidth &&
      enemy.position.y + enemy.radius + bufferDistance >= camera.position.y &&
      enemy.position.y - enemy.radius - bufferDistance <=
        camera.position.y + camera.viewportHeight
    );
  }

  private updateMovement(enemy: Entity, deltaTime: number): void {
    if (!enemy.ai || !enemy.pathfinding) {
      // Fall back to original behavior if no AI/pathfinding
      this.updateDirectMovement(enemy, deltaTime);
      return;
    }

    const ai = enemy.ai;
    const movement = enemy.movement;
    const render = enemy.render;
    const pathfinding = enemy.pathfinding;

    // Only move if in wandering state
    if (ai.state !== "WANDERING") {
      movement.direction.x = 0;
      movement.direction.y = 0;
      return;
    }

    // If no path or at end of path, stop moving
    if (
      pathfinding.path.length === 0 ||
      pathfinding.currentPathIndex >= pathfinding.path.length
    ) {
      movement.direction.x = 0;
      movement.direction.y = 0;
      return;
    }

    // Get current waypoint
    const waypoint = pathfinding.path[pathfinding.currentPathIndex];

    // Calculate direction to waypoint
    const dx = waypoint.x - enemy.position.x;
    const dy = waypoint.y - enemy.position.y;
    const distanceToWaypoint = Math.sqrt(dx * dx + dy * dy);

    // Calculate angle to waypoint
    const angleToWaypoint = Math.atan2(dy, dx);

    // Smoothly rotate towards waypoint
    let angleDiff = angleToWaypoint - render.targetAngle;
    // Normalize angle difference to [-PI, PI]
    if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    render.targetAngle +=
      Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), movement.turnSpeed);

    // Move towards waypoint
    if (distanceToWaypoint > 5) {
      movement.direction.x = Math.cos(render.targetAngle);
      movement.direction.y = Math.sin(render.targetAngle);

      // Apply movement
      enemy.position.x += movement.direction.x * movement.speed * deltaTime;
      enemy.position.y += movement.direction.y * movement.speed * deltaTime;

      // Keep enemy within world bounds
      enemy.position.x = assertRange(
        enemy.position.x,
        enemy.radius,
        this.game.WORLD_WIDTH - enemy.radius,
        "Enemy X position out of bounds"
      );

      enemy.position.y = assertRange(
        enemy.position.y,
        enemy.radius,
        this.game.WORLD_HEIGHT - enemy.radius,
        "Enemy Y position out of bounds"
      );
    } else {
      // Reached current waypoint, move to next one
      pathfinding.currentPathIndex++;
    }
  }

  // Keep the original movement logic as a fallback method
  private updateDirectMovement(enemy: Entity, deltaTime: number): void {
    const movement = enemy.movement;
    const render = enemy.render;
    const combat = enemy.combat;

    // Get player position
    const player = this.game.getPlayer();
    if (!player) return;

    // Calculate direction to player
    const dx = player.position.x - enemy.position.x;
    const dy = player.position.y - enemy.position.y;
    const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);

    // Calculate angle to player
    const angleToPlayer = Math.atan2(dy, dx);

    // Smoothly rotate towards player
    let angleDiff = angleToPlayer - render.targetAngle;
    // Normalize angle difference to [-PI, PI]
    if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    render.targetAngle +=
      Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), movement.turnSpeed);

    // Move towards player if in range
    if (distanceToPlayer < combat.detectionRange) {
      movement.direction.x = Math.cos(render.targetAngle);
      movement.direction.y = Math.sin(render.targetAngle);

      enemy.position.x += movement.direction.x * movement.speed * deltaTime;
      enemy.position.y += movement.direction.y * movement.speed * deltaTime;

      // Keep enemy within world bounds
      enemy.position.x = assertRange(
        enemy.position.x,
        enemy.radius,
        this.game.WORLD_WIDTH - enemy.radius,
        "Enemy X position out of bounds"
      );

      enemy.position.y = assertRange(
        enemy.position.y,
        enemy.radius,
        this.game.WORLD_HEIGHT - enemy.radius,
        "Enemy Y position out of bounds"
      );
    }
  }

  private updateCombat(enemy: Entity, _deltaTime: number): void {
    const combat = enemy.combat;
    const health = enemy.health;

    // Update invulnerability
    if (health.invulnerableUntil > Date.now()) {
      return;
    }

    // Update weapon position to match enemy position
    if (combat.weapon) {
      // Always update weapon position first
      combat.weapon.update(enemy.position.x, enemy.position.y);

      // Attack if cooldown is over
      const now = Date.now();
      if (now - combat.lastAttackTime > combat.attackCooldown) {
        const player = this.game.getPlayer();
        if (player) {
          const dx = player.position.x - enemy.position.x;
          const dy = player.position.y - enemy.position.y;
          const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);

          if (distanceToPlayer < combat.detectionRange) {
            const angleToPlayer = Math.atan2(dy, dx);
            // Fire from current position
            combat.weapon.fire(
              enemy.position.x,
              enemy.position.y,
              angleToPlayer
            );
            combat.lastAttackTime = now;
          }
        }
      }
    }
  }

  private checkCollisions(enemy: Entity): void {
    const combat = enemy.combat;

    // Check if enemy's weapon hits player
    if (combat.weapon && combat.weapon.getState() === "EXTENDED") {
      const hitbox = combat.weapon.getHitbox();
      if (hitbox) {
        const player = this.game.getPlayer();
        if (!player || player.isDead) return;

        const dx = hitbox.x - player.position.x;
        const dy = hitbox.y - player.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < player.radius + hitbox.radius) {
          // Damage player through entity health component
          const playerHealth = player.health;
          playerHealth.current = Math.max(0, playerHealth.current - 5);
          playerHealth.invulnerableUntil = Date.now() + 2000;

          if (playerHealth.current <= 0) {
            player.isDead = true;
          }
        }
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const context = assertValue(ctx, "Context must be provided");

    for (const enemy of this.enemies) {
      if (enemy.isDead) continue;

      // Only render if visible in camera
      if (this.game.camera.isEntityVisible(enemy)) {
        const renderComponent = assertValue(
          enemy.render,
          "Enemy must have render component"
        );
        const combat = assertValue(
          enemy.combat,
          "Enemy must have combat component"
        );

        // Draw enemy body
        context.beginPath();
        context.arc(
          enemy.position.x,
          enemy.position.y,
          enemy.radius,
          0,
          Math.PI * 2
        );
        context.fillStyle = renderComponent.color;
        context.fill();
        context.closePath();

        // Draw enemy weapon
        if (combat.weapon) {
          combat.weapon.render(context);
        }

        // Render health bar
        if (enemy.health) {
          this.renderHealthBar(context, enemy);
        }

        // Visualize AI state and path if debug mode is enabled
        if (this.debug && enemy.ai && enemy.pathfinding) {
          // Draw AI state indicator
          const stateColors = {
            IDLE: "rgba(0, 255, 0, 0.3)",
            WANDERING: "rgba(255, 255, 0, 0.3)",
            WAITING: "rgba(0, 0, 255, 0.3)",
          };

          context.beginPath();
          context.arc(
            enemy.position.x,
            enemy.position.y,
            enemy.radius + 5,
            0,
            Math.PI * 2
          );
          context.fillStyle = stateColors[enemy.ai.state];
          context.fill();
          context.closePath();

          // Draw path if wandering
          if (
            enemy.ai.state === "WANDERING" &&
            enemy.pathfinding.path.length > 0
          ) {
            context.beginPath();
            context.moveTo(enemy.position.x, enemy.position.y);

            for (
              let i = enemy.pathfinding.currentPathIndex;
              i < enemy.pathfinding.path.length;
              i++
            ) {
              const point = enemy.pathfinding.path[i];
              context.lineTo(point.x, point.y);
            }

            context.strokeStyle = "rgba(255, 255, 0, 0.3)";
            context.lineWidth = 2;
            context.stroke();
            context.closePath();

            // Draw target
            if (enemy.pathfinding.targetPosition) {
              context.beginPath();
              context.arc(
                enemy.pathfinding.targetPosition.x,
                enemy.pathfinding.targetPosition.y,
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
    }
  }

  private renderHealthBar(ctx: CanvasRenderingContext2D, enemy: Entity): void {
    const health = assertValue(
      enemy.health,
      "Enemy must have health component"
    );

    const healthBarWidth = 40;
    const healthBarHeight = 4;
    const healthPercentage = assertRange(
      health.current / health.max,
      0,
      1,
      "Health percentage must be between 0 and 1"
    );

    ctx.fillStyle = "#ff0000";
    ctx.fillRect(
      enemy.position.x - healthBarWidth / 2,
      enemy.position.y - enemy.radius - 10,
      healthBarWidth,
      healthBarHeight
    );

    ctx.fillStyle = "#00ff00";
    ctx.fillRect(
      enemy.position.x - healthBarWidth / 2,
      enemy.position.y - enemy.radius - 10,
      healthBarWidth * healthPercentage,
      healthBarHeight
    );
  }

  private generateEntityId(): number {
    // Use static counter for unique IDs
    return ++EnemyManager.entityIdCounter;
  }

  getEnemies(): Entity[] {
    return this.enemies;
  }

  getActiveEnemies(): Entity[] {
    return this.enemies.filter((enemy) => !enemy.isDead);
  }

  removeEnemy(index: number): void {
    if (index >= 0 && index < this.enemies.length) {
      const enemy = this.enemies[index];
      if (enemy) {
        // Mark as dead and reset state for reuse
        enemy.isDead = true;
        enemy.health.current = 0;
        enemy.combat.weapon = null;
        enemy.movement.direction = { x: 0, y: 0 };
      }
    }
  }

  private updateAI(enemy: Entity): void {
    // Skip if entity doesn't have AI or pathfinding components
    if (!enemy.ai || !enemy.pathfinding) return;

    const now = Date.now();
    const ai = enemy.ai;
    const pathfinding = enemy.pathfinding;

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
          this.pathfinder.updateObstacles(obstacles);

          // Find path to target
          pathfinding.path = this.pathfinder.findPath(
            enemy.position,
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

  // Helper to get all obstacles (other entities)
  private getObstacles(
    currentEnemy: Entity
  ): Array<{ position: Vector2D; radius: number }> {
    return this.enemies
      .filter((enemy) => !enemy.isDead && enemy !== currentEnemy)
      .map((enemy) => ({
        position: enemy.position,
        radius: enemy.radius,
      }));
  }

  // Helper to check if entity has reached position
  private hasReachedPosition(
    entity: Entity,
    position: Vector2D,
    threshold: number
  ): boolean {
    const dx = entity.position.x - position.x;
    const dy = entity.position.y - position.y;
    const distanceSquared = dx * dx + dy * dy;
    return distanceSquared <= threshold * threshold;
  }
}
