import { Entity } from "./Entity";
import { Game } from "./Game";
import { Vector2D } from "./types";
import { assert, assertValue, assertRange } from "./utils/assert";
import { ChainWeapon } from "./ChainWeapon";
import { EnemyAI } from "./EnemyAI";

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
  private ai: EnemyAI;
  private debug: boolean;

  constructor(game: Game, debug: boolean = false) {
    this.game = assertValue(game, "Game instance must be provided");
    this.enemies = [];
    this.debug = debug;
    this.ai = new EnemyAI(game, debug);
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
    let attempts = 0;
    const maxAttempts = 50;

    do {
      validPosition = true;
      x = Math.random() * (this.game.WORLD_WIDTH - 60) + 30;
      y = Math.random() * (this.game.WORLD_HEIGHT - 60) + 30;

      // Check for wall collisions
      if (
        this.game.getCampManager().entityCollidesWithWalls({ x, y, radius: 20 })
      ) {
        validPosition = false;
        attempts++;
        continue;
      }

      if (player) {
        const dx = x - player.position.x;
        const dy = y - player.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          validPosition = false;
          attempts++;
        }
      }
    } while (!validPosition && attempts < maxAttempts);

    // If no valid position found after max attempts, try corners
    if (!validPosition) {
      const corners = [
        { x: 100, y: 100 },
        { x: this.game.WORLD_WIDTH - 100, y: 100 },
        { x: 100, y: this.game.WORLD_HEIGHT - 100 },
        { x: this.game.WORLD_WIDTH - 100, y: this.game.WORLD_HEIGHT - 100 },
      ];

      for (const corner of corners) {
        if (
          !this.game.getCampManager().entityCollidesWithWalls({
            x: corner.x,
            y: corner.y,
            radius: 20,
          })
        ) {
          x = corner.x;
          y = corner.y;
          validPosition = true;
          break;
        }
      }
    }

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

    // Check if position is within a camp
    enemy.campId = undefined; // Reset camp assignment
    const camps = this.game.getCampManager().getCamps();
    for (const camp of camps) {
      const dx = position.x - camp.position.x;
      const dy = position.y - camp.position.y;
      if (dx * dx + dy * dy <= camp.radius * camp.radius) {
        enemy.campId = camp.id;
        break;
      }
    }

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

    // Reset or initialize AI state machine - start in WANDERING state
    if (enemy.ai) {
      enemy.ai.state = "WANDERING"; // Start wandering immediately
      enemy.ai.waitUntil = Date.now();
      enemy.ai.idleTime = 1000 + Math.random() * 2000;
      enemy.ai.waitTime = 2000 + Math.random() * 3000;
    } else {
      enemy.ai = {
        state: "WANDERING", // Start wandering immediately
        waitUntil: Date.now(),
        idleTime: 1000 + Math.random() * 2000,
        waitTime: 2000 + Math.random() * 3000,
      };
    }

    // Find an initial target for the enemy to move towards
    this.ai.findRandomTarget(enemy);
  }

  private createEnemy(position: Vector2D, radius: number = 20): Entity {
    const validPosition = assertValue(position, "Position must be provided");
    assert(
      validPosition.x >= 0 && validPosition.y >= 0,
      "Position must be non-negative",
      validPosition
    );

    // Check if position is within a camp
    let campId: number | undefined;
    const camps = this.game.getCampManager().getCamps();
    for (const camp of camps) {
      const dx = position.x - camp.position.x;
      const dy = position.y - camp.position.y;
      if (dx * dx + dy * dy <= camp.radius * camp.radius) {
        campId = camp.id;
        break;
      }
    }

    const enemyColor = `hsl(${Math.random() * 60 + 340}, 80%, 60%)`;
    const enemy: Entity = {
      id: this.generateEntityId(),
      isDead: false,
      campId: campId,
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
      pathfinding: {
        path: [],
        currentPathIndex: 0,
        targetPosition: null,
        needsPathUpdate: true,
        lastPathUpdateTime: 0,
      },
      ai: {
        state: "IDLE",
        waitUntil: Date.now(),
        idleTime: 1000 + Math.random() * 2000,
        waitTime: 2000 + Math.random() * 3000,
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

      // Store current position for collision check
      const oldX = enemy.position.x;
      const oldY = enemy.position.y;

      // Update AI and get new position
      this.ai.updateAI(enemy);

      // Check wall collisions for X and Y movements separately
      const newX = enemy.position.x;
      const newY = enemy.position.y;

      // Reset position temporarily to check X movement
      enemy.position.x = oldX;
      enemy.position.y = oldY;

      // Try X movement
      const canMoveX = !this.game.getCampManager().entityCollidesWithWalls({
        x: newX,
        y: oldY,
        radius: enemy.radius,
      });

      // Try Y movement
      const canMoveY = !this.game.getCampManager().entityCollidesWithWalls({
        x: oldX,
        y: newY,
        radius: enemy.radius,
      });

      // Apply allowed movements
      if (canMoveX) {
        enemy.position.x = newX;
      }
      if (canMoveY) {
        enemy.position.y = newY;
      }

      // If movement was blocked, request a new path
      if (!canMoveX || !canMoveY) {
        if (enemy.pathfinding) {
          enemy.pathfinding.needsPathUpdate = true;
        }
      }

      // Update combat and check collisions
      this.updateCombat(enemy, validDelta);
      this.checkCollisions(enemy);
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
    if (
      combat.weapon &&
      (combat.weapon.getState() === "EXTENDED" ||
        combat.weapon.getState() === "EXTENDING")
    ) {
      const player = this.game.getPlayer();
      if (!player || player.isDead) return;

      if (combat.weapon.checkCollisionWithEntity(player)) {
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

        // Debug visualization is now handled by EnemyAI
        if (this.debug) {
          this.ai.renderDebug(context, enemy);
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
}
