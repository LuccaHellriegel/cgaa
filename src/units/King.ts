import { DangerousCircle } from "./DangerousCircle";

export class King extends DangerousCircle {
  damage(amount) {
    if (this.healthbar.decrease(amount)) {
      this.scene.events.emit("win");
      this.destroy();
      return true;
    } else {
      super.damage(amount);
      return false;
    }
  }
}
