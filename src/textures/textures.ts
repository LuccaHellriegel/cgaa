import { EnvSetup } from "../config/EnvSetup";
import { UnitSetup } from "../config/UnitSetup";
import { RectGenerator } from "../engine/RectGenerator";
import { CircleGenerator } from "../units/CircleGenerator";
import { weaponTextures } from "../weapons/ChainWeapon/chain-weapon-texture";
import { generateUnits } from "./textures-units";

export function Textures(scene) {
  generateUnits(scene);
  new CircleGenerator(
    0xff0000,
    scene,
    "bullet",
    UnitSetup.normalCircleRadius / 4
  );

  RectGenerator(
    scene,
    0xa9a9a9,
    "wallPart",
    EnvSetup.halfGridPartSize,
    EnvSetup.halfGridPartSize,
    EnvSetup.gridPartSize,
    EnvSetup.gridPartSize
  );

  weaponTextures(scene);
}
