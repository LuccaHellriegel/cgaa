import { BuildingGenerator } from "../buildings/BuildingGenerator";
import { generateBlockadeTextures } from "../camps/boss/generateBlockadeTextures";
import { CampSetup } from "../config/CampSetup";
import { EnvSetup } from "../config/EnvSetup";
import { UnitSetup } from "../config/UnitSetup";
import {
  TextureChainTuple,
  rectsDrawer,
  emptyRectsDrawer,
  frameAdder,
  textureChain,
} from "../engine/generation";
import { Gameplay } from "../scenes/Gameplay";
import { BossGenerator } from "../units/BossGenerator";
import { CircleGenerator } from "../units/CircleGenerator";
import { DiplomatSymbolGenerator } from "../units/DiplomatSymbolGenerator";
import { InteractionCircleGenerator } from "../units/InteractionCircleGenerator";
import { KingGenerator } from "../units/KingGenerator";

function generatePlayerUnits(scene: Gameplay) {
  new CircleGenerator(
    0x6495ed,
    scene,
    "blueCircle",
    UnitSetup.normalCircleRadius
  );
  generateBlockadeTextures(scene);

  const gridRectMeasurements = {
    width: EnvSetup.gridPartSize,
    height: EnvSetup.gridPartSize,
  };

  const healer: TextureChainTuple = [
    { name: "healer", ...gridRectMeasurements },
    {
      before: rectsDrawer([
        {
          color: 0x013220,
          x: 0,
          y: 0,
          width: EnvSetup.gridPartSize,
          height: EnvSetup.gridPartSize,
        },
      ]),
    },
  ];
  const shooter: TextureChainTuple = [
    { name: "shooter", ...gridRectMeasurements },
    {
      before: rectsDrawer([
        {
          color: 0x6495ed,
          x: 0,
          y: 0,
          width: EnvSetup.gridPartSize,
          height: EnvSetup.gridPartSize,
        },
      ]),
    },
  ];

  const lineWidth = 6;
  const selectorRect = {
    color: 0xffffff,
    x: 0 + lineWidth,
    y: 0 + lineWidth,
    ...gridRectMeasurements,
    lineWidth,
  };
  const errorSelectorRect = {
    color: 0xcc0000,
    x: EnvSetup.gridPartSize + 3 * lineWidth,
    y: 0 + lineWidth,
    ...gridRectMeasurements,
    lineWidth,
  };
  const selectorRectMeasurments = {
    width: EnvSetup.gridPartSize + 2 * lineWidth,
    height: EnvSetup.gridPartSize + 2 * lineWidth,
  };
  const selectorRectFrame = {
    frameName: 1,
    x: 0,
    y: 0,
    ...selectorRectMeasurments,
  };
  const errorSelectorRectFrame = {
    frameName: 2,
    x: EnvSetup.gridPartSize + 2 * lineWidth,
    y: 0,
    ...selectorRectMeasurments,
  };

  const name = "selectorRect";
  const selectorRectTuple: TextureChainTuple = [
    {
      name,
      width: 2 * EnvSetup.gridPartSize + 4 * lineWidth,
      height: EnvSetup.gridPartSize + 4 * lineWidth,
    },
    {
      before: emptyRectsDrawer([selectorRect, errorSelectorRect]),
      after: frameAdder(scene, name, [
        selectorRectFrame,
        errorSelectorRectFrame,
      ]),
    },
  ];

  textureChain(scene, [healer, shooter, selectorRectTuple]);
}

function generateEnemyUnits(scene) {
  CampSetup.campIDs.forEach((id) => {
    if (id !== CampSetup.bossCampID) {
      UnitSetup.circleSizeNames.forEach((circleSizeName) => {
        let title = id + circleSizeName + "Circle";
        new CircleGenerator(
          CampSetup.colorDict[id],
          scene,
          title,
          UnitSetup.sizeDict[circleSizeName]
        );

        title = id + circleSizeName + "Building";
        new BuildingGenerator(
          scene,
          title,
          CampSetup.colorDict[id],
          circleSizeName
        );
      });
      let title = id + "InteractionCircle";
      new InteractionCircleGenerator(
        CampSetup.colorDict[id],
        scene,
        title,
        UnitSetup.smallCircleRadius
      );
    }
  });

  let title = "bossCircle";
  new BossGenerator(scene, title);

  title = "kingCircle";
  new KingGenerator(scene, title);
}

export function generateUnits(scene) {
  generatePlayerUnits(scene);
  generateEnemyUnits(scene);

  DiplomatSymbolGenerator(scene, UnitSetup.smallCircleRadius);
}
