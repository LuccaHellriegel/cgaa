import { Gameplay } from "../scenes/Gameplay";
import { HUD } from "../scenes/HUD";
import { Polygon } from "../polygon/Polygon";

export class PlayerCounter {
  value: any;
  startValue: any;
  playerCounterText: Phaser.GameObjects.Text;
  constructor(
    sceneToUse: HUD,
    sceneToListen: Gameplay,
    x,
    y,
    startValue,
    increaseEvent,
    decreaseEvent,
    zeroEvent,
    graphicObject: Polygon
  ) {
    this.value = startValue;
    this.startValue = startValue;

    let graphics = sceneToUse.add.graphics({
      fillStyle: {
        color: 0x228b22
      }
    });
    graphicObject.draw(graphics, 0);
    this.playerCounterText = sceneToUse.add.text(x, y, startValue.toString(), {
      font: "20px Verdana",
      fill: "#ADFF2F"
    });

    this.setupEventListeners(
      sceneToUse,
      sceneToListen,
      increaseEvent,
      decreaseEvent,
      zeroEvent
    );
  }

  reset() {
    this.value = this.startValue;
    this.playerCounterText.setText(this.value.toString());
  }

  setupEventListeners(
    sceneToUse: HUD,
    sceneToListen: Gameplay,
    increaseEvent,
    decreaseEvent,
    zeroEvent
  ) {
    sceneToListen.events.on(increaseEvent, function(amount) {
      this.value += amount;
      this.playerCounterText.setText(this.value.toString());
    },this);
    sceneToListen.events.on(decreaseEvent, function(amount) {
      if (this.value - amount <= 0) {
        this.value = 0;
        sceneToUse.events.emit(zeroEvent);
      } else {
        this.value -= amount;
      }
      this.playerCounterText.setText(this.value.toString());
    }, this);
  }
}
