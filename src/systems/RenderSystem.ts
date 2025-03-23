import { RenderType } from "../types";
import { ComponentManager, getByIdStrict } from "../Components";
import { PositionComponent, RenderComponent } from "../Entity";

export class RenderSystem {
  constructor(
    private componentManager: ComponentManager,
    private ctx: CanvasRenderingContext2D
  ) {}

  update() {
    const visible = this.componentManager.visible;
    const positions = this.componentManager.positions;

    for (const id of visible.ids) {
      const position = getByIdStrict(positions, id);
      const render = getByIdStrict(this.componentManager.render, id);
      this.renderEntity(position, render);
    }
  }
  renderEntity(position: PositionComponent, render: RenderComponent): void {
    switch (render.type) {
      case RenderType.Circle:
        this.renderCircle(position, render);
        break;
      case RenderType.Triangle:
        this.renderTriangle(position, render);
        break;
      case RenderType.Rectangle:
        this.renderRectangle(position, render);
        break;
    }
  }

  private renderTriangle(position: PositionComponent, render: RenderComponent) {
    this.ctx.save();
    this.ctx.translate(position.x, position.y);
    this.ctx.rotate(render.targetAngle ?? 0);

    this.ctx.beginPath();
    this.ctx.moveTo(position.size / 2, 0);
    this.ctx.lineTo(-position.size / 2, -position.size / 2);
    this.ctx.lineTo(-position.size / 2, position.size / 2);
    this.ctx.fillStyle = render.color;
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.restore();
  }

  private renderCircle(position: PositionComponent, render: RenderComponent) {
    this.ctx.beginPath();
    this.ctx.arc(position.x, position.y, position.size, 0, Math.PI * 2);
    this.ctx.fillStyle = render.color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  private renderRectangle(
    position: PositionComponent,
    render: RenderComponent
  ) {
    this.ctx.save();
    this.ctx.translate(position.x, position.y);
    this.ctx.fillStyle = render.color;
    this.ctx.fillRect(
      -position.size / 2,
      -position.size / 2,
      position.size,
      position.size
    );
    this.ctx.restore();
  }
}
