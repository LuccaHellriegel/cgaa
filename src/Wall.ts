export class Wall {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public isCampWall: boolean = true
  ) {}

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    // Use a different color for camp walls
    if (this.isCampWall) {
      ctx.fillStyle = "#7f8c8d";
      ctx.fillRect(this.x - cameraX, this.y - cameraY, this.width, this.height);

      // Add some detail to make camp walls look better
      ctx.strokeStyle = "#34495e";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        this.x - cameraX,
        this.y - cameraY,
        this.width,
        this.height
      );

      // Add a subtle pattern to camp walls
      ctx.fillStyle = "#6c7a7a";
      const patternSize = 10;
      for (let i = 0; i < this.width; i += patternSize) {
        for (let j = 0; j < this.height; j += patternSize) {
          if ((i + j) % (patternSize * 2) === 0) {
            ctx.fillRect(
              this.x - cameraX + i,
              this.y - cameraY + j,
              patternSize / 2,
              patternSize / 2
            );
          }
        }
      }
    } else {
      // Original wall style
      ctx.fillStyle = "#95a5a6";
      ctx.fillRect(this.x - cameraX, this.y - cameraY, this.width, this.height);
      ctx.strokeStyle = "#7f8c8d";
      ctx.strokeRect(
        this.x - cameraX,
        this.y - cameraY,
        this.width,
        this.height
      );
    }
  }

  // Check if a point is inside the wall
  containsPoint(x: number, y: number): boolean {
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }

  // Check if a circle intersects with the wall
  intersectsCircle(circleX: number, circleY: number, radius: number): boolean {
    // Find the closest point on the wall to the circle center
    const closestX = Math.max(this.x, Math.min(circleX, this.x + this.width));
    const closestY = Math.max(this.y, Math.min(circleY, this.y + this.height));

    // Calculate the distance between the circle center and the closest point
    const distanceX = circleX - closestX;
    const distanceY = circleY - closestY;

    // If the distance is less than the radius, there's a collision
    return distanceX * distanceX + distanceY * distanceY < radius * radius;
  }
}
