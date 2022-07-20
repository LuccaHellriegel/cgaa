import { DangerousCircle } from "../DangerousCircle/DangerousCircle";

export class King extends DangerousCircle {
  damage(amount) {
    if (this.healthbar.decrease(amount)) {
      this.scene.events.emit("win");
      this.destroy();
    } else {
      super.damage(amount);
    }
  }
}
