import { Gameplay } from "../scenes/Gameplay";
import { Tower } from "../units/towers/Tower";

export class PointerService {
  private constructor() {}

  static setupPointerEvents(scene : Gameplay) {
    let input = scene.input;

    input.on(
      "pointermove",
      function(pointer) {
        PointerService.rotatePlayerTowardsMouse(pointer, scene);
      },
      this
    );

    input.on(
      "pointerdown",
      function() {
        scene.player.attack();
      },
      this
    );

    let keyObj = input.keyboard.addKey("F")
    keyObj.on("down", event => {
      //TODO: direction
      scene.towerManager.spawnNewTower(scene.player.x + 160,scene.player.y + 160)
      //new Tower(scene,scene.player.x + 160, scene.player.y + 160, scene.physics.add.group())
    })
  }

  static rotatePlayerTowardsMouse(pointer, scene) {
    let player = scene.player;
    let x = player.x;
    let y = player.y;

    let mainCamera = scene.cameras.main;
    let scrollX = mainCamera.scrollX;
    let scrollY = mainCamera.scrollY;
    let rotation = Phaser.Math.Angle.Between(x, y, pointer.x + scrollX, pointer.y + scrollY);

    let correctionForPhasersMinus90DegreeTopPostion = (Math.PI / 180) * 90;
    player.setRotation(rotation + correctionForPhasersMinus90DegreeTopPostion);
  }
}
