import damage from "../../assets/audio/damage.mp3";
import hit from "../../assets/audio/hit.mp3";
import step from "../../assets/audio/step.mp3";
import { Player } from "../player/Player";
import { PlayerMovement } from "../player/PlayerMovement";
import { debugModus } from "../global";
import { createAnims } from "../graphic/anims";
import { UnitManager } from "../units/UnitManager";
import { GeneratorManager } from "../graphic/generator/GeneratorManager";
import { AreaCreator } from "../env/areas/AreaCreator";

export class Gameplay extends Phaser.Scene {
  player: Player;
  enemies: any[];
  playerMovement: PlayerMovement;
  polygonOffset: number;
  physics: any;
  unitManager: UnitManager;
  time: any;

  constructor() {
    super("Gameplay");
  }
 
  preload() {
    this.load.audio("damage", damage);
    this.load.audio("hit", hit);
    this.load.audio("step", step);
  }

  create() {
    this.physics.world.setBounds(0, 0, 2000, 2000);
    this.physics.world.setFPS(120)


    new GeneratorManager(this).executeGeneration()
    createAnims(this.anims);

    this.unitManager = new UnitManager(this)
    this.unitManager.spawnUnits()

    new AreaCreator(this).createArea()

    if(debugModus){ this.polygonOffset = 0
    }
  }

  update() {
    this.playerMovement.update()
    this.unitManager.checkWeaponOverlap()
  }
}
