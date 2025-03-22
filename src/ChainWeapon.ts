import { ChainLink, ChainWeaponState, Enemy, TriangleTip } from "./types";

export class ChainWeapon {
  private links: ChainLink[];
  private linkCount: number;
  private baseRadius: number;
  private linkDistance: number;
  private state: ChainWeaponState;
  private angle: number;
  private maxLength: number;
  private currentLength: number;
  private extendSpeed: number;
  private retractSpeed: number;
  private holdTime: number;
  private holdCounter: number;
  private triangleTip: TriangleTip;
  private tipOffset: number;
  private hitEnemies: Set<number>;
  private originX: number;
  private originY: number;

  constructor(startX: number, startY: number, linkCount = 10) {
    this.links = [];
    this.linkCount = linkCount;
    this.baseRadius = 6;
    this.linkDistance = 12;
    this.state = "IDLE";
    this.angle = 0;
    this.maxLength = this.linkDistance * linkCount;
    this.currentLength = 0;
    this.extendSpeed = 30;
    this.retractSpeed = 25;
    this.holdTime = 5;
    this.holdCounter = 0;
    this.triangleTip = {
      size: 20,
      x: 0,
      y: 0,
    };
    this.hitEnemies = new Set();
    this.originX = startX;
    this.originY = startY;

    // Initialize links with gradually increasing sizes towards the end
    for (let i = 0; i < linkCount; i++) {
      const progressFactor = i / (linkCount - 1);
      const radiusIncrease = progressFactor * progressFactor * 8;
      const radius = this.baseRadius + radiusIncrease;

      this.links.push({
        x: startX,
        y: startY,
        radius: radius,
        color: "#888",
      });
    }

    const lastLinkRadius = this.links[linkCount - 1].radius;
    this.tipOffset = lastLinkRadius + this.triangleTip.size / 2 + 2;
  }

  fire(startX: number, startY: number, angle: number): void {
    if (this.state !== "IDLE") return;

    this.state = "EXTENDING";
    this.angle = angle;
    this.currentLength = 0;
    this.originX = startX;
    this.originY = startY;
    this.hitEnemies.clear();
  }

  update(playerX: number, playerY: number): void {
    this.originX = playerX;
    this.originY = playerY;

    switch (this.state) {
      case "IDLE":
        break;

      case "EXTENDING":
        this.currentLength += this.extendSpeed;

        if (this.currentLength >= this.maxLength) {
          this.currentLength = this.maxLength;
          this.state = "EXTENDED";
          this.holdCounter = this.holdTime;
        }
        break;

      case "EXTENDED":
        this.holdCounter--;
        if (this.holdCounter <= 0) {
          this.state = "RETRACTING";
        }
        break;

      case "RETRACTING":
        this.currentLength -= this.retractSpeed;

        if (this.currentLength <= 0) {
          this.currentLength = 0;
          this.state = "IDLE";
          this.hitEnemies.clear();
        }
        break;
    }

    if (this.state !== "IDLE") {
      const visibleLinks = Math.min(
        Math.ceil(this.currentLength / this.linkDistance),
        this.linkCount
      );

      for (let i = 0; i < this.linkCount; i++) {
        if (i < visibleLinks) {
          const linkDistance = (i + 1) * this.linkDistance;
          const linkLength = Math.min(linkDistance, this.currentLength);

          this.links[i].x = this.originX + Math.cos(this.angle) * linkLength;
          this.links[i].y = this.originY + Math.sin(this.angle) * linkLength;
        } else {
          this.links[i].x = this.originX;
          this.links[i].y = this.originY;
        }
      }

      if (visibleLinks > 0) {
        const lastLink = this.links[visibleLinks - 1];
        this.triangleTip.x = lastLink.x + Math.cos(this.angle) * this.tipOffset;
        this.triangleTip.y = lastLink.y + Math.sin(this.angle) * this.tipOffset;
      } else {
        this.triangleTip.x = this.originX;
        this.triangleTip.y = this.originY;
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (this.state === "IDLE") return;

    const visibleLinks = Math.min(
      Math.ceil(this.currentLength / this.linkDistance),
      this.linkCount
    );

    for (let i = 0; i < visibleLinks; i++) {
      const link = this.links[i];
      ctx.beginPath();
      ctx.arc(link.x, link.y, link.radius, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? "#5499db" : "#888";
      ctx.fill();
      ctx.closePath();
    }

    if (visibleLinks > 0) {
      ctx.save();
      ctx.translate(this.triangleTip.x, this.triangleTip.y);
      ctx.rotate(this.angle);

      ctx.beginPath();
      ctx.moveTo(this.triangleTip.size / 2, 0);
      ctx.lineTo(-this.triangleTip.size / 2, -this.triangleTip.size / 2);
      ctx.lineTo(-this.triangleTip.size / 2, this.triangleTip.size / 2);
      ctx.fillStyle = "#e74c3c";
      ctx.fill();
      ctx.closePath();

      ctx.restore();
    }
  }

  checkCollisions(enemies: Enemy[]): number[] {
    if (this.state !== "EXTENDING" && this.state !== "EXTENDED") return [];

    const hitEnemyIndices: number[] = [];

    // Check triangle tip for collisions
    for (let i = 0; i < enemies.length; i++) {
      if (this.hitEnemies.has(i)) continue;

      const enemy = enemies[i];
      const dx = this.triangleTip.x - enemy.x;
      const dy = this.triangleTip.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.triangleTip.size / 2 + enemy.radius) {
        hitEnemyIndices.push(i);
        this.hitEnemies.add(i);
      }
    }

    // Check the last few links
    const visibleLinks = Math.min(
      Math.ceil(this.currentLength / this.linkDistance),
      this.linkCount
    );

    let startCheckIndex = Math.max(0, visibleLinks - 3);
    for (let j = startCheckIndex; j < visibleLinks; j++) {
      if (j >= this.links.length) break;

      const link = this.links[j];

      for (let i = 0; i < enemies.length; i++) {
        if (this.hitEnemies.has(i)) continue;

        const enemy = enemies[i];
        const dx = link.x - enemy.x;
        const dy = link.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < link.radius + enemy.radius) {
          hitEnemyIndices.push(i);
          this.hitEnemies.add(i);
        }
      }
    }

    return hitEnemyIndices;
  }

  forceRetract(): void {
    if (this.state === "EXTENDING" || this.state === "EXTENDED") {
      this.state = "RETRACTING";
      this.holdCounter = 0;
    }
  }

  getState(): ChainWeaponState {
    return this.state;
  }

  getHitbox(): { x: number; y: number; radius: number } | null {
    if (this.state === "IDLE" || this.state === "RETRACTING") return null;

    // Return the triangle tip as the hitbox
    return {
      x: this.triangleTip.x,
      y: this.triangleTip.y,
      radius: this.triangleTip.size / 2,
    };
  }
}
