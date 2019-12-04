import { Manager } from "../base/Base";
import { Gameplay } from "../scenes/Gameplay";
import { AreaService } from "../env/areas/AreaService";

export class PathManager extends Manager {
  walkableArr: Number[][] = [];

  constructor(scene: Gameplay) {
    super(scene, "pathManager");

    this.calculateCumulativeWalkAbleArr();
  }

  private calculateCumulativeWalkAbleArr() {
    let walkableArrArr: number[][][][] = [];
    this.scene.areaManager.executeForEachAreaRow(areaRow => {
      let row: number[][][] = [];
      areaRow.forEach(area => {
        row.push(AreaService.createWalkableArr(area.parts));
      });
      walkableArrArr.push(row);
    });
    this.walkableArr = AreaService.createCumulativeWalkableArr(walkableArrArr);
  }
}
