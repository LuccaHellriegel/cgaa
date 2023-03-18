import { damageable } from "../engine/damageable";
import { HealthBar } from "../healthbar/HealthBar";
import { Gameplay } from "../scenes/Gameplay";

import { BuildingSetup } from "../config/BuildingSetup";
import { CampID } from "../config/CampSetup";
import { EventSetup } from "../config/EventSetup";
import { nanoid } from "nanoid";

export class Building
  extends Phaser.Physics.Arcade.Image
  implements damageable
{
  id: string;
  polygon: any;
  healthbar: HealthBar;
  scene: Gameplay;

  constructor(
    scene: Gameplay,
    x,
    y,
    addBuildingToPhysics,
    public spawnUnit,
    public campID: CampID,
    public campMask: number
  ) {
    super(scene, x, y, Building.buildingTexture(campID, spawnUnit));
    addBuildingToPhysics(this);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.id = nanoid();

    this.setImmovable(true);

    this.healthbar = new HealthBar(
      x - 25,
      y - BuildingSetup.halfBuildingHeight,
      {
        posCorrectionX: 0,
        posCorrectionY: 0,
        healthWidth: 46,
        healthLength: 12,
        value: 100,
        scene: scene,
      }
    );

    //Needed for gaining souls
    this.type = spawnUnit;
  }

  static buildingTexture(campID, spawnUnit) {
    return campID + spawnUnit + "Building";
  }

  damage(amount: number) {
    if (this.healthbar.decrease(amount)) {
      this.destroy();
    }
  }

  destroy() {
    this.scene.events.emit(EventSetup.essentialUnitKilledEvent, this.campID);
    EventSetup.destroyBuilding(this.scene, this.campID, this.id);
    super.destroy();
    this.healthbar.destroy();
  }
}
