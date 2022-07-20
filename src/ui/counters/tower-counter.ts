import { notifyWithVal } from "../Observer";
import { Gameplay } from "../../scenes/Gameplay";
import { EventSetup } from "../../config/EventSetup";

export const setupTowerCounter = (
  type: string,
  scene: Gameplay,
  guiElement: notifyWithVal
) => {
  let count = 0;
  scene.events.on(EventSetup.towerSoldEvent, function decrement(incomingType) {
    if (type == incomingType) {
      count--;
      guiElement.notify(count);
    }
  });
  scene.events.on(EventSetup.towerBuildEvent, function increment(incomingType) {
    if (type == incomingType) {
      count++;
      guiElement.notify(count);
    }
  });
};
