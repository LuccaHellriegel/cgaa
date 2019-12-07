import { RandWeaponGenerator } from "./base/weapons/RandWeaponGenerator";
import { CircleGenerator } from "./base/CircleGenerator";
import { normalCircleRadius, wallPartHalfSize } from "../../globals/globalSizes";
import { ChainWeaponGenerator } from "./base/weapons/ChainWeaponGenerator";
import { BuildingGenerator } from "./BuildingGenerator";
import { RectGenerator } from "./base/RectGenerator";
import { GhostTowerGenerator } from "./GhostTowerGenerator";
import { campHexColors } from "../../globals/globalColors";
import { circleSizes } from "../../globals/globalSizes";
import { executeOverAllCampsAndSizes, executeOverAllCamps } from "../../globals/global";

export class GeneratorService {
  private constructor() {}

  static generateTextures(scene) {
    new RectGenerator(
      scene,
      0x013220,
      "tower",
      1.5 * wallPartHalfSize,
      1.5 * wallPartHalfSize,
      3 * wallPartHalfSize,
      3 * wallPartHalfSize
    );
    new GhostTowerGenerator(scene);
    this.generateUnits(scene);
    this.generateWeapons(scene);
    this.generateEnvironment(scene);
  }

  private static generateWeapons(scene) {
    new RandWeaponGenerator(0x6495ed, scene);
    new ChainWeaponGenerator(0xff0000, scene);
    new CircleGenerator(0x6495ed, scene, "bullet", normalCircleRadius / 4);
  }

  private static generateUnits(scene) {
    new CircleGenerator(0x6495ed, scene, "blueCircle", normalCircleRadius);

    executeOverAllCampsAndSizes((color, colorIndex, sizeName, sizeNameIndex) => {
      let title = color + sizeName + "Circle";
      new CircleGenerator(campHexColors[colorIndex], scene, title, circleSizes[sizeNameIndex]);
    });

    executeOverAllCamps((color, colorIndex) => {
      new BuildingGenerator(scene, color + "Building", campHexColors[colorIndex]);
    });
  }

  private static generateEnvironment(scene) {
    new RectGenerator(
      scene,
      0xa9a9a9,
      "wallPart",
      wallPartHalfSize,
      wallPartHalfSize,
      2 * wallPartHalfSize,
      2 * wallPartHalfSize
    );
  }
}
