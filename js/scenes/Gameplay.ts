import damage from "../../assets/audio/damage.mp3";
import hit from "../../assets/audio/hit.mp3";
import step from "../../assets/audio/step.mp3";
import { Player } from "../player/Player";
import { PlayerMovement } from "../player/PlayerMovement";
import { RandWeaponGenerator } from "../graphic/generator/RandWeaponGenerator";
import { ChainWeaponGenerator } from "../graphic/generator/ChainWeaponGenerator";
import { CircleGenerator } from "../graphic/generator/CircleGenerator";
import { normalCircleRadius } from "../app/sizes";
import { debugModus } from "../app/config";
import { createAnims } from "../graphic/anims";
import { UnitManager } from "../units/UnitManager";

export class Gameplay extends Phaser.Scene {
  player: Player;
  enemies: any[];
  playerMovement: PlayerMovement;
  polygonOffset: number;
  physics: any;
  unitManager: UnitManager;

  constructor() {
    super("Gameplay");
  }

  private generate() {
    new RandWeaponGenerator(0x6495ed, this).generate();
    new CircleGenerator(
      0x6495ed,
      this,
      "blueCircle",
      normalCircleRadius
    ).generate();
    new CircleGenerator(
      0xff0000,
      this,
      "redCircle",
      normalCircleRadius
    ).generate();
    new ChainWeaponGenerator(0xff0000, this).generate();
  }

  preload() {
    this.load.audio("damage", damage);
    this.load.audio("hit", hit);
    this.load.audio("step", step);
  }

  create() {
    this.generate();
    createAnims(this.anims);

    this.unitManager = new UnitManager(this)
    this.unitManager.spawnUnits()

    if(debugModus){ this.polygonOffset = 0
    }
  }

  update() {
    this.playerMovement.update()
    this.unitManager.checkWeaponOverlap()
  }
}
