import { EventHandler } from "../../events/EventHandler";

export const setupMouseOver = (
  boolObj: {
    mouseOver: boolean;
  },
  eventObj: EventHandler
) => {
  eventObj.on("pointerover", () => {
    boolObj.mouseOver = true;
  });
  eventObj.on("pointerout", () => {
    boolObj.mouseOver = false;
  });
};
