import { Generator } from "../Generator";
import { Gameplay } from "../../../scenes/Gameplay";
import { RectPolygon } from "../../../polygon/RectPolygon";

export class BuildingGenerator extends Generator {
    rectBuilding: RectPolygon;
    constructor(scene: Gameplay) {
        super(0xa9a9a9, scene);
        this.rectBuilding = new RectPolygon(40, 40, 3*80, 80);
      }
    
      generate() {
        this.rectBuilding.draw(this.graphics, 0);
        this.graphics.generateTexture("rectBuilding", 3*80, 80);
        this.destroyUsedObjects()
    }
}