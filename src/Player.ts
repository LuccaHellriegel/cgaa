import { ChainWeapon } from "./ChainWeapon";

export class Player {
  private trails: Array<{ x: number; y: number; alpha: number }> = [];
  private readonly MAX_TRAILS = 10;
  private readonly TRAIL_FADE_SPEED = 2; // How quickly trails fade out
  readonly RADIUS = 20; // Player radius for collision checking
  private chainWeapon: ChainWeapon;
  private mousePressed: boolean = false;
  private mouseX: number = 0;
  private mouseY: number = 0;

  constructor(
    public x: number,
    public y: number,
    private readonly worldWidth: number,
    private readonly worldHeight: number,
    private speed: number = 300 // pixels per second
  ) {
    this.chainWeapon = new ChainWeapon(x, y);
  }

  update(
    deltaTime: number,
    keys: Set<string>,
    checkCollision: (x: number, y: number) => boolean,
    checkEnemyHit?: (x: number, y: number, radius: number) => boolean,
    cameraX: number = 0,
    cameraY: number = 0
  ) {
    const movement = this.speed * deltaTime;
    let moved = false;
    let newX = this.x;
    let newY = this.y;

    if (keys.has("w")) {
      newY -= movement;
      moved = true;
    }
    if (keys.has("s")) {
      newY += movement;
      moved = true;
    }
    if (keys.has("a")) {
      newX -= movement;
      moved = true;
    }
    if (keys.has("d")) {
      newX += movement;
      moved = true;
    }

    // Clamp position to world bounds
    newX = Math.max(this.RADIUS, Math.min(this.worldWidth - this.RADIUS, newX));
    newY = Math.max(
      this.RADIUS,
      Math.min(this.worldHeight - this.RADIUS, newY)
    );

    // Check wall collisions
    if (checkCollision(newX, newY)) {
      // Try moving only horizontally
      if (newX !== this.x && !checkCollision(newX, this.y)) {
        this.x = newX;
        moved = true;
      }
      // Try moving only vertically
      else if (newY !== this.y && !checkCollision(this.x, newY)) {
        this.y = newY;
        moved = true;
      }
    } else {
      // No collision, update both coordinates
      this.x = newX;
      this.y = newY;
      moved = true;
    }

    // Add trail if moved
    if (moved) {
      this.trails.push({ x: this.x, y: this.y, alpha: 1 });
      if (this.trails.length > this.MAX_TRAILS) {
        this.trails.shift();
      }
    }

    // Update trail alphas
    this.trails.forEach((trail) => {
      trail.alpha = Math.max(
        0,
        trail.alpha - this.TRAIL_FADE_SPEED * deltaTime
      );
    });

    // Update the chain weapon
    this.chainWeapon.updatePosition(this.x, this.y);
    const hitCheck = checkEnemyHit || (() => false); // Default no-op if not provided
    this.chainWeapon.update(
      deltaTime,
      this.mousePressed,
      this.mouseX,
      this.mouseY,
      cameraX,
      cameraY,
      hitCheck
    );
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    // Draw the chain weapon (draw it before the player to make player appear on top)
    this.chainWeapon.draw(ctx, cameraX, cameraY);

    // Draw trails
    this.trails.forEach((trail) => {
      ctx.beginPath();
      ctx.arc(trail.x - cameraX, trail.y - cameraY, 15, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 150, 255, ${trail.alpha})`;
      ctx.fill();
    });

    // Draw player
    ctx.beginPath();
    ctx.arc(this.x - cameraX, this.y - cameraY, 20, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.stroke();

    // Draw direction indicator
    ctx.beginPath();
    ctx.moveTo(this.x - cameraX, this.y - cameraY);
    ctx.lineTo(this.x - cameraX, this.y - cameraY - 30);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  setMouse(pressed: boolean, x: number, y: number) {
    this.mousePressed = pressed;
    this.mouseX = x;
    this.mouseY = y;
  }

  getWeaponDamage(): number {
    return this.chainWeapon.getDamage();
  }

  getWeaponHealth(): number {
    return this.chainWeapon.getHealth();
  }

  damageWeapon(amount: number): void {
    this.chainWeapon.takeDamage(amount);
  }

  healWeapon(amount: number): void {
    this.chainWeapon.heal(amount);
  }
}
