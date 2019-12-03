import { Player } from "../units/Player";
import { MovementManager } from "../input/MovementManager";
import { AnimationService } from "../graphic/AnimationService";
import { UnitManager } from "../units/UnitManager";
import { GeneratorService } from "../graphic/generators/GeneratorService";
import { AreaManager } from "../env/AreaManager";
import { PointerService } from "../input/PointerService";
import { CollisionService } from "../services/CollisionService";
import { TowerManager } from "../units/towers/TowerManager";

export class Gameplay extends Phaser.Scene {
  player: Player;
  playerMovement: MovementManager;
  unitManager: UnitManager;
  areaManager: AreaManager;
  towerManager: TowerManager;

  constructor() {
    super("Gameplay");
  }

  preload() {}

  create() {
    GeneratorService.generateTextures(this);
    AnimationService.createAnims(this.anims);

    new AreaManager(this);
    new UnitManager(this);

    new TowerManager(this);

    CollisionService.addCollisionDetection(this);

    new MovementManager(this);
    PointerService.setupPointerEvents(this);
  }

  update() {
    this.playerMovement.update();
  }
}
