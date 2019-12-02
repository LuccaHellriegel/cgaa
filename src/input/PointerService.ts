export class PointerService {
  static setupPointerEvents(scene) {
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
