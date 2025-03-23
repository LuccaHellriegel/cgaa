import { Entity } from "./Entity";
import { RenderType } from "./types";
type ChainWeaponState = "IDLE" | "EXTENDING" | "EXTENDED" | "RETRACTING";

export class ChainWeapon {
  private links: Entity[];
  private linkCount: number;
  private baseRadius: number;
  private linkDistance: number;
  private state: ChainWeaponState;
  private angle: number;
  private maxLength: number;
  private currentLength: number;
  private extendSpeed: number;
  public retractSpeed: number;
  private holdTime: number;
  private holdCounter: number;
  private triangleTip: Entity;
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
      id: 0,
      position: { x: 0, y: 0 },
      size: 20,
      render: { color: "#e74c3c" },
      type: RenderType.Triangle,
      isDead: false,
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
        id: i,
        position: { x: startX, y: startY },
        size: radius,
        render: { color: "#888" },
        type: RenderType.Circle,
        isDead: false,
      });
    }

    const lastLinkRadius = this.links[linkCount - 1].size;
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
          // Clear hit enemies when fully extended to allow for new hits
          this.hitEnemies.clear();
        }
        break;

      case "EXTENDED":
        this.holdCounter--;
        if (this.holdCounter <= 0) {
          this.state = "RETRACTING";
          // Clear hit enemies when starting to retract
          this.hitEnemies.clear();
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

    // Update link positions
    if (this.state !== "IDLE") {
      const visibleLinks = Math.min(
        Math.ceil(this.currentLength / this.linkDistance),
        this.linkCount
      );

      for (let i = 0; i < this.linkCount; i++) {
        if (i < visibleLinks) {
          const linkDistance = (i + 1) * this.linkDistance;
          const linkLength = Math.min(linkDistance, this.currentLength);

          this.links[i].position.x =
            this.originX + Math.cos(this.angle) * linkLength;
          this.links[i].position.y =
            this.originY + Math.sin(this.angle) * linkLength;
        } else {
          this.links[i].position.x = this.originX;
          this.links[i].position.y = this.originY;
        }
      }

      if (visibleLinks > 0) {
        const lastLink = this.links[visibleLinks - 1];
        this.triangleTip.position.x =
          lastLink.position.x + Math.cos(this.angle) * this.tipOffset;
        this.triangleTip.position.y =
          lastLink.position.y + Math.sin(this.angle) * this.tipOffset;
      } else {
        this.triangleTip.position.x = this.originX;
        this.triangleTip.position.y = this.originY;
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
      ctx.arc(link.position.x, link.position.y, link.size, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? "#5499db" : "#888";
      ctx.fill();
      ctx.closePath();
    }

    if (visibleLinks > 0) {
      ctx.save();
      ctx.translate(this.triangleTip.position.x, this.triangleTip.position.y);
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

  checkCollisions(enemies: Entity[]): number[] {
    if (this.state !== "EXTENDING" && this.state !== "EXTENDED") return [];

    const hitEnemyIndices: number[] = [];
    const visibleLinks = Math.min(
      Math.ceil(this.currentLength / this.linkDistance),
      this.linkCount
    );

    // Check triangle tip for collisions
    for (let i = 0; i < enemies.length; i++) {
      if (enemies[i].isDead || this.hitEnemies.has(i)) continue;

      const enemy = enemies[i];
      const dx = this.triangleTip.position.x - enemy.position.x;
      const dy = this.triangleTip.position.y - enemy.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.triangleTip.size / 2 + enemy.size) {
        hitEnemyIndices.push(i);
        this.hitEnemies.add(i);
      }
    }

    // Check all visible links for collisions
    for (let j = 0; j < visibleLinks; j++) {
      const link = this.links[j];

      for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].isDead || this.hitEnemies.has(i)) continue;

        const enemy = enemies[i];
        const dx = link.position.x - enemy.position.x;
        const dy = link.position.y - enemy.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < link.size + enemy.size) {
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
      this.hitEnemies.clear();
    }
  }

  getState(): ChainWeaponState {
    return this.state;
  }

  getHitbox(): { x: number; y: number; radius: number } | null {
    if (this.state === "IDLE" || this.state === "RETRACTING") return null;

    // Return the triangle tip as the hitbox
    return {
      x: this.triangleTip.position.x,
      y: this.triangleTip.position.y,
      radius: this.triangleTip.size / 2,
    };
  }

  getLinks(): Entity[] {
    if (this.state === "IDLE" || this.state === "RETRACTING") return [];

    const visibleLinks = Math.min(
      Math.ceil(this.currentLength / this.linkDistance),
      this.linkCount
    );

    return this.links.slice(0, visibleLinks);
  }

  checkCollisionWithEntity(entity: Entity): boolean {
    if (this.state !== "EXTENDING" && this.state !== "EXTENDED") return false;

    // Check tip collision
    const hitbox = this.getHitbox();
    if (hitbox) {
      const dx = hitbox.x - entity.position.x;
      const dy = hitbox.y - entity.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < entity.size + hitbox.radius) {
        return true;
      }
    }

    // Check chain link collisions
    const links = this.getLinks();
    for (const link of links) {
      const dx = link.position.x - entity.position.x;
      const dy = link.position.y - entity.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < entity.size + link.size) {
        return true;
      }
    }

    return false;
  }
}
