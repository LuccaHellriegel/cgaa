import { Scene } from "phaser";
import { CampBuilding, BuildingSize } from "../components/CampBuilding";
import { CampStatus } from "../components/GameStatusUI";

interface CampData {
  id: string;
  position: { x: number; y: number };
  buildings: CampBuilding[];
  isSpawning: boolean;
  isQuestTarget: boolean;
  isDestroyed: boolean;
  isCooperating: boolean;
}

export class CampManager {
  private scene: Scene;
  private camps: Map<string, CampData>;

  constructor(scene: Scene) {
    this.scene = scene;
    this.camps = new Map();
  }

  public addCamp(status: CampStatus): void {
    // Create camp data
    const campData: CampData = {
      id: status.id,
      position: status.position,
      buildings: [],
      isSpawning: status.isSpawning,
      isQuestTarget: status.isQuestTarget,
      isDestroyed: status.isDestroyed,
      isCooperating: status.isCooperating,
    };

    // Create buildings for the camp
    const buildingSizes = [
      BuildingSize.LARGE,
      BuildingSize.MEDIUM,
      BuildingSize.SMALL,
    ];
    const buildingOffsets = [
      { x: 0, y: 0 },
      { x: -30, y: 30 },
      { x: 30, y: 30 },
    ];

    buildingSizes.forEach((size, index) => {
      const building = new CampBuilding(
        this.scene,
        status.position.x + buildingOffsets[index].x,
        status.position.y + buildingOffsets[index].y,
        size
      );
      campData.buildings.push(building);
    });

    this.camps.set(status.id, campData);
  }

  public updateCamp(status: CampStatus): void {
    const camp = this.camps.get(status.id);
    if (!camp) return;

    camp.isSpawning = status.isSpawning;
    camp.isQuestTarget = status.isQuestTarget;
    camp.isDestroyed = status.isDestroyed;
    camp.isCooperating = status.isCooperating;
  }

  public getCampStatus(campId: string): CampStatus | undefined {
    const camp = this.camps.get(campId);
    if (!camp) return undefined;

    return {
      id: camp.id,
      position: camp.position,
      isSpawning: camp.isSpawning,
      isQuestTarget: camp.isQuestTarget,
      isDestroyed: camp.isDestroyed,
      isCooperating: camp.isCooperating,
    };
  }

  public getAllCampStatus(): CampStatus[] {
    return Array.from(this.camps.values()).map((camp) => ({
      id: camp.id,
      position: camp.position,
      isSpawning: camp.isSpawning,
      isQuestTarget: camp.isQuestTarget,
      isDestroyed: camp.isDestroyed,
      isCooperating: camp.isCooperating,
    }));
  }

  public isCampDestroyed(campId: string): boolean {
    const camp = this.camps.get(campId);
    if (!camp) return false;

    // A camp is destroyed when all its buildings are destroyed
    return camp.buildings.every((building) => building.isDestroyedState());
  }

  public update(time: number, delta: number): void {
    // Update all camps
    this.camps.forEach((camp) => {
      camp.buildings.forEach((building) => building.update(time, delta));

      // Check if camp is destroyed
      if (!camp.isDestroyed && this.isCampDestroyed(camp.id)) {
        camp.isDestroyed = true;
        camp.isSpawning = false;
        this.scene.events.emit("campDestroyed", camp.id);
      }
    });
  }

  public destroy(): void {
    // Clean up all buildings
    this.camps.forEach((camp) => {
      camp.buildings.forEach((building) => building.destroy());
    });
    this.camps.clear();
  }
}
