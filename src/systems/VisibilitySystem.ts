import { ComponentManager } from "../Components";
import { PositionComponent, CameraComponent, ScreenComponent } from "../Entity";

export class VisibilitySystem {
  constructor(private componentManager: ComponentManager) {}

  update() {
    const screen = this.componentManager.screen;
    const camera = this.componentManager.camera;
    const positions = this.componentManager.positions;

    let visibleIds: number[] = [];
    for (let i = 0; i < positions.ids.length; i++) {
      const entityId = positions.ids[i];
      const component = positions.components[i];

      if (!isInViewport(component, camera, screen)) {
        continue;
      }

      if (this.componentManager.dead.ids.includes(entityId)) {
        continue;
      }

      visibleIds.push(entityId);
    }

    this.componentManager.visible.ids = visibleIds;
  }
}

function isInViewport(
  component: PositionComponent,
  camera: CameraComponent,
  screen: ScreenComponent
) {
  return (
    component.x + component.size >= camera.position.x &&
    component.x - component.size <= camera.position.x + screen.viewportWidth &&
    component.y + component.size >= camera.position.y &&
    component.y - component.size <= camera.position.y + screen.viewportHeight
  );
}
