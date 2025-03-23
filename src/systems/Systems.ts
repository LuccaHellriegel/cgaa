import { ComponentManager } from "../Components";
import { CameraSystem } from "./CameraSystem";
import { DamageExecutionSystem } from "./DamageExecutionSystem";
import { DeathSystem } from "./DeathSystem";
import { RenderSystem } from "./RenderSystem";
import { ResizeSystem } from "./ResizeSystem";
import { VisibilitySystem } from "./VisibilitySystem";

export class Systems {
  private resizeSystem: ResizeSystem;
  private damageExecutionSystem: DamageExecutionSystem;
  private deathSystem: DeathSystem;
  private cameraSystem: CameraSystem;
  private visibilitySystem: VisibilitySystem;
  private renderSystem: RenderSystem;

  constructor(components: ComponentManager, ctx: CanvasRenderingContext2D) {
    this.resizeSystem = new ResizeSystem(components, ctx);
    this.damageExecutionSystem = new DamageExecutionSystem(components);
    this.deathSystem = new DeathSystem(components);
    this.cameraSystem = new CameraSystem(components);
    this.visibilitySystem = new VisibilitySystem(components);
    this.renderSystem = new RenderSystem(components, ctx);
  }

  update() {
    this.damageExecutionSystem.update();
    this.deathSystem.update();

    this.resizeSystem.update();

    this.visibilitySystem.update();
    this.cameraSystem.update();
    this.renderSystem.update();
  }
}
