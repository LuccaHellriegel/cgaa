import { Gameplay } from "../../../scenes/Gameplay";

export class PointerService {
  private constructor() {}

  static setupPointerEvents(scene: Gameplay) {
    let input = scene.input;

    input.on(
      "pointermove",
      function(pointer) {
        let mainCamera = scene.cameras.main;
        let scrollX = mainCamera.scrollX;
        let scrollY = mainCamera.scrollY;
        let x = pointer.x + scrollX;
        let y = pointer.y + scrollY;

        this.rotatePlayerTowardsMouse(x, y, scene);
        scene.towerModus.syncGhostTowerWithMouse(x, y);
      },
      this
    );

    input.on(
      "pointerdown",
      function(pointer) {
        //TODO: only left click
        if (pointer) {
          if (scene.towerModus.isOn) {
            scene.towerManager.spawnNewTower(scene.towerModus.ghostTower.x, scene.towerModus.ghostTower.y);
          } else {
            scene.player.attack();
          }
        }
      },
      this
    );
  }

  static rotatePlayerTowardsMouse(newX, newY, scene) {
    let player = scene.player;
    let x = player.x;
    let y = player.y;

    let rotation = Phaser.Math.Angle.Between(x, y, newX, newY);

    let correctionForPhasersMinus90DegreeTopPostion = (Math.PI / 180) * 90;
    player.setRotation(rotation + correctionForPhasersMinus90DegreeTopPostion);
  }
}
