export class ChainWeapon {
  private readonly TRIANGLE_SIZE = 15;
  private readonly MAX_CIRCLE_RADIUS = 12; // Increased max radius
  private readonly MIN_CIRCLE_RADIUS = 6; // Added min radius
  private readonly CIRCLE_SPACING = 20;
  private readonly MAX_LENGTH = 300; // Reduced from 500 to 300
  private readonly EXTENSION_SPEED = 1600; // Doubled speed of extension from 800 to 1600
  private readonly RETRACTION_SPEED = 1200; // Increased retraction speed
  private readonly DAMAGE = 20; // Damage per hit
  private readonly COOLDOWN = 0.5; // Cooldown between hits in seconds

  private circles: { x: number; y: number; radius: number }[] = []; // Added radius property
  private triangleX: number = 0;
  private triangleY: number = 0;
  private direction: { x: number; y: number } = { x: 0, y: -1 }; // Default direction (up)
  private health: number = 100;
  private isExtending: boolean = false;
  private fullyExtended: boolean = false;
  private extensionLength: number = 0;
  private lastHitTime: number = 0;
  private hitEffect: boolean = false;
  private hitEffectTime: number = 0;

  constructor(private playerX: number, private playerY: number) {
    this.updatePosition(playerX, playerY);
  }

  updatePosition(x: number, y: number): void {
    this.playerX = x;
    this.playerY = y;

    // Update the starting position of the chain
    if (!this.isExtending && !this.fullyExtended) {
      this.updateChainPosition();
    }
  }

  private updateChainPosition(): void {
    // Calculate positions based on current extension length
    this.circles = [];

    const numCircles = Math.floor(this.extensionLength / this.CIRCLE_SPACING);

    for (let i = 0; i < numCircles; i++) {
      const distance = (i + 1) * this.CIRCLE_SPACING;
      // Calculate circle radius - decrease size as we move away from the player
      const radiusRatio = 1 - i / Math.max(1, numCircles);
      const radius =
        this.MIN_CIRCLE_RADIUS +
        radiusRatio * (this.MAX_CIRCLE_RADIUS - this.MIN_CIRCLE_RADIUS);

      this.circles.push({
        x: this.playerX + this.direction.x * distance,
        y: this.playerY + this.direction.y * distance,
        radius: radius,
      });
    }

    // Position the triangle at the end of the chain
    this.triangleX = this.playerX + this.direction.x * this.extensionLength;
    this.triangleY = this.playerY + this.direction.y * this.extensionLength;
  }

  update(
    deltaTime: number,
    mousePressed: boolean,
    mouseX: number,
    mouseY: number,
    cameraX: number,
    cameraY: number,
    checkEnemyHit: (x: number, y: number, radius: number) => boolean
  ): void {
    // Update hit effect timer
    if (this.hitEffect) {
      this.hitEffectTime -= deltaTime;
      if (this.hitEffectTime <= 0) {
        this.hitEffect = false;
      }
    }

    // Calculate direction from player to mouse
    const screenMouseX = mouseX + cameraX;
    const screenMouseY = mouseY + cameraY;

    const dx = screenMouseX - this.playerX;
    const dy = screenMouseY - this.playerY;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length > 0) {
      this.direction = {
        x: dx / length,
        y: dy / length,
      };
    }

    // Handle extension/retraction
    if (mousePressed && !this.fullyExtended) {
      this.isExtending = true;
      this.extensionLength += this.EXTENSION_SPEED * deltaTime;

      if (this.extensionLength >= this.MAX_LENGTH) {
        this.extensionLength = this.MAX_LENGTH;
        this.fullyExtended = true;
        this.isExtending = false;
      }
    } else if (this.extensionLength > 0) {
      this.isExtending = false;
      this.extensionLength -= this.RETRACTION_SPEED * deltaTime;

      if (this.extensionLength <= 0) {
        this.extensionLength = 0;
        this.fullyExtended = false;
      }
    }

    // Update chain positions
    this.updateChainPosition();

    // Check for collisions with enemies when extending
    if (
      (this.isExtending || this.fullyExtended) &&
      performance.now() - this.lastHitTime > this.COOLDOWN * 1000
    ) {
      // Check the triangle for collision
      if (checkEnemyHit(this.triangleX, this.triangleY, this.TRIANGLE_SIZE)) {
        console.log("Chain weapon hit an enemy! Damage: " + this.DAMAGE);
        this.lastHitTime = performance.now();
        this.hitEffect = true;
        this.hitEffectTime = 0.2; // Hit effect lasts for 0.2 seconds
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number): void {
    // Draw health bar
    const healthBarWidth = 50;
    const healthBarHeight = 5;
    const healthBarX = this.playerX - healthBarWidth / 2 - cameraX;
    const healthBarY = this.playerY - 40 - cameraY;

    // Health bar background
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

    // Health bar fill
    ctx.fillStyle =
      this.health > 50 ? "green" : this.health > 25 ? "orange" : "red";
    ctx.fillRect(
      healthBarX,
      healthBarY,
      healthBarWidth * (this.health / 100),
      healthBarHeight
    );

    // Draw the chain circles
    for (const circle of this.circles) {
      ctx.beginPath();
      ctx.arc(
        circle.x - cameraX,
        circle.y - cameraY,
        circle.radius, // Use the circle's specific radius
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "#888";
      ctx.fill();
      ctx.strokeStyle = "#555";
      ctx.stroke();
    }

    // Draw triangle at the end
    if (this.extensionLength > 0) {
      const size = this.TRIANGLE_SIZE;
      // Calculate triangle points based on direction
      const angle = Math.atan2(this.direction.y, this.direction.x);
      const angleDiff = 1.8; // Reduced from 2.5 to make triangle less pointy

      ctx.beginPath();
      ctx.moveTo(
        this.triangleX - cameraX + Math.cos(angle) * size,
        this.triangleY - cameraY + Math.sin(angle) * size
      );
      ctx.lineTo(
        this.triangleX - cameraX + Math.cos(angle + angleDiff) * size,
        this.triangleY - cameraY + Math.sin(angle + angleDiff) * size
      );
      ctx.lineTo(
        this.triangleX - cameraX + Math.cos(angle - angleDiff) * size,
        this.triangleY - cameraY + Math.sin(angle - angleDiff) * size
      );
      ctx.closePath();

      ctx.fillStyle = this.hitEffect ? "#ffff00" : "#e74c3c";
      ctx.fill();
      ctx.strokeStyle = this.hitEffect ? "#ffffff" : "#c0392b";
      ctx.lineWidth = this.hitEffect ? 3 : 1;
      ctx.stroke();
      ctx.lineWidth = 1;
    }
  }

  getHealth(): number {
    return this.health;
  }

  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
  }

  heal(amount: number): void {
    this.health = Math.min(100, this.health + amount);
  }

  getDamage(): number {
    return this.DAMAGE;
  }

  isAtFullHealth(): boolean {
    return this.health >= 100;
  }
}
