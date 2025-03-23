import { ComponentManager } from "../Components";

export class DeathSystem {
  constructor(private componentManager: ComponentManager) {}

  update() {
    const newDeadIds: number[] = [];
    for (let i = 0; i < this.componentManager.health.ids.length; i++) {
      const id = this.componentManager.health.ids[i];
      const health = this.componentManager.health.components[i];
      if (health.current == 0) {
        newDeadIds.push(id);
      }
    }

    this.componentManager.dead.ids = newDeadIds;
  }
}
