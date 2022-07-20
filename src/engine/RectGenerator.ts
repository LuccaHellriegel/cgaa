import { Gameplay } from "../scenes/Gameplay";
import { texture } from "./generation";

export function RectGenerator(
  scene: Gameplay,
  hexColor,
  name,
  centerX,
  centerY,
  width,
  height
) {
  const draw = (graphics) => {
    graphics.fillStyle(hexColor);
    graphics.fillRect(centerX - width / 2, centerY - height / 2, width, height);
  };
  texture({ scene, name, width, height }, { before: draw });
}
