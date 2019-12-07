import { Player } from "../world/player/Player";
import { Movement } from "../world/player/input/Movement";
import { AnimationService } from "../graphics/AnimationService";
import { Enemies } from "../world/enemies/Enemies";
import { GeneratorService } from "../graphics/generators/GeneratorService";
import { World } from "../world/World";
import { PointerService } from "../world/player/input/PointerService";
import { Collision } from "../world/collision/Collision";
import { TowerManager } from "../world/player/towers/TowerManager";
import { TowerModus } from "../world/player/input/TowerModus";
import { PathManager } from "../world/enemies/path/PathManager";
import { SpawnManager } from "../world/enemies/spawn/SpawnManager";

export class Gameplay extends Phaser.Scene {
  player: Player;
  movement: Movement;
  enemies: Enemies;
  world: World;
  pathManager: PathManager;
  spawnManager: SpawnManager;
  towerManager: TowerManager;
  towerModus: TowerModus;

  constructor() {
    super("Gameplay");
  }

  preload() {}

  create() {
    GeneratorService.generateTextures(this);
    AnimationService.createAnims(this.anims);

    new World({ scene: this, type: "world", physicGroupType: "staticGroup" });
    new PathManager({ scene: this, type: "pathManager" });
    new TowerManager({ scene: this, type: "towerManager", physicGroupType: "staticGroup" });
    new SpawnManager({ scene: this, type: "spawnManager" });
    new Enemies({ scene: this, type: "enemies" });

    new TowerModus(this);
    new Collision(this);
    new Movement(this);
    PointerService.setupPointerEvents(this);
  }

  update() {
    this.movement.update();
  }
}
