import { Player } from "../units/Player";
import { Movement } from "../ui/input/Movement";
import { AnimationService } from "../graphic/AnimationService";
import { EnemyManager } from "../units/EnemyManager";
import { GeneratorService } from "../graphic/generators/GeneratorService";
import { AreaManager } from "../env/AreaManager";
import { PointerService } from "../ui/input/PointerService";
import { ColliderService } from "../services/ColliderService";
import { TowerManager } from "../units/towers/TowerManager";
import { TowerModusManager } from "../ui/input/TowerModusManager";

export class Gameplay extends Phaser.Scene {
  player: Player;
  movement: Movement;
  enemyManager: EnemyManager;
  areaManager: AreaManager;
  towerManager: TowerManager;
  towerModusManager: TowerModusManager;

  constructor() {
    super("Gameplay");
  }

  preload() {}

  create() {
    GeneratorService.generateTextures(this);
    AnimationService.createAnims(this.anims);

    new AreaManager(this);
    new EnemyManager(this);

    new TowerManager(this);
    new TowerModusManager(this);

    ColliderService.addCollisionDetection(this);

    new Movement(this);
    PointerService.setupPointerEvents(this);
  }

  update() {
    this.movement.update();
  }
}
