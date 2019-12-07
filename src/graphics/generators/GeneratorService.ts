import { RandWeaponGenerator } from "./base/weapons/RandWeaponGenerator";
import { CircleGenerator } from "./base/CircleGenerator";
import { normalCircleRadius, wallPartHalfSize } from "../../globals/globalSizes";
import { ChainWeaponGenerator } from "./base/weapons/ChainWeaponGenerator";
import { BuildingGenerator } from "./BuildingGenerator";
import { RectGenerator } from "./base/RectGenerator";
import { GhostTowerGenerator } from "./GhostTowerGenerator";
import { campColors, campHexColors } from "../../globals/globalColors";
import { circleSizeNames } from "../../globals/globalSizes";
import { circleSizes } from "../../globals/globalSizes";

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

    for (let index = 0; index < campColors.length; index++) {
      for (let sizeIndex = 0; sizeIndex < circleSizeNames.length; sizeIndex++) {
        let title = campColors[index] + circleSizeNames[sizeIndex] + "Circle";
        new CircleGenerator(campHexColors[index], scene, title, circleSizes[sizeIndex]);
      }
    }

    for (let index = 0; index < campColors.length; index++) {
      new BuildingGenerator(scene, campColors[index] + "Building", campHexColors[index]);
    }
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
