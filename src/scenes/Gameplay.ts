import { Player } from "../world/player/Player";
import { Movement } from "../world/player/input/Movement";
import { Enemies } from "../world/enemies/Enemies";
import { World } from "../world/World";
import { Collision } from "../world/collision/Collision";
import { TowerManager } from "../world/player/towers/TowerManager";
import { TowerModus } from "../world/player/input/TowerModus";
import { PathManager } from "../world/enemies/path/PathManager";
import { SpawnManager } from "../world/enemies/spawn/SpawnManager";
import { createAnims } from "../graphics/animation";
import { generateTextures } from "../graphics/textures";
import { setupPointerEvents } from "../world/player/input/mouse";

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
    generateTextures(this);
    createAnims(this.anims);

    new World({ scene: this, type: "world", physicGroupType: "staticGroup" });
    new PathManager({ scene: this, type: "pathManager" });
    new TowerManager({ scene: this, type: "towerManager", physicGroupType: "staticGroup" });
    new SpawnManager({ scene: this, type: "spawnManager" });
    new Enemies({ scene: this, type: "enemies" });

    new TowerModus(this);
    new Collision(this);
    new Movement(this);
    setupPointerEvents(this);
  }

  update() {
    this.movement.update();
  }
}
