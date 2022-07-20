import { ObserverWrapper, subscribable } from "../ui/Observer";
import { DangerousCircle } from "./DangerousCircle/DangerousCircle";
export class PlayerFriend extends DangerousCircle implements subscribable {
  observer: ObserverWrapper;
  damage(amount) {
    if (this.healthbar.decrease(amount)) {
      this.observer.notify();
      this.destroy();
    } else {
      this.anims.play("damage-" + this.texture.key);
    }
  }
  subscribe(type: string, observer: ObserverWrapper) {
    if (type === "destroy") {
      this.observer = observer;
    }
  }
}
