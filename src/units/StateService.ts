import { EnemyCircle } from "./circles/EnemyCircle";
import { wallPartHalfSize } from "../globals/globalSizes";
import { PositionService } from "../services/PositionService";
import { WallPart } from "../env/areas/WallPart";
import { Building } from "../env/buildings/Building";

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

  private static obstacle(unit: EnemyCircle) {
    unit.setVelocity(0, 0);
    if (unit.obstacle) {
      this.moveBack(unit);
      this.turnTo(unit, unit.obstacle);
      if (unit.obstacle instanceof WallPart || unit.obstacle instanceof Building) {
        if (unit.pathContainer) {
          unit.state = "ambush";
        }
      } else {
        unit.spotted = unit.obstacle;
        unit.state = "guard";
      }
    }
  }

  private static moveBack(unit) {
    let x = unit.x;
    let y = unit.y;
    let angle = Phaser.Math.Angle.Between(unit.obstacle.x, unit.obstacle.y, x, y);

    let bounceBackDistance = 1;
    let x1 = x + Math.cos(angle) * bounceBackDistance;
    let y1 = y + Math.sin(angle) * bounceBackDistance;
    unit.setPosition(x1, y1);
  }

  private static idle(unit: EnemyCircle) {
    unit.setVelocity(0, 0);
    if (unit.pathContainer) {
      unit.state = "ambush";
    } else {
      unit.state = "guard";
    }
  }

  private static spottedOutOfSight(unit: EnemyCircle) {
    let dist = Phaser.Math.Distance.Between(unit.x, unit.y, unit.spotted.x, unit.spotted.y);
    return dist > 6 * wallPartHalfSize;
  }

  private static guard(unit: EnemyCircle) {
    if (!unit.spotted || this.spottedOutOfSight(unit) || !unit.spotted.scene) {
      unit.spotted = undefined;
      unit.state = "idle";
    } else {
      this.turnTo(unit, unit.spotted);
      let inReach = this.moveTo(unit, unit.spotted);
      if (inReach) unit.attack();
    }
  }

  private static turnTo(unit, obj) {
    let newRotation = Phaser.Math.Angle.Between(unit.x, unit.y, obj.x, obj.y);
    let correctionForPhasersMinus90DegreeTopPostion = (Math.PI / 180) * 90;
    unit.setRotation(newRotation + correctionForPhasersMinus90DegreeTopPostion);
  }

  private static moveTo(unit: EnemyCircle, target) {
    let reachDist = unit.weapon.polygonArr[unit.weapon.polygonArr.length - 1].height;
    let inReach = Phaser.Math.Distance.Between(unit.x, unit.y, target.x, target.y) < reachDist;
    if (!inReach) {
      unit.scene.physics.moveToObject(unit, target, 160);
    } else {
      unit.setVelocity(0, 0);
    }
    return inReach;
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
