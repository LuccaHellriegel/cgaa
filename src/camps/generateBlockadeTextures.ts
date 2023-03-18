import { RectPolygon } from "../engine/polygons/RectPolygon";
import { EnvSetup } from "../config/EnvSetup";
import { Scene } from "phaser";

export const generateBlockadeTextures = (scene: Scene) => {
  let hexColor = 0xa9a9a9;
  let textureName = "blockade";
  let centerX = EnvSetup.halfGridPartSize;
  let centerY = EnvSetup.halfGridPartSize;
  let width = EnvSetup.gridPartSize;
  let height = EnvSetup.gridPartSize;

  let graphics = scene.add.graphics({
    fillStyle: {
      color: hexColor,
    },
  });

  let rect = new RectPolygon(centerX, centerY, width, height);
  let innerRect = new RectPolygon(centerX, centerY, width - 10, height - 10);

  rect.draw(graphics, 0);
  graphics.fillStyle(0x253f3f);
  innerRect.draw(graphics, 0);

  graphics.generateTexture(textureName, width, height);
  //TODO: sell/upgrade textures
  graphics.generateTexture("sell" + textureName, width, height);
  graphics.generateTexture("upgrade" + textureName, width, height);

  graphics.destroy();
};
