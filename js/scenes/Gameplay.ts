import damage from "../../assets/audio/damage.mp3";
import hit from "../../assets/audio/hit.mp3";
import step from "../../assets/audio/step.mp3";
import { Player } from "../player/Player";
import { PlayerMovement } from "../player/PlayerMovement";
import { debugModus, worldWidth, worldHeight } from "../global";
import { createAnims } from "../graphic/anims";
import { UnitManager } from "../units/UnitManager";
import { GeneratorManager } from "../graphic/generator/GeneratorManager";
import { AreaManager } from "../env/areas/AreaManager";

export class Gameplay extends Phaser.Scene {
  player: Player;
  enemies: any[];
  playerMovement: PlayerMovement;
  polygonOffset: number;
  unitManager: UnitManager;
  areaManager: AreaManager;

  constructor() {
    super("Gameplay");
  }
 
  preload() {
    this.load.audio("damage", damage);
    this.load.audio("hit", hit);
    this.load.audio("step", step);
  }

  create() {
    this.physics.world.setFPS(120)


    new GeneratorManager(this).executeGeneration()
    createAnims(this.anims);
    this.areaManager = new AreaManager(this)
    this.physics.world.setBounds(0, 0,this.areaManager.wallAreas[0].width*3,this.areaManager.wallAreas[0].height*3);

    this.unitManager = new UnitManager(this)
    this.unitManager.spawnUnits()
    this.areaManager.setupAreaColliders()

    
    if(debugModus){ this.polygonOffset = 0
    }
  }

  update() {
    this.playerMovement.update()
    this.unitManager.checkWeaponOverlap()
  }
}
