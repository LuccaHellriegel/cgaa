import { EnemyCircle } from "./circles/EnemyCircle";
import { normalCircleRadius } from "../globals/globalSizes";
import { PositionService } from "../services/PositionService";

export class StateService {
  private constructor() {}

  static executeState(unit: EnemyCircle) {
    let state = unit.state;
    switch (state) {
      case "idle": {
        this.idle(unit);
        break;
      }
      case "guard": {
        this.guard(unit);
        break;
      }
      case "ambush": {
        this.ambush(unit);
        break;
      }
      case "obstacle": {
        this.obstacle(unit);
        break;
      }
    }
  }

  private static obstacle(unit) {}

  private static idle(unit: EnemyCircle) {
    unit.setVelocity(0, 0);
    if (this.checkIfPlayerIsInSight(unit)) unit.state = "guard";
  }

  private static checkIfPlayerIsInSight(unit: EnemyCircle) {
    let distanceBetweenPlayerAndEnemy = Phaser.Math.Distance.Between(
      unit.x,
      unit.y,
      unit.scene.player.x,
      unit.scene.player.y
    );
    //TODO: need real distance
    let weaponsLastPolygonReachesPlayer =
      unit.weapon.polygonArr[unit.weapon.polygonArr.length - 1].height + normalCircleRadius >
      distanceBetweenPlayerAndEnemy;
    return weaponsLastPolygonReachesPlayer;
  }

  private static guard(unit: EnemyCircle) {
    if (!this.checkIfPlayerIsInSight(unit)) {
      unit.state = "idle";
    } else {
      this.moveAndTurnToPlayer(unit);
      if (this.checkIfPlayerIsInReach(unit)) unit.attack();
    }
  }

  private static moveAndTurnToPlayer(unit: EnemyCircle) {
    let radiusOfCirclePlusRadiusOfPlayerPlusWeaponRadius = normalCircleRadius + normalCircleRadius + 32;
    let distanceToPlayerSmallEnough =
      Phaser.Math.Distance.Between(unit.x, unit.y, unit.scene.player.x, unit.scene.player.y) <
      radiusOfCirclePlusRadiusOfPlayerPlusWeaponRadius;
    if (!distanceToPlayerSmallEnough) {
      unit.scene.physics.moveToObject(unit, unit.scene.player, 160);
    } else {
      unit.setVelocity(0, 0);
    }

    let newRotation = Phaser.Math.Angle.Between(unit.x, unit.y, unit.scene.player.x, unit.scene.player.y);
    let correctionForPhasersMinus90DegreeTopPostion = (Math.PI / 180) * 90;
    unit.setRotation(newRotation + correctionForPhasersMinus90DegreeTopPostion);
  }

  private static checkIfPlayerIsInReach(unit: EnemyCircle) {
    let distanceBetweenPlayerAndEnemy = Phaser.Math.Distance.Between(
      unit.x,
      unit.y,
      unit.scene.player.x,
      unit.scene.player.y
    );
    let weaponsLastPolygonReachesPlayer =
      unit.weapon.polygonArr[unit.weapon.polygonArr.length - 1].height + normalCircleRadius >
      distanceBetweenPlayerAndEnemy;
    return weaponsLastPolygonReachesPlayer;
  }

  private static ambush(unit: EnemyCircle) {
    if (unit.pathContainer.path && unit.pathContainer.path[unit.curPosInPath]) {
      let { x, y } = PositionService.relativePosToRealPos(
        unit.pathContainer.path[unit.curPosInPath].x,
        unit.pathContainer.path[unit.curPosInPath].y
      );
      if (Math.abs(unit.x - x) < 2 && Math.abs(unit.y - y) < 2) {
        unit.curPosInPath++;
      } else {
        unit.scene.physics.moveTo(unit, x, y, 160);
      }
    } else if (unit.pathContainer.path && unit.curPosInPath >= unit.pathContainer.path.length) {
      unit.setVelocity(0, 0);
      unit.pathContainer.path = unit.scene.pathManager.mainPath;
      unit.curPosInPath = 0;
    }
  }
}
