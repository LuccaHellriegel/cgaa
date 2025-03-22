import { Entity } from "./Entity";
import { Game } from "./Game";
import { Vector2D } from "./types";
import { assert, assertValue } from "./utils/assert";
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
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      // Convert screen coordinates to world coordinates
      const worldPos = this.game.camera.screenToWorld({
        x: screenX,
        y: screenY,
      });
      this.mouseX = worldPos.x;
      this.mouseY = worldPos.y;
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
    const player = this.getActivePlayer();

    // Handle movement input
    const movement = assertValue(
      player.movement,
      "Player must have movement component"
    );
    const direction = { x: 0, y: 0 };

    if (this.keys["w"] || this.keys["ArrowUp"]) direction.y -= 1;
    if (this.keys["s"] || this.keys["ArrowDown"]) direction.y += 1;
    if (this.keys["a"] || this.keys["ArrowLeft"]) direction.x -= 1;
    if (this.keys["d"] || this.keys["ArrowRight"]) direction.x += 1;

    // Normalize direction if moving diagonally
    const length = Math.sqrt(
      direction.x * direction.x + direction.y * direction.y
    );
    if (length > 0) {
      direction.x /= length;
      direction.y /= length;
    }

    // Calculate new position
    const newX = player.position.x + direction.x * movement.speed * deltaTime;
    const newY = player.position.y + direction.y * movement.speed * deltaTime;

    // Check wall collisions for X and Y movements separately
    const canMoveX = !this.game.getCampManager().entityCollidesWithWalls({
      x: newX,
      y: player.position.y,
      radius: player.radius,
    });

    const canMoveY = !this.game.getCampManager().entityCollidesWithWalls({
      x: player.position.x,
      y: newY,
      radius: player.radius,
    });

    // Apply movement only in valid directions
    if (canMoveX) {
      player.position.x = newX;
    }
    if (canMoveY) {
      player.position.y = newY;
    }

    // Keep player within world bounds
    player.position.x = Math.max(
      player.radius,
      Math.min(player.position.x, this.game.WORLD_WIDTH - player.radius)
    );
    player.position.y = Math.max(
      player.radius,
      Math.min(player.position.y, this.game.WORLD_HEIGHT - player.radius)
    );

    // Update weapon
    const combat = assertValue(
      player.combat,
      "Player must have combat component"
    );
    if (combat.weapon) {
      combat.weapon.update(player.position.x, player.position.y);
    }

    // Update player angle based on mouse position
    const angle = Math.atan2(
      this.mouseY - player.position.y,
      this.mouseX - player.position.x
    );
    player.render.targetAngle = angle;
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

  getActivePlayer(): Entity {
    return assertValue(this.players[0], "No active player found");
  }

  clearPlayers(): void {
    this.players = [];
  }
}
