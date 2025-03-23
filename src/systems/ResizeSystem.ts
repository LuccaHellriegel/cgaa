import { ComponentManager } from "../Components";

export class ResizeSystem {
  private viewportWidth: number = 0;
  private viewportHeight: number = 0;

  constructor(
    private componentManager: ComponentManager,
    private ctx: CanvasRenderingContext2D
  ) {
    this.setWindowSize();
    this.update();
    window.addEventListener("resize", () => {
      this.setWindowSize();
    });
  }

  private setWindowSize() {
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;
  }

  update() {
    const screen = this.componentManager.screen;
    screen.viewportWidth = this.viewportWidth;
    screen.viewportHeight = this.viewportHeight;
    this.ctx.canvas.width = this.viewportWidth;
    this.ctx.canvas.height = this.viewportHeight;
  }
}
