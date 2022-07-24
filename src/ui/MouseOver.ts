export const setupMouseOver = (
  boolObj: {
    mouseOver: boolean;
  },
  eventObj: Phaser.Events.EventEmitter
) => {
  eventObj.on("pointerover", () => {
    boolObj.mouseOver = true;
  });
  eventObj.on("pointerout", () => {
    boolObj.mouseOver = false;
  });
};
