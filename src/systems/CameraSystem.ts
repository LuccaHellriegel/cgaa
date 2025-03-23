import { ComponentManager, getByIdStrict } from "../Components";

export class CameraSystem {
  constructor(private componentManager: ComponentManager) {}

  update() {
    const screen = this.componentManager.screen;
    const camera = this.componentManager.camera;
    const player = this.componentManager.player;
    const playerComponent = getByIdStrict(
      this.componentManager.positions,
      player
    );

    const targetX = playerComponent.x - screen.viewportWidth / 2;
    const targetY = playerComponent.y - screen.viewportHeight / 2;

    camera.position.x += (targetX - camera.position.x) * camera.smoothFactor;
    camera.position.y += (targetY - camera.position.y) * camera.smoothFactor;

    camera.position.x = Math.max(
      0,
      Math.min(camera.position.x, screen.worldWidth - screen.viewportWidth)
    );
    camera.position.y = Math.max(
      0,
      Math.min(camera.position.y, screen.worldHeight - screen.viewportHeight)
    );
  }
}
