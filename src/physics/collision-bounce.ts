import { BitwiseCooperation } from "../engine/BitwiseCooperation";
import { DangerousCircle } from "../units/DangerousCircle";

export function initBounceGroupPair(
  scene: Phaser.Scene,
  cooperation: BitwiseCooperation
) {
  const units = scene.physics.add.staticGroup();
  const obstacles = scene.physics.add.group();
  scene.physics.add.collider(units, obstacles, (unit, obj) => {
    bounceCallback(unit as DangerousCircle, obj, cooperation);
  });

  return {
    addToUnits: function (unit: Phaser.GameObjects.GameObject) {
      units.add(unit);
    },
    addToObstacles: function (obstacle: Phaser.GameObjects.GameObject) {
      obstacles.add(obstacle);
    },
  };
}

function bounceCallback(
  unit: DangerousCircle,
  obj,
  cooperation: BitwiseCooperation
) {
  if (unit.campMask === obj.campMask) {
    unit.stateHandler.moveBack();
  } else if (!cooperation.has(unit.campMask, obj.campMask)) {
    unit.stateHandler.obstacle = obj;
  }
}
