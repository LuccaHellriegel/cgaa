import { ComponentManager, getByIdStrict } from "../Components";

export class DamageExecutionSystem {
  constructor(private componentManager: ComponentManager) {}

  update() {
    for (let i = 0; i < this.componentManager.damage.ids.length; i++) {
      const id = this.componentManager.damage.ids[i];
      const target = this.componentManager.damage.targets[i];
      const executed = this.componentManager.damage.executed[i];

      if (executed) {
        continue;
      }

      const health = getByIdStrict(this.componentManager.health, target);
      const attack = getByIdStrict(this.componentManager.attack, id);

      health.current = Math.max(0, health.current - attack.attackValue);
      this.componentManager.damage.executed[i] = true;
    }
  }
}
