import { MovementManager } from "../input/MovementManager";
import { CircleWithWeapon } from "./circles/CircleWithWeapon";
import {
  playerStartX,
  playerStartY,
  playerTextureName
} from "../globals/globalConfig";
import { ChainWeapon } from "../weapons/ChainWeapon";
export class Player extends CircleWithWeapon {
  constructor(scene, physicsGroup, weapon) {
    super(
      scene,
      playerStartX,
      playerStartY,
      playerTextureName,
      physicsGroup,
      weapon
    );
    this.setCollideWorldBounds(true);
    this.setup();
  }

  setup() {
    this.unitType = "player";
    this.scene.player = this;
    this.scene.cameras.main.startFollow(this.scene.player);
    this.scene.playerMovement = new MovementManager(
      this.scene.player,
      this.scene
    );
    this.setupPointerEvents();
  }

  setupPointerEvents() {
    let input = this.scene.input;
    input.on(
      "pointermove",
      function(pointer) {
        this.rotatePlayerTowardsMouse(pointer);
      },
      this
    );

    input.on(
      "pointerdown",
      function() {
        this.attack();
      },
      this
    );
  }

  rotatePlayerTowardsMouse(pointer) {
    let mainCamera = this.scene.cameras.main;
    let scrollX = mainCamera.scrollX;
    let scrollY = mainCamera.scrollY;
    let rotation = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      pointer.x + scrollX,
      pointer.y + scrollY
    );

    let correctionForPhasersMinus90DegreeTopPostion = (Math.PI / 180) * 90;
    this.setRotation(rotation + correctionForPhasersMinus90DegreeTopPostion);
  }

  static withChainWeapon(scene) {
    return new Player(
      scene,
      scene.physics.add.group(),
      new ChainWeapon(
        scene,
        playerStartX,
        playerStartY,
        scene.physics.add.group(),
        5,
        2
      )
    );
  }
}
