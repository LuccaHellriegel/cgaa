import { Player } from "../units/Player";
import { MovementManager } from "../input/MovementManager";
import { AnimationService } from "../graphic/AnimationService";
import { UnitManager } from "../units/UnitManager";
import { GeneratorService } from "../graphic/generators/GeneratorService";
import { AreaManager } from "../env/AreaManager";
import { PointerService } from "../input/PointerService";

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

  preload() {}

  create() {
    GeneratorService.generateTextures(this);
    AnimationService.createAnims(this.anims);

    new AreaManager(this);
    new UnitManager(this);

    this.areaManager.setupAreaColliders();

    new MovementManager(this.player, this);
    PointerService.setupPointerEvents(this);
  }

  update() {
    this.playerMovement.update();
  }
}
