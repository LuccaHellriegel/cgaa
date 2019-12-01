// import damage from "../../assets/audio/damage.mp3";
// import hit from "../../assets/audio/hit.mp3";
// import step from "../../assets/audio/step.mp3";
import { Player } from "../units/Player";
import { MovementManager } from "../input/MovementManager";
import { wallPartHalfSize } from "../globals/globalSizes";
import { createAnims } from "../graphic/anims";
import { UnitManager } from "../units/UnitManager";
import { GeneratorService } from "../graphic/generator/GeneratorService";
import { AreaManager } from "../env/AreaManager";
import { debugModus } from "../globals/globalConfig";

export class Gameplay extends Phaser.Scene {
  player: Player;
  enemies: any[];
  playerMovement: MovementManager;
  polygonOffset: number;
  unitManager: UnitManager;
  areaManager: AreaManager;

  constructor() {
    super("Gameplay");
  }

  preload() {
    // this.load.audio("damage", damage);
    // this.load.audio("hit", hit);
    // this.load.audio("step", step);
  }

  create() {
    this.physics.world.setFPS(120);

    GeneratorService.executeGeneration(this);
    createAnims(this.anims);
    new AreaManager(this);
    this.physics.world.setBounds(
      0,
      0,
      this.areaManager.borderWall.width - 4 * wallPartHalfSize,
      this.areaManager.borderWall.width - 4 * wallPartHalfSize
    );

    this.unitManager = new UnitManager(this);
    this.unitManager.spawnUnits();
    this.areaManager.setupAreaColliders();

    if (debugModus) {
      this.polygonOffset = 0;
    }
  }

  update() {
    this.playerMovement.update();
  }
}
