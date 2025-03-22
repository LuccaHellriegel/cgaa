import { Enemy, Player } from "./types";
import { ChainWeapon } from "./ChainWeapon";
import { EffectsSystem } from "./EffectsSystem";

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private player: Player;
  private enemies: Enemy[];
  private chainWeapon: ChainWeapon;
  private effects: EffectsSystem;
  private keys: { [key: string]: boolean };
  private mouseX: number;
  private mouseY: number;
  private lastClickTime: number;
  private readonly clickCooldown: number;
  private readonly enemyCount: number;
  private readonly PLAYER_INVULNERABLE_TIME: number = 1000; // 1 second of invulnerability after hit

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.keys = {};
    this.mouseX = 0;
    this.mouseY = 0;
    this.lastClickTime = 0;
    this.clickCooldown = 200;
    this.enemyCount = 15;

    // Initialize player with health
    this.player = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 20,
      color: "#3498db",
      speed: 5,
      direction: { x: 0, y: 0 },
      health: { current: 100, max: 100 },
      invulnerableUntil: 0,
    };

    // Initialize game objects
    this.enemies = [];
    this.chainWeapon = new ChainWeapon(this.player.x, this.player.y, 15);
    this.effects = new EffectsSystem();

    // Set up event listeners
    this.setupEventListeners();

    // Generate initial enemies
    this.generateEnemies();
  }

  private setupEventListeners(): void {
    window.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
    });

    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });

    this.canvas.addEventListener("mousedown", () => {
      const now = Date.now();
      if (now - this.lastClickTime < this.clickCooldown) return;
      this.lastClickTime = now;

      const angle = Math.atan2(
        this.mouseY - this.player.y,
        this.mouseX - this.player.x
      );

      if (this.chainWeapon.getState() === "IDLE") {
        this.chainWeapon.fire(this.player.x, this.player.y, angle);
      } else if (
        this.chainWeapon.getState() === "EXTENDING" ||
        this.chainWeapon.getState() === "EXTENDED"
      ) {
        this.chainWeapon.forceRetract();
      }
    });
  }

  private generateEnemies(): void {
    for (let i = 0; i < this.enemyCount; i++) {
      this.spawnNewEnemy();
    }
  }

  private spawnNewEnemy(): void {
    let x: number, y: number;
    let validPosition: boolean;

    do {
      validPosition = true;
      x = Math.random() * (this.canvas.width - 60) + 30;
      y = Math.random() * (this.canvas.height - 60) + 30;

      const dx = x - this.player.x;
      const dy = y - this.player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        validPosition = false;
      }
    } while (!validPosition);

    const radius = Math.random() * 10 + 15;
    this.enemies.push({
      x,
      y,
      radius,
      color: `hsl(${Math.random() * 60 + 340}, 80%, 60%)`,
      speed: 2,
      direction: { x: 0, y: 0 },
      weapon: new ChainWeapon(x, y, 10),
      detectionRange: 200,
      attackCooldown: 2000,
      lastAttackTime: 0,
      targetAngle: 0,
      turnSpeed: 0.02,
    });
  }

  private updatePlayer(): void {
    this.player.direction.x = 0;
    this.player.direction.y = 0;

    if (this.keys["ArrowUp"] || this.keys["w"] || this.keys["W"])
      this.player.direction.y = -1;
    if (this.keys["ArrowDown"] || this.keys["s"] || this.keys["S"])
      this.player.direction.y = 1;
    if (this.keys["ArrowLeft"] || this.keys["a"] || this.keys["A"])
      this.player.direction.x = -1;
    if (this.keys["ArrowRight"] || this.keys["d"] || this.keys["D"])
      this.player.direction.x = 1;

    const length = Math.sqrt(
      this.player.direction.x * this.player.direction.x +
        this.player.direction.y * this.player.direction.y
    );

    if (length > 0) {
      this.player.direction.x /= length;
      this.player.direction.y /= length;
    }

    this.player.x += this.player.direction.x * this.player.speed;
    this.player.y += this.player.direction.y * this.player.speed;

    // Keep player within bounds
    this.player.x = Math.max(
      this.player.radius,
      Math.min(this.canvas.width - this.player.radius, this.player.x)
    );
    this.player.y = Math.max(
      this.player.radius,
      Math.min(this.canvas.height - this.player.radius, this.player.y)
    );
  }

  private updateEnemies(): void {
    const now = Date.now();

    for (const enemy of this.enemies) {
      const dx = this.player.x - enemy.x;
      const dy = this.player.y - enemy.y;
      const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);

      // Calculate angle to player
      const angleToPlayer = Math.atan2(dy, dx);

      // Smoothly rotate towards player
      let angleDiff = angleToPlayer - enemy.targetAngle;
      // Normalize angle difference to [-PI, PI]
      if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

      enemy.targetAngle +=
        Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), enemy.turnSpeed);

      if (distanceToPlayer < enemy.detectionRange) {
        // Move towards player
        enemy.direction.x = Math.cos(enemy.targetAngle);
        enemy.direction.y = Math.sin(enemy.targetAngle);

        enemy.x += enemy.direction.x * enemy.speed;
        enemy.y += enemy.direction.y * enemy.speed;

        // Attack if cooldown is over
        if (now - enemy.lastAttackTime > enemy.attackCooldown && enemy.weapon) {
          if (enemy.weapon.getState() === "IDLE") {
            enemy.weapon.fire(enemy.x, enemy.y, enemy.targetAngle);
            enemy.lastAttackTime = now;
          }
        }
      }

      // Update enemy's weapon
      if (enemy.weapon) {
        enemy.weapon.update(enemy.x, enemy.y);

        // Check if weapon hits player
        if (!this.isPlayerInvulnerable()) {
          const playerHit = this.checkWeaponHitsPlayer(enemy.weapon);
          if (playerHit) {
            this.damagePlayer(10);
          }
        }
      }
    }
  }

  private isPlayerInvulnerable(): boolean {
    return Date.now() < this.player.invulnerableUntil;
  }

  private damagePlayer(amount: number): void {
    this.player.health.current = Math.max(
      0,
      this.player.health.current - amount
    );
    this.player.invulnerableUntil = Date.now() + this.PLAYER_INVULNERABLE_TIME;
    this.effects.createHitEffect(this.player.x, this.player.y, "#ff0000");
  }

  private checkWeaponHitsPlayer(weapon: ChainWeapon): boolean {
    // We'll implement a simple hit check using the weapon's tip
    const hitbox = weapon.getHitbox();
    if (!hitbox) return false;

    const dx = hitbox.x - this.player.x;
    const dy = hitbox.y - this.player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < this.player.radius + hitbox.radius;
  }

  update(): void {
    this.updatePlayer();
    this.updateEnemies();
    this.chainWeapon.update(this.player.x, this.player.y);
    this.effects.update();

    const hitEnemyIndices = this.chainWeapon.checkCollisions(this.enemies);

    if (hitEnemyIndices.length > 0) {
      hitEnemyIndices.sort((a, b) => b - a);

      for (const index of hitEnemyIndices) {
        const hitEnemy = this.enemies[index];
        this.effects.createHitEffect(hitEnemy.x, hitEnemy.y, hitEnemy.color);
        this.enemies.splice(index, 1);
        this.spawnNewEnemy();
      }
    }
  }

  render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw enemies and their weapons
    for (const enemy of this.enemies) {
      // Draw enemy
      this.ctx.beginPath();
      this.ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = enemy.color;
      this.ctx.fill();
      this.ctx.closePath();

      // Draw enemy's weapon
      if (enemy.weapon) {
        enemy.weapon.render(this.ctx);
      }

      // Draw enemy's detection range (for debugging)
      // this.ctx.beginPath();
      // this.ctx.arc(enemy.x, enemy.y, enemy.detectionRange, 0, Math.PI * 2);
      // this.ctx.strokeStyle = "rgba(255, 0, 0, 0.2)";
      // this.ctx.stroke();
      // this.ctx.closePath();
    }

    // Draw player with damage indication
    this.ctx.beginPath();
    this.ctx.arc(
      this.player.x,
      this.player.y,
      this.player.radius,
      0,
      Math.PI * 2
    );

    if (this.isPlayerInvulnerable()) {
      // Flash white when invulnerable
      this.ctx.fillStyle = `rgba(255, 255, 255, ${
        0.5 + Math.sin(Date.now() * 0.01) * 0.5
      })`;
    } else {
      // Normal color with health tint
      const healthPercent = this.player.health.current / this.player.health.max;
      const red = Math.floor(255 * (1 - healthPercent));
      const blue = Math.floor(255 * healthPercent);
      this.ctx.fillStyle = `rgb(${red}, 100, ${blue})`;
    }

    this.ctx.fill();
    this.ctx.closePath();

    // Draw health bar
    const healthBarWidth = 50;
    const healthBarHeight = 5;
    const healthPercent = this.player.health.current / this.player.health.max;

    this.ctx.fillStyle = "#ff0000";
    this.ctx.fillRect(
      this.player.x - healthBarWidth / 2,
      this.player.y - this.player.radius - 10,
      healthBarWidth,
      healthBarHeight
    );

    this.ctx.fillStyle = "#00ff00";
    this.ctx.fillRect(
      this.player.x - healthBarWidth / 2,
      this.player.y - this.player.radius - 10,
      healthBarWidth * healthPercent,
      healthBarHeight
    );

    // Draw aiming line when weapon is not active
    if (this.chainWeapon.getState() === "IDLE") {
      const angle = Math.atan2(
        this.mouseY - this.player.y,
        this.mouseX - this.player.x
      );
      this.ctx.beginPath();
      this.ctx.moveTo(this.player.x, this.player.y);
      this.ctx.lineTo(
        this.player.x + Math.cos(angle) * 30,
        this.player.y + Math.sin(angle) * 30
      );
      this.ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      this.ctx.closePath();
    }

    // Draw player's chain weapon
    this.chainWeapon.render(this.ctx);

    // Draw effects
    this.effects.render(this.ctx);
  }
}
