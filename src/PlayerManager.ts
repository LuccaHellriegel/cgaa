import { Entity } from "./Entity";
import { Game } from "./Game";
import { Vector2D } from "./types";
import { assert, assertValue, assertRange } from "./utils/assert";
import { ChainWeapon } from "./ChainWeapon";

export class PlayerManager {
  private players: Entity[];
  private game: Game; // Reference to main game instance
  private static entityIdCounter: number = 0; // Counter for entity IDs
  private keys: { [key: string]: boolean } = {};
  private mouseX: number = 0;
  private mouseY: number = 0;
  private lastClickTime: number = 0;
  private readonly clickCooldown: number = 200;

  constructor(game: Game) {
    this.game = assertValue(game, "Game instance must be provided");
    this.players = [];
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    window.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
    });

    this.game.canvas.addEventListener("mousemove", (e) => {
      const rect = this.game.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });

    this.game.canvas.addEventListener("mousedown", () => {
      const now = Date.now();
      if (now - this.lastClickTime < this.clickCooldown) return;
      this.lastClickTime = now;

      const player = this.getActivePlayer();
      if (!player) return;

      const angle = Math.atan2(
        this.mouseY - player.position.y,
        this.mouseX - player.position.x
      );

      const combat = assertValue(
        player.combat,
        "Player must have combat component"
      );
      if (!combat.weapon) return;

      if (combat.weapon.getState() === "IDLE") {
        combat.weapon.fire(player.position.x, player.position.y, angle);
      } else if (
        combat.weapon.getState() === "EXTENDING" ||
        combat.weapon.getState() === "EXTENDED"
      ) {
        combat.weapon.forceRetract();
      }
    });
  }

  createPlayer(position: Vector2D): Entity {
    const validPosition = assertValue(position, "Position must be provided");
    assert(
      validPosition.x >= 0 && validPosition.y >= 0,
      "Position must be non-negative",
      validPosition
    );

    const player: Entity = {
      id: this.generateEntityId(),
      isDead: false,
      position: validPosition,
      radius: 20,
      movement: {
        speed: 0.3,
        direction: { x: 0, y: 0 },
        turnSpeed: 0.1,
      },
      health: {
        current: 200,
        max: 200,
        invulnerableUntil: 0,
      },
      combat: {
        weapon: new ChainWeapon(validPosition.x, validPosition.y, 15),
        detectionRange: 200,
        attackCooldown: 200,
        lastAttackTime: 0,
      },
      render: {
        color: "#3498db",
        targetAngle: 0,
      },
    };

    this.players.push(player);
    return player;
  }

  update(deltaTime: number): void {
    const validDelta = assertRange(
      deltaTime,
      0,
      50,
      "Delta time must be positive and not too large"
    );

    for (const player of this.players) {
      if (player.isDead) continue;

      this.handleInput(player);
      this.updateMovement(player, validDelta);
      this.updateCombat(player, validDelta);
      this.checkCollisions(player);
    }
  }

  private handleInput(player: Entity): void {
    const movement = player.movement;
    const render = player.render;

    // Reset direction
    movement.direction.x = 0;
    movement.direction.y = 0;

    // Update direction based on keys
    if (this.keys["w"] || this.keys["ArrowUp"]) movement.direction.y = -1;
    if (this.keys["s"] || this.keys["ArrowDown"]) movement.direction.y = 1;
    if (this.keys["a"] || this.keys["ArrowLeft"]) movement.direction.x = -1;
    if (this.keys["d"] || this.keys["ArrowRight"]) movement.direction.x = 1;

    // Normalize diagonal movement
    const length = Math.sqrt(
      movement.direction.x * movement.direction.x +
        movement.direction.y * movement.direction.y
    );
    if (length > 0) {
      movement.direction.x /= length;
      movement.direction.y /= length;
    }

    // Update player angle based on mouse position
    if (length > 0) {
      render.targetAngle = Math.atan2(
        movement.direction.y,
        movement.direction.x
      );
    }
  }

  private updateMovement(player: Entity, deltaTime: number): void {
    const movement = player.movement;

    // Update position
    player.position.x += movement.direction.x * movement.speed * deltaTime;
    player.position.y += movement.direction.y * movement.speed * deltaTime;

    // Keep player within canvas bounds
    player.position.x = assertRange(
      player.position.x,
      player.radius,
      this.game.canvas.width - player.radius,
      "Player X position out of bounds"
    );

    player.position.y = assertRange(
      player.position.y,
      player.radius,
      this.game.canvas.height - player.radius,
      "Player Y position out of bounds"
    );
  }

  private updateCombat(player: Entity, _deltaTime: number): void {
    const combat = player.combat;

    // Update weapon position
    if (combat.weapon) {
      combat.weapon.update(player.position.x, player.position.y);
    }
  }

  private checkCollisions(player: Entity): void {
    const combat = player.combat;

    // Check if player's weapon hits enemies
    if (combat.weapon && combat.weapon.getState() === "EXTENDED") {
      const enemies = this.game.getEnemies();
      const hitEnemyIndices = combat.weapon.checkCollisions(enemies);

      for (const index of hitEnemyIndices) {
        const enemy = enemies[index];
        if (!enemy) continue;

        const enemyHealth = enemy.health;
        enemyHealth.current = Math.max(0, enemyHealth.current - 20);

        // Create hit effect when enemy is damaged
        this.game.effects.createHitEffect(
          enemy.position.x,
          enemy.position.y,
          enemy.render.color
        );

        if (enemyHealth.current <= 0) {
          enemy.isDead = true;
          // Create death effect with more particles
          for (let i = 0; i < 3; i++) {
            this.game.effects.createHitEffect(
              enemy.position.x,
              enemy.position.y,
              enemy.render.color
            );
          }
        }
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const context = assertValue(ctx, "Context must be provided");

    for (const player of this.players) {
      if (player.isDead) continue;

      const render = player.render;
      const combat = player.combat;

      // Draw player
      context.beginPath();
      context.arc(
        player.position.x,
        player.position.y,
        player.radius,
        0,
        Math.PI * 2
      );
      context.fillStyle = render.color;
      context.fill();
      context.closePath();

      // Render weapon
      if (combat.weapon) {
        context.save();
        combat.weapon.render(context);
        context.restore();
      }

      // Render health bar
      this.renderHealthBar(context, player);
    }
  }

  private renderHealthBar(ctx: CanvasRenderingContext2D, player: Entity): void {
    const health = player.health;
    const healthBarWidth = 40;
    const healthBarHeight = 4;
    const healthPercentage = health.current / health.max;

    ctx.fillStyle = "#ff0000";
    ctx.fillRect(
      player.position.x - healthBarWidth / 2,
      player.position.y - player.radius - 10,
      healthBarWidth,
      healthBarHeight
    );

    ctx.fillStyle = "#00ff00";
    ctx.fillRect(
      player.position.x - healthBarWidth / 2,
      player.position.y - player.radius - 10,
      healthBarWidth * healthPercentage,
      healthBarHeight
    );
  }

  private generateEntityId(): number {
    // Use static counter for unique IDs
    return ++PlayerManager.entityIdCounter;
  }

  getPlayers(): Entity[] {
    return this.players;
  }

  getActivePlayer(): Entity | null {
    return this.players.find((player) => !player.isDead) || null;
  }
}
