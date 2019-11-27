import { Gameplay } from "../scenes/Gameplay";
import { WallArea } from "../env/areas/WallArea";
import { wallPartRadius } from "../global";
import { AreaPopulator } from "./AreaPopulator";

export class EnemyService {
  private constructor() {}

  static populateArea(wallArea: WallArea, enemyPhysics, enemyWeapons) {
    let scene: Gameplay = wallArea.scene;
    let borderX = wallArea.parts[0].x + wallPartRadius;
    let borderY = wallArea.parts[0].y + wallPartRadius;
    let borderWidth = wallArea.width - 4* wallPartRadius;
    let borderHeight = wallArea.height - 4* wallPartRadius;
    let borderObject = { borderX, borderY, borderWidth, borderHeight };
    new AreaPopulator(scene, enemyPhysics, enemyWeapons, borderObject);
  }
}
